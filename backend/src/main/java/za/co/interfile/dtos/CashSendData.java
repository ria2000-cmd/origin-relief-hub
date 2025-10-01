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
public class CashSendData {
    private BigDecimal amount;
    private BigDecimal fee;
    private String recipientPhone;
    private String recipientName;
    private String voucherCode;
    private String pin;
    private LocalDateTime expiryDate;
    private BigDecimal remainingBalance;
    private String transactionReference;
}