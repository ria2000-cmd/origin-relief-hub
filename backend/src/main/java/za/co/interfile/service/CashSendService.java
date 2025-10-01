package za.co.interfile.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.co.interfile.dtos.CashSendRequestDto;
import za.co.interfile.dtos.CashSendResponseDto;
import za.co.interfile.enums.CashSendStatus;
import za.co.interfile.exception.CashSendException;
import za.co.interfile.exception.InsufficientBalanceException;
import za.co.interfile.model.CashSendTransaction;
import za.co.interfile.model.UserBalance;
import za.co.interfile.model.Users;
import za.co.interfile.repository.CashSendRepository;
import za.co.interfile.repository.UserBalanceRepository;
import za.co.interfile.repository.UsersRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CashSendService {

    private final UsersRepository usersRepository;
    private final UserBalanceRepository userBalanceRepository;
    private final CashSendRepository cashSendRepository;

    // Fee configuration - R3.50 flat fee per cash send
    private static final BigDecimal CASH_SEND_FEE = new BigDecimal("3.50");
    private static final BigDecimal MIN_AMOUNT = new BigDecimal("10.00");
    private static final BigDecimal MAX_AMOUNT = new BigDecimal("3000.00");
    private static final int VOUCHER_CODE_LENGTH = 16;
    private static final int PIN_LENGTH = 6;

    @Transactional
    public CashSendResponseDto sendCash(Long userId, CashSendRequestDto request) {
        log.info("Processing cash send for user ID: {}, Amount: R{}, Recipient: {}",
                userId, request.getAmount(), request.getRecipientPhone());

        // 1. Get user
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new CashSendException("User not found"));

        // 2. Check if user is active and verified
        if (!user.isActive()) {
            throw new CashSendException("Your account must be active to send cash");
        }

        if (!user.hasVerifiedEmail() && !user.hasVerifiedPhone()) {
            throw new CashSendException("Please verify your email or phone number to send cash");
        }

        // 3. Get user balance
        UserBalance userBalance = user.getUserBalance();
        if (userBalance == null) {
            throw new CashSendException("No balance information found");
        }

        BigDecimal availableBalance = userBalance.getAvailableBalance();
        BigDecimal amount = request.getAmount();

        // 4. Validate amount
        if (amount.compareTo(MIN_AMOUNT) < 0) {
            throw new CashSendException("Minimum cash send amount is R10.00");
        }

        if (amount.compareTo(MAX_AMOUNT) > 0) {
            throw new CashSendException("Maximum cash send amount is R3,000.00");
        }

        // 5. Calculate total cost (amount + fee)
        BigDecimal totalCost = amount.add(CASH_SEND_FEE);

        // 6. Check sufficient balance
        if (availableBalance.compareTo(totalCost) < 0) {
            log.warn("Insufficient balance. Available: R{}, Required: R{}",
                    availableBalance, totalCost);
            throw new InsufficientBalanceException(
                    String.format("Insufficient balance. Available: R%.2f, Required: R%.2f (includes R%.2f fee)",
                            availableBalance, totalCost, CASH_SEND_FEE)
            );
        }

        // 7. Generate voucher code and PIN
        String voucherCode = generateVoucherCode();
        String pin = generatePIN();
        String transactionRef = "CS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // 8. Create cash send transaction
        CashSendTransaction cashSend = CashSendTransaction.builder()
                .user(user)
                .amount(amount)
                .fee(CASH_SEND_FEE)
                .totalCost(totalCost)
                .recipientPhone(formatPhoneNumber(request.getRecipientPhone()))
                .recipientName(request.getRecipientName())
                .voucherCode(voucherCode)
                .pin(pin)
                .message(request.getMessage())
                .status(CashSendStatus.ACTIVE)
                .transactionReference(transactionRef)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(30))
                .build();

        CashSendTransaction savedCashSend = cashSendRepository.save(cashSend);

        BigDecimal newBalance = availableBalance.subtract(totalCost);
        userBalance.setAvailableBalance(newBalance);
        userBalance.setLastUpdated(LocalDateTime.now());
        userBalanceRepository.save(userBalance);

        log.info("Cash send successful. Voucher: {}, Ref: {}", voucherCode, transactionRef);


        return CashSendResponseDto.builder()
                .success(true)
                .message("Cash send successful. Share the voucher code and PIN with the recipient.")
                .cashSendId(savedCashSend.getCashSendId())
                .voucherCode(voucherCode)
                .pin(pin)
                .amount(amount)
                .fee(CASH_SEND_FEE)
                .totalCost(totalCost)
                .remainingBalance(newBalance)
                .recipientPhone(formatPhoneNumber(request.getRecipientPhone()))
                .recipientName(request.getRecipientName())
                .expiryDate(savedCashSend.getExpiresAt())
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Transactional(readOnly = true)
    public BigDecimal calculateCashSendCost(BigDecimal amount) {
        return amount.add(CASH_SEND_FEE);
    }

    private String generateVoucherCode() {
        SecureRandom random = new SecureRandom();
        StringBuilder code = new StringBuilder();

        for (int i = 0; i < VOUCHER_CODE_LENGTH; i++) {
            if (i > 0 && i % 4 == 0) {
                code.append("-");
            }
            code.append(random.nextInt(10));
        }

        return code.toString();
    }

    private String generatePIN() {
        SecureRandom random = new SecureRandom();
        StringBuilder pin = new StringBuilder();

        for (int i = 0; i < PIN_LENGTH; i++) {
            pin.append(random.nextInt(10));
        }

        return pin.toString();
    }

    private String formatPhoneNumber(String phone) {
        // Convert to standard SA format: +27XXXXXXXXX
        phone = phone.replaceAll("[^0-9+]", "");

        if (phone.startsWith("0")) {
            phone = "+27" + phone.substring(1);
        } else if (!phone.startsWith("+")) {
            phone = "+" + phone;
        }

        return phone;
    }
}