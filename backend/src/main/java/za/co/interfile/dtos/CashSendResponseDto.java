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
public class CashSendResponseDto {
    private boolean success;
    private String message;
    private Long cashSendId;
    private String voucherCode;
    private String pin;
    private BigDecimal amount;
    private BigDecimal fee;
    private BigDecimal totalCost;
    private BigDecimal remainingBalance;
    private String recipientPhone;
    private String recipientName;
    private LocalDateTime expiryDate;
    private LocalDateTime timestamp;
}