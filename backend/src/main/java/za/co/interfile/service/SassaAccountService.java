package za.co.interfile.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.co.interfile.dtos.LinkSassaAccountRequest;
import za.co.interfile.dtos.LinkSassaAccountResponse;
import za.co.interfile.enums.SassaStatus;
import za.co.interfile.exception.SassaAccountException;
import za.co.interfile.model.SassaAccounts;
import za.co.interfile.model.Users;
import za.co.interfile.repository.SassaAccountsRepository;
import za.co.interfile.repository.UsersRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SassaAccountService {

    private final SassaAccountsRepository sassaAccountsRepository;
    private final UsersRepository usersRepository;

    @Transactional
    public LinkSassaAccountResponse linkSassaAccount(Long userId, LinkSassaAccountRequest request) {
        log.info("Attempting to link SASSA account for user ID: {}", userId);

        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new SassaAccountException("User not found"));

        if (!user.getIdNumber().equals(request.getIdNumber())) {
            log.warn("ID number mismatch for user ID: {}. Provided: {}, Expected: {}",
                    userId, request.getIdNumber(), user.getIdNumber());
            throw new SassaAccountException("ID number does not match your profile");
        }

        if (user.hasActiveSassaAccount()) {
            SassaAccounts existingAccount = user.getActiveSassaAccount();
            log.info("User already has an active SASSA account: {}", existingAccount.getSassaAccountId());

            return LinkSassaAccountResponse.builder()
                    .success(false)
                    .message("You already have an active SASSA account linked")
                    .sassaAccountId(existingAccount.getSassaAccountId())
                    .accountNumber(existingAccount.getAccountNumber())
                    .status(existingAccount.getStatus().toString())
                    .build();
        }

        Optional<SassaAccounts> sassaAccountOpt = sassaAccountsRepository
                .findByIdNumber(request.getIdNumber());

        if (sassaAccountOpt.isEmpty()) {
            log.warn("No SASSA account found for ID number: {}", request.getIdNumber());
            throw new SassaAccountException("No SASSA account found with this ID number");
        }

        SassaAccounts sassaAccount = sassaAccountOpt.get();

        if (sassaAccount.getUser() != null && !sassaAccount.getUser().getUserId().equals(userId)) {
            log.warn("SASSA account already linked to another user. Account ID: {}",
                    sassaAccount.getSassaAccountId());
            throw new SassaAccountException("This SASSA account is already linked to another user");
        }

        if (sassaAccount.getStatus() == SassaStatus.SUSPENDED ||
                sassaAccount.getStatus() == SassaStatus.CLOSED) {
            log.warn("SASSA account is not active. Status: {}", sassaAccount.getStatus());
            throw new SassaAccountException("This SASSA account is " +
                    sassaAccount.getStatus().toString().toLowerCase() + " and cannot be linked");
        }

        // 7. Link the account
        sassaAccount.setUser(user);
        sassaAccount.setStatus(SassaStatus.ACTIVE);
        sassaAccount.setUpdatedAt(LocalDateTime.now());

        SassaAccounts savedAccount = sassaAccountsRepository.save(sassaAccount);

        log.info("Successfully linked SASSA account {} to user {}",
                savedAccount.getSassaAccountId(), userId);

        return LinkSassaAccountResponse.builder()
                .success(true)
                .message("SASSA account successfully linked")
                .sassaAccountId(savedAccount.getSassaAccountId())
                .accountNumber(savedAccount.getAccountNumber())
                .status(savedAccount.getStatus().toString())
                .build();
    }

    @Transactional(readOnly = true)
    public SassaAccounts getUserActiveSassaAccount(Long userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new SassaAccountException("User not found"));

        return user.getActiveSassaAccount();
    }

    @Transactional
    public void unlinkSassaAccount(Long userId, Long sassaAccountId) {
        log.info("Attempting to unlink SASSA account {} from user {}", sassaAccountId, userId);

        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new SassaAccountException("User not found"));

        SassaAccounts sassaAccount = sassaAccountsRepository.findById(sassaAccountId)
                .orElseThrow(() -> new SassaAccountException("SASSA account not found"));

        // Verify the account belongs to the user
        if (!sassaAccount.getUser().getUserId().equals(userId)) {
            throw new SassaAccountException("This SASSA account does not belong to you");
        }

        // Unlink
        sassaAccount.setUser(null);
        sassaAccount.setStatus(SassaStatus.PENDING_VERIFICATION);
        sassaAccount.setUpdatedAt(LocalDateTime.now());

        sassaAccountsRepository.save(sassaAccount);

        log.info("Successfully unlinked SASSA account {} from user {}", sassaAccountId, userId);
    }

    public BigDecimal getBalanceBySassaId(Long sassaAccountId, Long userId) {
        log.info("Fetching balance for SASSA account ID: {} and user ID: {}", sassaAccountId, userId);

        SassaAccounts sassaAccount = sassaAccountsRepository.findById(sassaAccountId)
                .orElseThrow(() -> new SassaAccountException("SASSA account not found"));

        if (sassaAccount.getUser() == null || !sassaAccount.getUser().getUserId().equals(userId)) {
            throw new SassaAccountException("This SASSA account does not belong to you");
        }

        if (sassaAccount.getStatus() != SassaStatus.ACTIVE) {
            throw new SassaAccountException("SASSA account is not active");
        }

        // Return the monthly amount as available balance
        // TODO: In future, subtract transactions made this month
        return sassaAccount.getMonthlyAmount();
    }
}