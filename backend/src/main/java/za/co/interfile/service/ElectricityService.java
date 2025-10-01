package za.co.interfile.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.co.interfile.dtos.ElectricityPurchaseResponseDto;
import za.co.interfile.dtos.ElectricityPurchaseRequestDto;
import za.co.interfile.enums.ElectricityTransactionStatus;
import za.co.interfile.exception.InsufficientBalanceException;
import za.co.interfile.model.ElectricityTransaction;
import za.co.interfile.model.SassaAccounts;
import za.co.interfile.model.UserBalance;
import za.co.interfile.model.Users;
import za.co.interfile.repository.ElectricityTransactionRepository;
import za.co.interfile.repository.SassaAccountsRepository;
import za.co.interfile.repository.UserBalanceRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ElectricityService {

    private final ElectricityTransactionRepository electricityRepository;
    private final UserBalanceRepository userBalanceRepository;
    private final SassaAccountsRepository sassaAccountRepository;

    private static final BigDecimal ELECTRICITY_FEE = new BigDecimal("2.50");
    private static final BigDecimal MIN_AMOUNT = new BigDecimal("20.00");
    private static final BigDecimal MAX_AMOUNT = new BigDecimal("5000.00");
    private static final BigDecimal RATE_PER_UNIT = new BigDecimal("2.2222"); // R2.22 per kWh

    public ElectricityPurchaseResponseDto purchaseElectricity(ElectricityPurchaseRequestDto request, Users user) {
        // 1. Validate amount
        validateAmount(request.getAmount());

        // 2. Verify user has SASSA account and it's active
        SassaAccounts sassaAccount = sassaAccountRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("SASSA account not found. Please link your SASSA account first."));

        if (!sassaAccount.isActive()) {
            throw new RuntimeException("SASSA account is not active. Status: " + sassaAccount.getStatus());
        }

        // 3. Get user balance
        UserBalance userBalance = userBalanceRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("User balance not found"));

        // 4. Calculate total cost and units
        BigDecimal amount = request.getAmount();
        BigDecimal totalCost = amount.add(ELECTRICITY_FEE);
        BigDecimal units = amount.divide(RATE_PER_UNIT, 2, RoundingMode.HALF_UP);

        // 5. Check sufficient available balance
        if (userBalance.getAvailableBalance().compareTo(totalCost) < 0) {
            throw new InsufficientBalanceException(
                    String.format("Insufficient balance. Available: R%.2f, Required: R%.2f",
                            userBalance.getAvailableBalance(), totalCost)
            );
        }

        // 6. Deduct from available balance and update total withdrawn
        BigDecimal newAvailableBalance = userBalance.getAvailableBalance().subtract(totalCost);
        BigDecimal newTotalWithdrawn = userBalance.getTotalWithdrawn().add(totalCost);

        userBalance.setAvailableBalance(newAvailableBalance);
        userBalance.setTotalWithdrawn(newTotalWithdrawn);
        userBalanceRepository.save(userBalance);

        // 7. Create electricity transaction
        ElectricityTransaction transaction = ElectricityTransaction.builder()
                .amount(amount)
                .units(units)
                .meterNumber(request.getMeterNumber())
                .municipality(request.getMunicipality() != null ? request.getMunicipality() : "Default Municipality")
                .token(generateElectricityToken())
                .status(ElectricityTransactionStatus.COMPLETED)
                .transactionReference(generateTransactionReference())
                .user(user)
                .ratePerUnit(RATE_PER_UNIT)
                .build();

        electricityRepository.save(transaction);

        // 8. Build response using your existing DTO
        return ElectricityPurchaseResponseDto.builder()
                .success(true)
                .message("Electricity purchased successfully")
                .electricityId(transaction.getTransactionId())
                .voucherCode(transaction.getToken())
                .amount(amount)
                .fee(ELECTRICITY_FEE)
                .totalCost(totalCost)
                .units(units)
                .meterNumber(request.getMeterNumber())
                .remainingBalance(newAvailableBalance)
                .transactionReference(transaction.getTransactionReference())
                .timestamp(LocalDateTime.now())
                .build();
    }

    private void validateAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }
        if (amount.compareTo(MIN_AMOUNT) < 0) {
            throw new IllegalArgumentException("Minimum electricity purchase is R20.00");
        }
        if (amount.compareTo(MAX_AMOUNT) > 0) {
            throw new IllegalArgumentException("Maximum electricity purchase is R5,000.00");
        }
    }

    private String generateElectricityToken() {
        // Generate 20-digit electricity token (format: XXXX-XXXX-XXXX-XXXX-XXXX)
        StringBuilder token = new StringBuilder();
        Random random = new Random();

        for (int i = 0; i < 5; i++) {
            if (i > 0) token.append("-");
            token.append(String.format("%04d", random.nextInt(10000)));
        }

        return token.toString();
    }

    private String generateTransactionReference() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String random = String.format("%06d", new Random().nextInt(1000000));
        return "ELEC-" + date + "-" + random;
    }

    public List<ElectricityPurchaseResponseDto> getElectricityHistory(Users user) {

        List<ElectricityTransaction> purchases = electricityRepository.findByUserUserIdOrderByCreatedAtDesc(user.getUserId());

        return purchases.stream()
                .map(purchase -> ElectricityPurchaseResponseDto.builder()
                        .success(true)
                        .message("Purchase completed")
                        .meterNumber(purchase.getMeterNumber())
                        .amount(purchase.getAmount())
                        .voucherCode(purchase.getToken())
                        .units(purchase.getUnits())
                        .transactionReference(purchase.getTransactionReference())
                        .timestamp(purchase.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}