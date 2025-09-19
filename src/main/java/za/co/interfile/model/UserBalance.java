package za.co.interfile.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * UserBalance entity representing user's financial balance for demo withdrawal functionality
 */
@Entity
@Table(name = "user_balances")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user"})
@EqualsAndHashCode(exclude = {"user"})
public class UserBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "balance_id")
    private Long balanceId;

    @NotNull(message = "Available balance is required")
    @DecimalMin(value = "0.00", message = "Available balance cannot be negative")
    @Column(name = "available_balance", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal availableBalance = BigDecimal.ZERO;

    @NotNull(message = "Pending balance is required")
    @DecimalMin(value = "0.00", message = "Pending balance cannot be negative")
    @Column(name = "pending_balance", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal pendingBalance = BigDecimal.ZERO;

    @NotNull(message = "Total received is required")
    @DecimalMin(value = "0.00", message = "Total received cannot be negative")
    @Column(name = "total_received", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalReceived = BigDecimal.ZERO;

    @NotNull(message = "Total withdrawn is required")
    @DecimalMin(value = "0.00", message = "Total withdrawn cannot be negative")
    @Column(name = "total_withdrawn", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalWithdrawn = BigDecimal.ZERO;

    @Column(name = "last_updated")
    @Builder.Default
    private LocalDateTime lastUpdated = LocalDateTime.now();

    // Relationship
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private Users user;

    // JPA Lifecycle callbacks
    @PrePersist
    private void onCreate() {
        this.lastUpdated = LocalDateTime.now();
        if (this.availableBalance == null) {
            this.availableBalance = BigDecimal.ZERO;
        }
        if (this.pendingBalance == null) {
            this.pendingBalance = BigDecimal.ZERO;
        }
        if (this.totalReceived == null) {
            this.totalReceived = BigDecimal.ZERO;
        }
        if (this.totalWithdrawn == null) {
            this.totalWithdrawn = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    private void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }

    // Business Logic Methods

    /**
     * Add funds to available balance
     * @param amount Amount to add
     * @param description Description for tracking
     */
    public void addFunds(BigDecimal amount, String description) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        this.availableBalance = this.availableBalance.add(amount);
        this.totalReceived = this.totalReceived.add(amount);
        this.lastUpdated = LocalDateTime.now();
    }

    /**
     * Withdraw funds from available balance
     * @param amount Amount to withdraw
     * @return true if withdrawal successful, false if insufficient funds
     */
    public boolean withdrawFunds(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        if (this.availableBalance.compareTo(amount) >= 0) {
            this.availableBalance = this.availableBalance.subtract(amount);
            this.totalWithdrawn = this.totalWithdrawn.add(amount);
            this.lastUpdated = LocalDateTime.now();
            return true;
        }
        return false;
    }

    /**
     * Move funds from pending to available balance
     * @param amount Amount to process
     */
    public void processPendingFunds(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        if (this.pendingBalance.compareTo(amount) >= 0) {
            this.pendingBalance = this.pendingBalance.subtract(amount);
            this.availableBalance = this.availableBalance.add(amount);
            this.lastUpdated = LocalDateTime.now();
        } else {
            throw new IllegalArgumentException("Insufficient pending balance");
        }
    }

    /**
     * Add funds to pending balance (for processing later)
     * @param amount Amount to add to pending
     */
    public void addPendingFunds(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        this.pendingBalance = this.pendingBalance.add(amount);
        this.lastUpdated = LocalDateTime.now();
    }

    /**
     * Check if user has sufficient balance for withdrawal
     * @param amount Amount to check
     * @return true if sufficient funds available
     */
    public boolean hasSufficientBalance(BigDecimal amount) {
        return this.availableBalance.compareTo(amount) >= 0;
    }

    /**
     * Get total balance (available + pending)
     * @return Total balance
     */
    public BigDecimal getTotalBalance() {
        return this.availableBalance.add(this.pendingBalance);
    }

    /**
     * Get net balance (total received - total withdrawn)
     * @return Net balance
     */
    public BigDecimal getNetBalance() {
        return this.totalReceived.subtract(this.totalWithdrawn);
    }

    /**
     * Check if balance has any funds
     * @return true if any balance > 0
     */
    public boolean hasAnyBalance() {
        return getTotalBalance().compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Check if balance is empty
     * @return true if no available or pending balance
     */
    public boolean isEmpty() {
        return getTotalBalance().compareTo(BigDecimal.ZERO) == 0;
    }

    // Display/Formatting Methods

    /**
     * Get formatted available balance for display
     * @return Formatted string like "R 1,250.00"
     */
    public String getFormattedAvailableBalance() {
        return String.format("R %,.2f", this.availableBalance);
    }

    /**
     * Get formatted total balance for display
     * @return Formatted string like "R 1,250.00"
     */
    public String getFormattedTotalBalance() {
        return String.format("R %,.2f", getTotalBalance());
    }

    /**
     * Get formatted pending balance for display
     * @return Formatted string like "R 250.00"
     */
    public String getFormattedPendingBalance() {
        return String.format("R %,.2f", this.pendingBalance);
    }

    /**
     * Get balance status for UI
     * @return Status string
     */
    public String getBalanceStatus() {
        if (isEmpty()) {
            return "No Balance";
        } else if (this.availableBalance.compareTo(BigDecimal.ZERO) == 0) {
            return "Pending Funds Only";
        } else if (this.pendingBalance.compareTo(BigDecimal.ZERO) > 0) {
            return "Funds Available + Pending";
        } else {
            return "Funds Available";
        }
    }

    /**
     * Get CSS class for balance status styling
     * @return CSS class name
     */
    public String getBalanceStatusCssClass() {
        if (isEmpty()) {
            return "balance-empty";
        } else if (this.availableBalance.compareTo(BigDecimal.ZERO) == 0) {
            return "balance-pending-only";
        } else if (this.availableBalance.compareTo(new BigDecimal("100")) < 0) {
            return "balance-low";
        } else {
            return "balance-healthy";
        }
    }

    // Validation Methods

    /**
     * Validate withdrawal amount against available balance and limits
     * @param amount Amount to validate
     * @param minAmount Minimum withdrawal amount
     * @param maxAmount Maximum withdrawal amount
     * @return Validation result
     */
    public WithdrawalValidationResult validateWithdrawal(BigDecimal amount, BigDecimal minAmount, BigDecimal maxAmount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return new WithdrawalValidationResult(false, "Amount must be greater than zero");
        }

        if (amount.compareTo(minAmount) < 0) {
            return new WithdrawalValidationResult(false,
                    String.format("Minimum withdrawal amount is %s", String.format("R %,.2f", minAmount)));
        }

        if (amount.compareTo(maxAmount) > 0) {
            return new WithdrawalValidationResult(false,
                    String.format("Maximum withdrawal amount is %s", String.format("R %,.2f", maxAmount)));
        }

        if (!hasSufficientBalance(amount)) {
            return new WithdrawalValidationResult(false,
                    String.format("Insufficient funds. Available: %s", getFormattedAvailableBalance()));
        }

        return new WithdrawalValidationResult(true, "Withdrawal amount is valid");
    }

    /**
     * Inner class for withdrawal validation results
     */
    @Data
    @AllArgsConstructor
    public static class WithdrawalValidationResult {
        private boolean valid;
        private String message;
    }

    // Utility Methods

    /**
     * Reset balance to zero (for testing/admin purposes)
     */
    public void resetBalance() {
        this.availableBalance = BigDecimal.ZERO;
        this.pendingBalance = BigDecimal.ZERO;
        this.lastUpdated = LocalDateTime.now();
    }

    /**
     * Get balance summary for logging/debugging
     * @return Summary string
     */
    public String getBalanceSummary() {
        return String.format("UserBalance[available=%s, pending=%s, total=%s, userId=%d]",
                getFormattedAvailableBalance(),
                getFormattedPendingBalance(),
                getFormattedTotalBalance(),
                this.user != null ? this.user.getUserId() : null);
    }
}