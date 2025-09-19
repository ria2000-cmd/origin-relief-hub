package za.co.interfile.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserBalanceDetailsDTO {
    private BigDecimal availableBalance = BigDecimal.ZERO;
    private BigDecimal pendingBalance = BigDecimal.ZERO;
    private BigDecimal totalBalance = BigDecimal.ZERO;
    private BigDecimal totalReceived = BigDecimal.ZERO;
    private BigDecimal totalWithdrawn = BigDecimal.ZERO;
    private BigDecimal netBalance = BigDecimal.ZERO;
    private String formattedAvailableBalance;
    private String formattedTotalBalance;
    private String balanceStatus;
    private String balanceStatusCssClass;
    private boolean canWithdraw;
    private BigDecimal minWithdrawal;
    private BigDecimal maxWithdrawal;
    private LocalDateTime lastUpdated;
}