package za.co.interfile.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.co.interfile.dtos.ElectricityPurchaseRequestDto;
import za.co.interfile.dtos.ElectricityPurchaseResponseDto;
import za.co.interfile.enums.ElectricityTransactionStatus;
import za.co.interfile.exception.ElectricityPurchaseException;
import za.co.interfile.exception.InsufficientBalanceException;
import za.co.interfile.model.ElectricityTransaction;
import za.co.interfile.model.UserBalance;
import za.co.interfile.model.Users;
import za.co.interfile.repository.ElectricityTransactionRepository;
import za.co.interfile.repository.UserBalanceRepository;
import za.co.interfile.repository.UsersRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ElectricityService {

    private final UsersRepository usersRepository;
    private final UserBalanceRepository userBalanceRepository;
    private final ElectricityTransactionRepository electricityTransactionRepository;

    // Current electricity rate - R2.50 per kWh (this would typically come from a config or API)
    private static final BigDecimal RATE_PER_KWH = new BigDecimal("2.50");
    private static final BigDecimal MIN_PURCHASE = new BigDecimal("5.00");
    private static final BigDecimal MAX_PURCHASE = new BigDecimal("5000.00");

    @Transactional
    public ElectricityPurchaseResponseDto purchaseElectricity(Long userId, ElectricityPurchaseRequestDto request) {
        log.info("Processing electricity purchase for user ID: {}, Amount: R{}, Meter: {}",
                userId, request.getAmount(), request.getMeterNumber());

        // 1. Get user
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ElectricityPurchaseException("User not found"));

        // 2. Check if user is active
        if (!user.isActive()) {
            throw new ElectricityPurchaseException("Your account must be active to purchase electricity");
        }

        // 3. Get user balance
        UserBalance userBalance = user.getUserBalance();
        if (userBalance == null) {
            throw new ElectricityPurchaseException("No balance information found");
        }

        BigDecimal availableBalance = userBalance.getAvailableBalance();
        BigDecimal purchaseAmount = request.getAmount();

        // 4. Validate purchase amount
        if (purchaseAmount.compareTo(MIN_PURCHASE) < 0) {
            throw new ElectricityPurchaseException("Minimum electricity purchase is R5.00");
        }

        if (purchaseAmount.compareTo(MAX_PURCHASE) > 0) {
            throw new ElectricityPurchaseException("Maximum electricity purchase is R5,000.00");
        }

        // 5. Check sufficient balance
        if (availableBalance.compareTo(purchaseAmount) < 0) {
            log.warn("Insufficient balance. Available: R{}, Required: R{}",
                    availableBalance, purchaseAmount);
            throw new InsufficientBalanceException(
                    String.format("Insufficient balance. Available: R%.2f, Required: R%.2f",
                            availableBalance, purchaseAmount)
            );
        }

        // 6. Calculate units (kWh)
        BigDecimal units = purchaseAmount.divide(RATE_PER_KWH, 2, RoundingMode.HALF_UP);

        // 7. Generate electricity token (20-digit token)
        String token = generateElectricityToken();
        String transactionRef = "ELEC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // 8. Create electricity transaction
        ElectricityTransaction transaction = ElectricityTransaction.builder()
                .user(user)
                .amount(purchaseAmount)
                .units(units)
                .meterNumber(request.getMeterNumber())
                .municipality(request.getMunicipality())
                .token(token)
                .status(ElectricityTransactionStatus.COMPLETED)
                .transactionReference(transactionRef)
                .ratePerUnit(RATE_PER_KWH)
                .createdAt(LocalDateTime.now())
                .tokenExpiryDate(LocalDateTime.now().plusDays(7))
                .build();

        ElectricityTransaction savedTransaction = electricityTransactionRepository.save(transaction);

        // 9. Deduct amount from balance
        BigDecimal newBalance = availableBalance.subtract(purchaseAmount);
        userBalance.setAvailableBalance(newBalance);
        userBalance.setLastUpdated(LocalDateTime.now());
        userBalanceRepository.save(userBalance);

        log.info("Electricity purchase successful. Token: {}, Ref: {}, Units: {} kWh",
                token, transactionRef, units);

        // 10. Return response
        return ElectricityPurchaseResponseDto.builder()
                .success(true)
                .message("Electricity purchased successfully")
                .transactionId(savedTransaction.getTransactionId())
                .token(formatToken(token))
                .amount(purchaseAmount)
                .units(units)
                .remainingBalance(newBalance)
                .meterNumber(request.getMeterNumber())
                .municipality(request.getMunicipality())
                .transactionReference(transactionRef)
                .timestamp(LocalDateTime.now())
                .tokenExpiryDate(savedTransaction.getTokenExpiryDate())
                .build();
    }

    @Transactional(readOnly = true)
    public List<ElectricityTransaction> getUserElectricityHistory(Long userId, int limit) {
        return electricityTransactionRepository
                .findByUserUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .limit(limit)
                .toList();
    }

    @Transactional(readOnly = true)
    public BigDecimal calculateUnits(BigDecimal amount) {
        return amount.divide(RATE_PER_KWH, 2, RoundingMode.HALF_UP);
    }

    private String generateElectricityToken() {
        SecureRandom random = new SecureRandom();
        StringBuilder token = new StringBuilder();

        // Generate 20-digit token
        for (int i = 0; i < 20; i++) {
            token.append(random.nextInt(10));
        }

        return token.toString();
    }

    private String formatToken(String token) {
        // Format as: XXXX-XXXX-XXXX-XXXX-XXXX
        StringBuilder formatted = new StringBuilder();
        for (int i = 0; i < token.length(); i++) {
            if (i > 0 && i % 4 == 0) {
                formatted.append("-");
            }
            formatted.append(token.charAt(i));
        }
        return formatted.toString();
    }
}