package za.co.interfile.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentHistoryResponseDTO {
    private boolean success;
    private String message;
    private List<PaymentHistoryDTO> transactions;
    private int totalTransactions;
    private int totalPages;
    private int currentPage;
    private BigDecimal totalWithdrawn;
    private BigDecimal totalReceived;
    private LocalDateTime fromDate;
    private LocalDateTime toDate;
}