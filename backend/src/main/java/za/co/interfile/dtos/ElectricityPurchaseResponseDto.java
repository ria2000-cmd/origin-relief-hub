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
    private Long electricityId;
    private String voucherCode;
    private BigDecimal amount;
    private BigDecimal fee;
    private BigDecimal totalCost;
    private BigDecimal units;
    private String meterNumber;
    private BigDecimal remainingBalance;
    private String transactionReference;
    private LocalDateTime timestamp;
}