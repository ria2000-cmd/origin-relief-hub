package za.co.interfile.dtos;

import lombok.Data;
import za.co.interfile.enums.TransactionStatus;
import za.co.interfile.enums.TransactionType;

import java.time.LocalDateTime;

@Data
public class PaymentHistoryFilterDTO {
    private String idNumber;
    private TransactionType transactionType;
    private TransactionStatus status;
    private LocalDateTime fromDate;
    private LocalDateTime toDate;
    private int page = 0;
    private int size = 20;
    private String sortBy = "createdAt";
    private String sortDirection = "DESC";
}