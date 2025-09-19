package za.co.interfile.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WithdrawalResponseDTO {
    private boolean success;
    private String message;
    private BigDecimal withdrawnAmount;
    private BigDecimal previousBalance;
    private BigDecimal newBalance;
    private String referenceNumber;
    private String transactionId;

}

