package za.co.interfile.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.co.interfile.dtos.CashSendRequestDto;
import za.co.interfile.dtos.CashSendResponseDto;
import za.co.interfile.enums.CashSendStatus;
import za.co.interfile.exception.InsufficientBalanceException;
import za.co.interfile.model.CashSendTransaction;
import za.co.interfile.model.SassaAccounts;
import za.co.interfile.model.UserBalance;
import za.co.interfile.model.Users;
import za.co.interfile.repository.CashSendRepository;
import za.co.interfile.repository.SassaAccountsRepository;
import za.co.interfile.repository.UserBalanceRepository;
import za.co.interfile.repository.UsersRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CashSendService {

    private final CashSendRepository cashSendRepository;
    private final UserBalanceRepository userBalanceRepository;
    private final SassaAccountsRepository sassaAccountRepository;

    private static final BigDecimal CASH_SEND_FEE = new BigDecimal("3.50");
    private static final BigDecimal MIN_AMOUNT = new BigDecimal("10.00");
    private static final BigDecimal MAX_AMOUNT = new BigDecimal("3000.00");

    public CashSendResponseDto processCashSend(CashSendRequestDto request, Users user) {
        validateAmount(request.getAmount());

        SassaAccounts sassaAccount = sassaAccountRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("SASSA account not found. Please link your SASSA account first."));

        if (!sassaAccount.isActive()) {
            throw new RuntimeException("SASSA account is not active. Status: " + sassaAccount.getStatus());
        }

        UserBalance userBalance = userBalanceRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("User balance not found"));

        BigDecimal amount = request.getAmount();
        BigDecimal totalCost = amount.add(CASH_SEND_FEE);

        if (userBalance.getAvailableBalance().compareTo(totalCost) < 0) {
            throw new InsufficientBalanceException(
                    String.format("Insufficient balance. Available: R%.2f, Required: R%.2f",
                            userBalance.getAvailableBalance(), totalCost)
            );
        }

        BigDecimal newAvailableBalance = userBalance.getAvailableBalance().subtract(totalCost);
        BigDecimal newTotalWithdrawn = userBalance.getTotalWithdrawn().add(totalCost);

        userBalance.setAvailableBalance(newAvailableBalance);
        userBalance.setTotalWithdrawn(newTotalWithdrawn);
        userBalanceRepository.save(userBalance);

        CashSendTransaction transaction = CashSendTransaction.builder()
                .amount(amount)
                .fee(CASH_SEND_FEE)
                .totalCost(totalCost)
                .recipientPhone(request.getRecipientPhone())
                .recipientName(request.getRecipientName())
                .message(request.getMessage())
                .voucherCode(generateVoucherCode())
                .pin(generatePin())
                .status(CashSendStatus.ACTIVE)
                .user(user)
                .transactionReference(generateTransactionReference())
                .build();

        cashSendRepository.save(transaction);

        return CashSendResponseDto.builder()
                .success(true)
                .message("Cash send successful")
                .cashSendId(transaction.getCashSendId())
                .voucherCode(transaction.getVoucherCode())
                .pin(transaction.getPin())
                .amount(amount)
                .fee(CASH_SEND_FEE)
                .totalCost(totalCost)
                .remainingBalance(newAvailableBalance)
                .recipientPhone(request.getRecipientPhone())
                .recipientName(request.getRecipientName())
                .expiryDate(transaction.getExpiresAt())
                .timestamp(LocalDateTime.now())
                .build();
    }

    private void validateAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }
        if (amount.compareTo(MIN_AMOUNT) < 0) {
            throw new IllegalArgumentException("Minimum cash send amount is R10.00");
        }
        if (amount.compareTo(MAX_AMOUNT) > 0) {
            throw new IllegalArgumentException("Maximum cash send amount is R3,000.00");
        }
    }

    private String generateVoucherCode() {
        String code;
        do {
            code = String.format("%012d", new Random().nextInt(1000000000));
        } while (cashSendRepository.existsByVoucherCode(code));
        return code;
    }

    private String generatePin() {
        return String.format("%04d", new Random().nextInt(10000));
    }

    private String generateTransactionReference() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String random = String.format("%06d", new Random().nextInt(1000000));
        return "CS-" + date + "-" + random;
    }


    public List<CashSendResponseDto> getCashSendHistory(Users user) {
        List<CashSendTransaction> transactions = cashSendRepository.findByUserUserIdOrderByCreatedAtDesc(user.getUserId());

        return transactions.stream()
                .map(transaction -> CashSendResponseDto.builder()
                        .success(true)
                        .message("Transaction completed")
                        .transactionReference(transaction.getTransactionReference())
                        .amount(transaction.getAmount())
                        .recipientPhone(transaction.getRecipientPhone())
                        .timestamp(transaction.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}