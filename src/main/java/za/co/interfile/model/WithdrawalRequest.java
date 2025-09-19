package za.co.interfile.model;


import jakarta.validation.constraints.*;
import lombok.*;
import za.co.interfile.enums.WithdrawalMethod;
import za.co.interfile.enums.WithdrawalStatus;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

/**
 * WithdrawalRequest entity for managing user withdrawal requests in the demo system
 * Handles the complete withdrawal workflow from request to completion
 */
@Entity
@Table(name = "withdrawal_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user", "processedBy"})
@EqualsAndHashCode(exclude = {"user", "processedBy"})
public class WithdrawalRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "withdrawal_id")
    private Long withdrawalId;

    @NotNull(message = "Requested amount is required")
    @DecimalMin(value = "0.01", message = "Requested amount must be positive")
    @DecimalMax(value = "50000.00", message = "Requested amount too large")
    @Column(name = "requested_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal requestedAmount;

    @NotNull(message = "Calculated fees is required")
    @DecimalMin(value = "0.00", message = "Calculated fees cannot be negative")
    @Column(name = "calculated_fees", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal calculatedFees = BigDecimal.ZERO;

    @NotNull(message = "Net amount is required")
    @DecimalMin(value = "0.01", message = "Net amount must be positive")
    @Column(name = "net_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal netAmount;

    @NotNull(message = "Withdrawal method is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "withdrawal_method", nullable = false, length = 30)
    @Builder.Default
    private WithdrawalMethod withdrawalMethod = WithdrawalMethod.DEMO;

    @Column(name = "bank_details", columnDefinition = "JSON")
    private String bankDetails; // JSON string for bank account details

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private WithdrawalStatus status = WithdrawalStatus.PENDING;

    @Size(max = 50, message = "Reason code must not exceed 50 characters")
    @Column(name = "reason_code", length = 50)
    private String reasonCode;

    @Size(max = 1000, message = "Admin notes must not exceed 1000 characters")
    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "requested_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime requestedAt = LocalDateTime.now();

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    // Relationships
    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by")
    private AdminUsers processedBy;

    // Additional tracking fields
    @Column(name = "user_balance_before", precision = 10, scale = 2)
    private BigDecimal userBalanceBefore;

    @Column(name = "user_balance_after", precision = 10, scale = 2)
    private BigDecimal userBalanceAfter;

    @Column(name = "transaction_reference", length = 100)
    private String transactionReference;

    @Column(name = "external_reference", length = 100)
    private String externalReference;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    @Column(name = "approval_notes", columnDefinition = "TEXT")
    private String approvalNotes;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "retry_count")
    @Builder.Default
    private Integer retryCount = 0;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    // JPA Lifecycle callbacks
    @PrePersist
    private void onCreate() {
        this.requestedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = WithdrawalStatus.PENDING;
        }
        if (this.withdrawalMethod == null) {
            this.withdrawalMethod = WithdrawalMethod.DEMO;
        }
        if (this.calculatedFees == null) {
            this.calculatedFees = BigDecimal.ZERO;
        }
        if (this.retryCount == null) {
            this.retryCount = 0;
        }

        // Set expiration time (24 hours for demo)
        if (this.expiresAt == null) {
            this.expiresAt = this.requestedAt.plusHours(24);
        }

        // Calculate net amount if not provided
        if (this.netAmount == null && this.requestedAmount != null && this.calculatedFees != null) {
            this.netAmount = this.requestedAmount.subtract(this.calculatedFees);
        }
    }

    @PreUpdate
    private void onUpdate() {
        // Set processed timestamp when status changes to final state
        if (isFinalized() && this.processedAt == null) {
            this.processedAt = LocalDateTime.now();
        }
    }

    // Status Management Methods

    /**
     * Approve the withdrawal request
     * @param approvedBy Admin who approved the request
     * @param notes Approval notes
     */
    public void approve(AdminUsers approvedBy, String notes) {
        this.status = WithdrawalStatus.APPROVED;
        this.processedBy = approvedBy;
        this.approvalNotes = notes;
        this.processedAt = LocalDateTime.now();
    }

    /**
     * Process the withdrawal request (mark as processed)
     */
    public void process() {
        this.status = WithdrawalStatus.PROCESSED;
        this.processedAt = LocalDateTime.now();
    }

    /**
     * Reject the withdrawal request
     * @param rejectedBy Admin who rejected the request
     * @param reason Rejection reason
     * @param reasonCode Reason code for categorization
     */
    public void reject(AdminUsers rejectedBy, String reason, String reasonCode) {
        this.status = WithdrawalStatus.REJECTED;
        this.processedBy = rejectedBy;
        this.rejectionReason = reason;
        this.reasonCode = reasonCode;
        this.processedAt = LocalDateTime.now();
    }

    /**
     * Cancel the withdrawal request
     */
    public void cancel() {
        this.status = WithdrawalStatus.CANCELLED;
        this.processedAt = LocalDateTime.now();
    }

    /**
     * Mark as expired
     */
    public void expire() {
        this.status = WithdrawalStatus.EXPIRED;
        this.processedAt = LocalDateTime.now();
        this.reasonCode = "EXPIRED";
    }

    /**
     * Increment retry count
     */
    public void incrementRetry() {
        this.retryCount++;
    }

    // Status Checking Methods

    public boolean isPending() {
        return this.status == WithdrawalStatus.PENDING;
    }

    public boolean isApproved() {
        return this.status == WithdrawalStatus.APPROVED;
    }

    public boolean isProcessed() {
        return this.status == WithdrawalStatus.PROCESSED;
    }

    public boolean isRejected() {
        return this.status == WithdrawalStatus.REJECTED;
    }

    public boolean isCancelled() {
        return this.status == WithdrawalStatus.CANCELLED;
    }

    public boolean isExpired() {
        return this.status == WithdrawalStatus.EXPIRED;
    }

    public boolean isFinalized() {
        return this.status == WithdrawalStatus.PROCESSED ||
                this.status == WithdrawalStatus.REJECTED ||
                this.status == WithdrawalStatus.CANCELLED ||
                this.status == WithdrawalStatus.EXPIRED;
    }

    public boolean isSuccessful() {
        return this.status == WithdrawalStatus.PROCESSED;
    }

    public boolean canBeProcessed() {
        return this.status == WithdrawalStatus.PENDING ||
                this.status == WithdrawalStatus.APPROVED;
    }

    public boolean canBeCancelled() {
        return this.status == WithdrawalStatus.PENDING;
    }

    public boolean canRetry() {
        return this.status == WithdrawalStatus.REJECTED && this.retryCount < 3;
    }

    // Validation Methods

    /**
     * Check if the withdrawal request has expired
     * @return true if expired
     */
    public boolean hasExpired() {
        return this.expiresAt != null && LocalDateTime.now().isAfter(this.expiresAt);
    }

    /**
     * Validate withdrawal amount against user's balance
     * @param userBalance Current user balance
     * @return validation result
     */
    public boolean isAmountValid(BigDecimal userBalance) {
        return userBalance.compareTo(this.requestedAmount) >= 0;
    }

    /**
     * Check if fees calculation is correct
     * @param feePercentage Fee percentage to validate against
     * @return true if fees are correctly calculated
     */
    public boolean areFeesCorrect(BigDecimal feePercentage) {
        BigDecimal expectedFees = this.requestedAmount.multiply(feePercentage).divide(new BigDecimal("100"), 2, java.math.RoundingMode.HALF_UP);
        return this.calculatedFees.compareTo(expectedFees) == 0;
    }

    // Display/Formatting Methods

    /**
     * Get formatted requested amount
     * @return Formatted string like "R 1,250.00"
     */
    public String getFormattedRequestedAmount() {
        return String.format("R %,.2f", this.requestedAmount);
    }

    /**
     * Get formatted calculated fees
     * @return Formatted string like "R 25.00"
     */
    public String getFormattedCalculatedFees() {
        return String.format("R %,.2f", this.calculatedFees);
    }

    /**
     * Get formatted net amount
     * @return Formatted string like "R 1,225.00"
     */
    public String getFormattedNetAmount() {
        return String.format("R %,.2f", this.netAmount);
    }

    /**
     * Get formatted request date
     * @return Formatted date string
     */
    public String getFormattedRequestedAt() {
        return this.requestedAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    /**
     * Get formatted processed date
     * @return Formatted date string or "Not processed"
     */
    public String getFormattedProcessedAt() {
        return this.processedAt != null
                ? this.processedAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                : "Not processed";
    }

    /**
     * Get status display name
     * @return Human-readable status
     */
    public String getStatusDisplay() {
        return this.status.getDisplayName();
    }

    /**
     * Get CSS class for status styling
     * @return CSS class name
     */
    public String getStatusCssClass() {
        return this.status.getCssClass();
    }

    /**
     * Get withdrawal method display name
     * @return Human-readable withdrawal method
     */
    public String getWithdrawalMethodDisplay() {
        return this.withdrawalMethod.getDisplayName();
    }

    /**
     * Get processing time in minutes
     * @return Processing time or -1 if not processed
     */
    public long getProcessingTimeMinutes() {
        if (this.processedAt == null) {
            return -1;
        }
        return java.time.Duration.between(this.requestedAt, this.processedAt).toMinutes();
    }

    /**
     * Get age of request in hours
     * @return Hours since request creation
     */
    public long getAgeHours() {
        return java.time.Duration.between(this.requestedAt, LocalDateTime.now()).toHours();
    }

    /**
     * Get time until expiration in hours
     * @return Hours until expiration or -1 if no expiration
     */
    public long getHoursUntilExpiration() {
        if (this.expiresAt == null) {
            return -1;
        }
        long hours = java.time.Duration.between(LocalDateTime.now(), this.expiresAt).toHours();
        return Math.max(0, hours);
    }

    /**
     * Get withdrawal summary for display
     * @return Summary string
     */
    public String getWithdrawalSummary() {
        return String.format("Withdrawal Request: %s (Net: %s) - %s",
                getFormattedRequestedAmount(),
                getFormattedNetAmount(),
                getStatusDisplay());
    }

    /**
     * Get short withdrawal ID for display
     * @return Short ID like "WD001234"
     */
    public String getShortWithdrawalId() {
        return String.format("WD%06d", this.withdrawalId);
    }

    // Business Logic Methods

    /**
     * Calculate fee percentage
     * @return Fee percentage
     */
    public BigDecimal getFeePercentage() {
        if (this.requestedAmount.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return this.calculatedFees.multiply(new BigDecimal("100"))
                .divide(this.requestedAmount, 2, java.math.RoundingMode.HALF_UP);
    }

    /**
     * Check if request needs immediate attention
     * @return true if needs attention
     */
    public boolean needsAttention() {
        return isPending() && (getAgeHours() > 2 || hasExpired()) ||
                (isRejected() && canRetry());
    }

    /**
     * Get priority level for processing
     * @return Priority level (1=highest, 5=lowest)
     */
    public int getPriorityLevel() {
        if (hasExpired()) return 1;
        if (getAgeHours() > 12) return 2;
        if (getAgeHours() > 4) return 3;
        if (this.requestedAmount.compareTo(new BigDecimal("1000")) > 0) return 2;
        return 4;
    }

    /**
     * Generate unique transaction reference
     * @return Transaction reference
     */
    public String generateTransactionReference() {
        if (this.transactionReference == null) {
            this.transactionReference = String.format("WTX%d%d",
                    this.withdrawalId,
                    System.currentTimeMillis() % 10000);
        }
        return this.transactionReference;
    }

    // Bank Details Helper Methods (for future use)

    /**
     * Set bank details from parameters
     * @param accountNumber Bank account number
     * @param bankName Bank name
     * @param accountHolder Account holder name
     */
    public void setBankDetails(String accountNumber, String bankName, String accountHolder) {
        Map<String, String> details = Map.of(
                "accountNumber", accountNumber != null ? accountNumber : "",
                "bankName", bankName != null ? bankName : "",
                "accountHolder", accountHolder != null ? accountHolder : ""
        );
        // Convert to JSON string (you'd use Jackson ObjectMapper in real implementation)
        this.bankDetails = details.toString(); // Simplified for demo
    }

    /**
     * Check if bank details are provided
     * @return true if bank details exist
     */
    public boolean hasBankDetails() {
        return this.bankDetails != null && !this.bankDetails.trim().isEmpty();
    }
}