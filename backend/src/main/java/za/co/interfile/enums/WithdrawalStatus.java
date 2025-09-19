package za.co.interfile.enums;

/**
 * Enum representing the status of withdrawal requests
 */
public enum WithdrawalStatus {
    /**
     * Withdrawal request submitted, awaiting processing
     */
    PENDING("Pending"),

    /**
     * Withdrawal request approved by admin
     */
    APPROVED("Approved"),

    /**
     * Withdrawal request successfully processed
     */
    PROCESSED("Processed"),

    /**
     * Withdrawal request rejected
     */
    REJECTED("Rejected"),

    /**
     * Withdrawal request cancelled by user or system
     */
    CANCELLED("Cancelled"),

    /**
     * Withdrawal request expired (not processed within time limit)
     */
    EXPIRED("Expired");

    private final String displayName;

    WithdrawalStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Check if status represents a finalized state
     */
    public boolean isFinalized() {
        return this == PROCESSED || this == REJECTED || this == CANCELLED || this == EXPIRED;
    }

    /**
     * Check if status represents a successful withdrawal
     */
    public boolean isSuccessful() {
        return this == PROCESSED;
    }

    /**
     * Check if withdrawal can still be processed
     */
    public boolean canBeProcessed() {
        return this == PENDING || this == APPROVED;
    }

    /**
     * Get CSS class for status styling
     */
    public String getCssClass() {
        return switch (this) {
            case PROCESSED -> "status-success";
            case REJECTED -> "status-danger";
            case CANCELLED -> "status-secondary";
            case EXPIRED -> "status-warning";
            case APPROVED -> "status-info";
            case PENDING -> "status-primary";
        };
    }

    /**
     * Get icon class for status display
     */
    public String getIconClass() {
        return switch (this) {
            case PROCESSED -> "icon-check-circle";
            case REJECTED -> "icon-x-circle";
            case CANCELLED -> "icon-slash-circle";
            case EXPIRED -> "icon-clock";
            case APPROVED -> "icon-thumb-up";
            case PENDING -> "icon-clock-pending";
        };
    }

    /**
     * Get priority for processing (1 = highest priority)
     */
    public int getProcessingPriority() {
        return switch (this) {
            case APPROVED -> 1;
            case PENDING -> 2;
            case REJECTED -> 3; // For retry processing
            default -> 4;
        };
    }
}

// ========================================
