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
public class WithdrawalHistoryDto {
    private Long id;
    private BigDecimal amount;
    private BigDecimal fees;
    private String bankName;
    private String accountHolderName;
    private String accountNumber;
    private String accountType;
    private String status;
    private String transactionReference;
    private LocalDateTime createdAt;
}