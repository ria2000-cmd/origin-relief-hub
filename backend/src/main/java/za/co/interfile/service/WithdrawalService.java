
package za.co.interfile.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.co.interfile.dtos.UserBalanceDetailsDTO;
import za.co.interfile.dtos.WithdrawalRequestDTO;
import za.co.interfile.dtos.WithdrawalResponseDTO;
import za.co.interfile.enums.TransactionType;
import za.co.interfile.enums.TransactionStatus;
import za.co.interfile.model.Transaction;
import za.co.interfile.model.UserBalance;
import za.co.interfile.model.Users;
import za.co.interfile.repository.UsersRepository;
import za.co.interfile.repository.TransactionRepository;
import za.co.interfile.repository.UserBalanceRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class WithdrawalService {

    private final UsersRepository usersRepository;
    private final TransactionRepository transactionRepository;
    private final UserBalanceRepository userBalanceRepository;

    private static final BigDecimal MIN_WITHDRAWAL = new BigDecimal("25.00");
    private static final BigDecimal MAX_WITHDRAWAL = new BigDecimal("5000.00");

    public WithdrawalResponseDTO processWithdrawal(WithdrawalRequestDTO request) {
        try {
            log.info("Processing withdrawal for ID: {}", request.getIdNumber());

            Users user = usersRepository.findByIdNumber(request.getIdNumber())
                    .orElse(null);

            if (user == null) {
                return createErrorResponse("User not found with the provided ID number");
            }


            if (!user.canWithdraw()) {
                String reason = determineIneligibilityReason(user);
                return createErrorResponse("Withdrawal not allowed: " + reason);
            }

            UserBalance userBalance = user.getUserBalance();
            if (userBalance == null) {
                return createErrorResponse("User balance not found");
            }

            UserBalance.WithdrawalValidationResult validation =
                    userBalance.validateWithdrawal(request.getAmount(), MIN_WITHDRAWAL, MAX_WITHDRAWAL);

            if (!validation.isValid()) {
                return new WithdrawalResponseDTO(
                        false,
                        validation.getMessage(),
                        null,
                        userBalance.getAvailableBalance(),
                        userBalance.getAvailableBalance(),
                        null,
                        null
                );
            }


            BigDecimal previousBalance = userBalance.getAvailableBalance();

            boolean withdrawalSuccess = userBalance.withdrawFunds(request.getAmount());

            if (!withdrawalSuccess) {
                return createErrorResponse("Withdrawal processing failed");
            }

            userBalanceRepository.save(userBalance);

            String referenceNumber = generateReferenceNumber();

            Transaction transaction = createTransactionRecord(user, request, referenceNumber);
            transactionRepository.save(transaction);

            user.setUpdatedAt(LocalDateTime.now());
            usersRepository.save(user);

            log.info("Withdrawal successful for user: {} | Amount: {} | New Balance: {}",
                    user.getIdNumber(), request.getAmount(), userBalance.getAvailableBalance());

            return new WithdrawalResponseDTO(
                    true,
                    "Withdrawal processed successfully",
                    request.getAmount(),
                    previousBalance,
                    userBalance.getAvailableBalance(),
                    referenceNumber,
                    transaction.getTransactionId().toString()
            );

        } catch (Exception e) {
            log.error("Error processing withdrawal for ID {}: ", request.getIdNumber(), e);
            return createErrorResponse("System error occurred. Please try again later.");
        }
    }

    public WithdrawalResponseDTO getUserBalanceInfo(String idNumber) {
        try {
            Users user = usersRepository.findByIdNumber(idNumber)
                    .orElse(null);

            if (user == null) {
                return createErrorResponse("User not found");
            }

            UserBalance balance = user.getUserBalance();
            if (balance == null) {
                return new WithdrawalResponseDTO(
                        false, "No balance record found",
                        null, BigDecimal.ZERO, BigDecimal.ZERO, null, null
                );
            }

            return new WithdrawalResponseDTO(
                    true,
                    "Balance retrieved successfully",
                    null,
                    balance.getAvailableBalance(),
                    balance.getAvailableBalance(),
                    null,
                    balance.getBalanceStatus()
            );

        } catch (Exception e) {
            log.error("Error retrieving balance for ID {}: ", idNumber, e);
            return createErrorResponse("Error retrieving balance");
        }
    }

    public UserBalanceDetailsDTO getDetailedBalance(String idNumber) {
        Users user = usersRepository.findByIdNumber(idNumber).orElse(null);

        if (user == null || user.getUserBalance() == null) {
            return new UserBalanceDetailsDTO();
        }

        UserBalance balance = user.getUserBalance();
        return UserBalanceDetailsDTO.builder()
                .availableBalance(balance.getAvailableBalance())
                .pendingBalance(balance.getPendingBalance())
                .totalBalance(balance.getTotalBalance())
                .totalReceived(balance.getTotalReceived())
                .totalWithdrawn(balance.getTotalWithdrawn())
                .netBalance(balance.getNetBalance())
                .formattedAvailableBalance(balance.getFormattedAvailableBalance())
                .formattedTotalBalance(balance.getFormattedTotalBalance())
                .balanceStatus(balance.getBalanceStatus())
                .balanceStatusCssClass(balance.getBalanceStatusCssClass())
                .canWithdraw(user.canWithdraw())
                .minWithdrawal(MIN_WITHDRAWAL)
                .maxWithdrawal(MAX_WITHDRAWAL)
                .lastUpdated(balance.getLastUpdated())
                .build();
    }

    // Helper methods
    private String determineIneligibilityReason(Users user) {
        if (!user.isActive()) {
            return "Account is not active";
        }
        if (!user.hasVerifiedEmail()) {
            return "Email not verified";
        }
        if (!user.hasActiveSassaAccount()) {
            return "No active SASSA account linked";
        }
        if (!user.hasAnyBalance()) {
            return "No available balance";
        }
        return "Account verification incomplete";
    }

    private String generateReferenceNumber() {
        return "WD" + System.currentTimeMillis() +
                UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    private Transaction createTransactionRecord(Users user, WithdrawalRequestDTO request, String referenceNumber) {
        return Transaction.builder()
                .user(user)
                .transactionType(TransactionType.WITHDRAWAL)
                .amount(request.getAmount())
                .status(TransactionStatus.COMPLETED)
                .referenceNumber(referenceNumber)
                .description(request.getDescription() != null ? request.getDescription() : "Demo withdrawal")
                .createdAt(LocalDateTime.now())
                .build();
    }

    private WithdrawalResponseDTO createErrorResponse(String message) {
        return new WithdrawalResponseDTO(false, message, null, null, null, null, null);
    }
}