package za.co.interfile.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ElectricityPurchaseResponseDto {
    private boolean success;
    private String message;
    private Long transactionId;
    private String token; // 20-digit electricity token
    private BigDecimal amount;
    private BigDecimal units; // kWh purchased
    private BigDecimal remainingBalance;
    private String meterNumber;
    private String municipality;
    private String transactionReference;
    private LocalDateTime timestamp;
    private LocalDateTime tokenExpiryDate;
}