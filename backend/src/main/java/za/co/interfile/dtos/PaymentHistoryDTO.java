package za.co.interfile.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import za.co.interfile.enums.TransactionStatus;
import za.co.interfile.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentHistoryDTO {
    private Long transactionId;
    private TransactionType transactionType;
    private BigDecimal amount;
    private TransactionStatus status;
    private String referenceNumber;
    private String description;
    private LocalDateTime createdAt;
    private String formattedAmount;
    private String formattedDate;
    private String statusDisplayName;
    private String typeDisplayName;
    private String statusCssClass;
    private String typeCssClass;
}