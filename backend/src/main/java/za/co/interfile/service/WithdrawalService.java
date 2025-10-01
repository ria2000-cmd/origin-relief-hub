package za.co.interfile.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.co.interfile.dtos.WithdrawalRequestDTO;
import za.co.interfile.dtos.WithdrawalResponseDTO;
import za.co.interfile.enums.WithdrawalMethod;
import za.co.interfile.enums.WithdrawalStatus;
import za.co.interfile.exception.InsufficientBalanceException;
import za.co.interfile.exception.WithdrawalException;
import za.co.interfile.model.UserBalance;
import za.co.interfile.model.Users;
import za.co.interfile.model.WithdrawalRequest;
import za.co.interfile.repository.UserBalanceRepository;
import za.co.interfile.repository.UsersRepository;
import za.co.interfile.repository.WithdrawalRequestRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class WithdrawalService {

    private final UsersRepository usersRepository;
    private final UserBalanceRepository userBalanceRepository;
    private final WithdrawalRequestRepository withdrawalRequestRepository;
    private final ObjectMapper objectMapper;

    private static final BigDecimal FEE_PERCENTAGE = new BigDecimal("2.00");
    private static final BigDecimal MIN_WITHDRAWAL = new BigDecimal("10.00");
    private static final BigDecimal MAX_WITHDRAWAL = new BigDecimal("50000.00");

    @Transactional
    public WithdrawalResponseDTO processWithdrawal(Long userId, WithdrawalRequestDTO request) {
        log.info("Processing withdrawal for user ID: {}, Amount: R{}", userId, request.getAmount());

        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new WithdrawalException("User not found"));

        if (!user.canWithdraw()) {
            throw new WithdrawalException(
                    "You are not eligible to withdraw. Please ensure your account is active, " +
                            "verified, and linked to a SASSA account."
            );
        }

        UserBalance userBalance = user.getUserBalance();
        if (userBalance == null) {
            throw new WithdrawalException("No balance information found");
        }

        BigDecimal availableBalance = userBalance.getAvailableBalance();
        BigDecimal requestedAmount = request.getAmount();

        if (requestedAmount.compareTo(MIN_WITHDRAWAL) < 0) {
            throw new WithdrawalException("Minimum withdrawal amount is R10.00");
        }

        if (requestedAmount.compareTo(MAX_WITHDRAWAL) > 0) {
            throw new WithdrawalException("Maximum withdrawal amount is R50,000.00");
        }

        BigDecimal calculatedFees = requestedAmount
                .multiply(FEE_PERCENTAGE)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

        BigDecimal netAmount = requestedAmount.subtract(calculatedFees);

        if (availableBalance.compareTo(requestedAmount) < 0) {
            log.warn("Insufficient balance. Available: R{}, Requested: R{}",
                    availableBalance, requestedAmount);
            throw new InsufficientBalanceException(
                    String.format("Insufficient balance. Available: R%.2f, Requested: R%.2f",
                            availableBalance, requestedAmount)
            );
        }

        String transactionRef = "WTX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        String bankDetailsJson = createBankDetailsJson(
                request.getAccountNumber(),
                request.getBankName(),
                request.getAccountHolderName(),
                request.getAccountType()
        );

        WithdrawalRequest withdrawalEntity = WithdrawalRequest.builder()
                .user(user)
                .requestedAmount(requestedAmount)
                .calculatedFees(calculatedFees)
                .netAmount(netAmount)
                .withdrawalMethod(WithdrawalMethod.BANK_TRANSFER)
                .bankDetails(bankDetailsJson)
                .status(WithdrawalStatus.PENDING)
                .requestedAt(LocalDateTime.now())
                .userBalanceBefore(availableBalance)
                .transactionReference(transactionRef)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .retryCount(0)
                .build();

        WithdrawalRequest savedWithdrawal = withdrawalRequestRepository.save(withdrawalEntity);

        BigDecimal newBalance = availableBalance.subtract(requestedAmount);
        userBalance.setAvailableBalance(newBalance);
        userBalance.setLastUpdated(LocalDateTime.now());
        userBalanceRepository.save(userBalance);

        savedWithdrawal.setUserBalanceAfter(newBalance);
        withdrawalRequestRepository.save(savedWithdrawal);

        log.info("Withdrawal request created successfully. ID: {}, Ref: {}",
                savedWithdrawal.getWithdrawalId(), transactionRef);
        
        return WithdrawalResponseDTO.builder()
                .success(true)
                .message("Withdrawal request submitted successfully. Processing time: 1-3 business days.")
                .withdrawalId(savedWithdrawal.getWithdrawalId())
                .amount(requestedAmount)
                .remainingBalance(newBalance)
                .status(WithdrawalStatus.PENDING.toString())
                .transactionReference(transactionRef)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Transactional(readOnly = true)
    public BigDecimal getUserBalance(Long userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new WithdrawalException("User not found"));

        UserBalance balance = user.getUserBalance();
        return balance != null ? balance.getAvailableBalance() : BigDecimal.ZERO;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> calculateWithdrawalBreakdown(BigDecimal amount) {
        BigDecimal fees = amount
                .multiply(FEE_PERCENTAGE)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

        BigDecimal netAmount = amount.subtract(fees);

        Map<String, Object> breakdown = new HashMap<>();
        breakdown.put("requestedAmount", amount);
        breakdown.put("fees", fees);
        breakdown.put("feePercentage", FEE_PERCENTAGE);
        breakdown.put("netAmount", netAmount);

        return breakdown;
    }

    private String createBankDetailsJson(String accountNumber, String bankName,
                                         String accountHolder, String accountType) {
        try {
            Map<String, String> bankDetails = new HashMap<>();
            bankDetails.put("accountNumber", accountNumber);
            bankDetails.put("bankName", bankName);
            bankDetails.put("accountHolder", accountHolder);
            bankDetails.put("accountType", accountType);

            return objectMapper.writeValueAsString(bankDetails);
        } catch (JsonProcessingException e) {
            log.error("Failed to create bank details JSON", e);
            throw new WithdrawalException("Failed to process bank details");
        }
    }
}