package za.co.interfile.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import za.co.interfile.enums.PaymentMethod;
import za.co.interfile.enums.TransactionStatus;
import za.co.interfile.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Transaction entity representing all financial transactions in the Social Relief Payment System
 * Tracks deposits, withdrawals, payments, refunds, and adjustments
 */
@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user", "sassaAccount"})
@EqualsAndHashCode(exclude = {"user", "sassaAccount"})
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    @NotNull(message = "Transaction type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 20)
    private TransactionType transactionType;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be positive")
    @DecimalMax(value = "999999.99", message = "Amount too large")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @NotNull(message = "Balance before is required")
    @DecimalMin(value = "0.00", message = "Balance before cannot be negative")
    @Column(name = "balance_before", nullable = false, precision = 10, scale = 2)
    private BigDecimal balanceBefore;

    @NotNull(message = "Balance after is required")
    @DecimalMin(value = "0.00", message = "Balance after cannot be negative")
    @Column(name = "balance_after", nullable = false, precision = 10, scale = 2)
    private BigDecimal balanceAfter;

    @NotBlank(message = "Reference number is required")
    @Size(max = 100, message = "Reference number must not exceed 100 characters")
    @Column(name = "reference_number", unique = true, nullable = false, length = 100)
    private String referenceNumber;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private TransactionStatus status = TransactionStatus.PENDING;

    @NotNull(message = "Payment method is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 30)
    @Builder.Default
    private PaymentMethod paymentMethod = PaymentMethod.DEMO_WITHDRAWAL;

    @Size(max = 100, message = "External reference must not exceed 100 characters")
    @Column(name = "external_reference", length = 100)
    private String externalReference;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sassa_account_id")
    private SassaAccounts sassaAccount;


    @Column(name = "processing_fee", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal processingFee = BigDecimal.ZERO;

    @Column(name = "net_amount", precision = 10, scale = 2)
    private BigDecimal netAmount;

    @Column(name = "failure_reason")
    private String failureReason;

    @Column(name = "retry_count")
    @Builder.Default
    private Integer retryCount = 0;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;


    @PrePersist
    private void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = TransactionStatus.PENDING;
        }
        if (this.paymentMethod == null) {
            this.paymentMethod = PaymentMethod.DEMO_WITHDRAWAL;
        }
        if (this.processingFee == null) {
            this.processingFee = BigDecimal.ZERO;
        }
        if (this.retryCount == null) {
            this.retryCount = 0;
        }


        if (this.netAmount == null) {
            this.netAmount = this.amount.subtract(this.processingFee);
        }
    }

    @PreUpdate
    private void onUpdate() {
        // Update completion timestamp when status changes to completed
        if (this.status == TransactionStatus.COMPLETED && this.completedAt == null) {
            this.completedAt = LocalDateTime.now();
        }
    }

    // Business Logic Methods

    /**
     * Complete the transaction
     */
    public void complete() {
        this.status = TransactionStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
    }

    /**
     * Fail the transaction with reason
     * @param reason Failure reason
     */
    public void fail(String reason) {
        this.status = TransactionStatus.FAILED;
        this.failureReason = reason;
        this.completedAt = LocalDateTime.now();
    }

    /**
     * Cancel the transaction
     */
    public void cancel() {
        this.status = TransactionStatus.CANCELLED;
        this.completedAt = LocalDateTime.now();
    }

    /**
     * Mark transaction as processing
     */
    public void startProcessing() {
        this.status = TransactionStatus.PROCESSING;
    }

    /**
     * Increment retry count
     */
    public void incrementRetry() {
        this.retryCount++;
    }

    /**
     * Check if transaction can be retried
     * @param maxRetries Maximum number of retries allowed
     * @return true if can retry
     */
    public boolean canRetry(int maxRetries) {
        return this.status == TransactionStatus.FAILED && this.retryCount < maxRetries;
    }

    // Status Checking Methods

    public boolean isPending() {
        return this.status == TransactionStatus.PENDING;
    }

    public boolean isCompleted() {
        return this.status == TransactionStatus.COMPLETED;
    }

    public boolean isFailed() {
        return this.status == TransactionStatus.FAILED;
    }

    public boolean isCancelled() {
        return this.status == TransactionStatus.CANCELLED;
    }

    public boolean isProcessing() {
        return this.status == TransactionStatus.PROCESSING;
    }

    public boolean isSuccessful() {
        return this.status == TransactionStatus.COMPLETED;
    }

    public boolean isFinalized() {
        return this.status == TransactionStatus.COMPLETED ||
                this.status == TransactionStatus.FAILED ||
                this.status == TransactionStatus.CANCELLED;
    }

    // Transaction Type Checking Methods

    public boolean isDeposit() {
        return this.transactionType == TransactionType.DEPOSIT;
    }

    public boolean isWithdrawal() {
        return this.transactionType == TransactionType.WITHDRAWAL;
    }

    public boolean isPayment() {
        return this.transactionType == TransactionType.PAYMENT;
    }

    public boolean isRefund() {
        return this.transactionType == TransactionType.REFUND;
    }

    public boolean isAdjustment() {
        return this.transactionType == TransactionType.ADJUSTMENT;
    }

    // Display/Formatting Methods

    /**
     * Get formatted amount for display
     * @return Formatted string like "R 1,250.00"
     */
    public String getFormattedAmount() {
        String sign = isCredit() ? "+" : "-";
        return String.format("%sR %,.2f", sign, this.amount);
    }

    /**
     * Get formatted net amount for display
     * @return Formatted string like "R 1,225.00"
     */
    public String getFormattedNetAmount() {
        if (this.netAmount == null) {
            return getFormattedAmount();
        }
        String sign = isCredit() ? "+" : "-";
        return String.format("%sR %,.2f", sign, this.netAmount);
    }

    /**
     * Get formatted processing fee
     * @return Formatted string like "R 25.00"
     */
    public String getFormattedProcessingFee() {
        return String.format("R %,.2f", this.processingFee != null ? this.processingFee : BigDecimal.ZERO);
    }

    /**
     * Get formatted transaction date
     * @return Formatted date string
     */
    public String getFormattedCreatedAt() {
        return this.createdAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    /**
     * Get formatted completion date
     * @return Formatted date string or "Not completed"
     */
    public String getFormattedCompletedAt() {
        return this.completedAt != null
                ? this.completedAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                : "Not completed";
    }

    /**
     * Get display name for transaction type
     * @return Human-readable transaction type
     */
    public String getTransactionTypeDisplay() {
        return switch (this.transactionType) {
            case DEPOSIT -> "Deposit";
            case WITHDRAWAL -> "Withdrawal";
            case PAYMENT -> "Payment";
            case REFUND -> "Refund";
            case TRANSFER -> "Transfer";
            case ADJUSTMENT -> "Adjustment";
        };
    }

    /**
     * Get display name for status
     * @return Human-readable status
     */
    public String getStatusDisplay() {
        return switch (this.status) {
            case PENDING -> "Pending";
            case COMPLETED -> "Completed";
            case FAILED -> "Failed";
            case CANCELLED -> "Cancelled";
            case PROCESSING -> "Processing";
        };
    }

    /**
     * Get CSS class for status styling
     * @return CSS class name
     */
    public String getStatusCssClass() {
        return switch (this.status) {
            case COMPLETED -> "status-success";
            case FAILED -> "status-danger";
            case CANCELLED -> "status-secondary";
            case PROCESSING -> "status-info";
            case PENDING -> "status-warning";
        };
    }

    /**
     * Get CSS class for transaction type styling
     * @return CSS class name
     */
//    public String getTransactionTypeCssClass() {
//        return switch (this.transactionType) {
//            case DEPOSIT, PAYMENT -> "transaction-credit";
//            case WITHDRAWAL -> "transaction-debit";
//            case REFUND -> "transaction-credit";
//            case ADJUSTMENT -> "transaction-neutral";
//        };
//    }

    /**
     * Check if transaction is a credit (increases balance)
     * @return true if credit transaction
     */
    public boolean isCredit() {
        return this.transactionType == TransactionType.DEPOSIT ||
                this.transactionType == TransactionType.PAYMENT ||
                this.transactionType == TransactionType.REFUND ||
                (this.transactionType == TransactionType.ADJUSTMENT &&
                        this.balanceAfter.compareTo(this.balanceBefore) > 0);
    }

    /**
     * Check if transaction is a debit (decreases balance)
     * @return true if debit transaction
     */
    public boolean isDebit() {
        return !isCredit();
    }

    /**
     * Get transaction summary for display
     * @return Summary string
     */
    public String getTransactionSummary() {
        return String.format("%s - %s (%s) - %s",
                getFormattedCreatedAt(),
                getTransactionTypeDisplay(),
                getFormattedAmount(),
                getStatusDisplay());
    }

    /**
     * Get short reference for display (last 8 characters)
     * @return Short reference
     */
    public String getShortReference() {
        if (this.referenceNumber == null || this.referenceNumber.length() <= 8) {
            return this.referenceNumber;
        }
        return "..." + this.referenceNumber.substring(this.referenceNumber.length() - 8);
    }

    // Utility Methods

    /**
     * Calculate processing time in minutes
     * @return Processing time or -1 if not completed
     */
    public long getProcessingTimeMinutes() {
        if (this.completedAt == null) {
            return -1;
        }
        return java.time.Duration.between(this.createdAt, this.completedAt).toMinutes();
    }

    /**
     * Get age of transaction in hours
     * @return Hours since creation
     */
    public long getAgeHours() {
        return java.time.Duration.between(this.createdAt, LocalDateTime.now()).toHours();
    }

    /**
     * Check if transaction is recent (within last hour)
     * @return true if recent
     */
    public boolean isRecent() {
        return getAgeHours() <= 1;
    }

    /**
     * Check if transaction is stale (pending for more than 24 hours)
     * @return true if stale
     */
    public boolean isStale() {
        return isPending() && getAgeHours() > 24;
    }

    /**
     * Validate balance calculation
     * @return true if balance calculation is correct
     */
    public boolean isBalanceValid() {
        if (isCredit()) {
            return this.balanceBefore.add(this.amount).equals(this.balanceAfter);
        } else {
            return this.balanceBefore.subtract(this.amount).equals(this.balanceAfter);
        }
    }
}