package za.co.interfile.enums;

public enum TransactionStatus {
    /**
     * Transaction created but not yet processed
     */
    PENDING("Pending"),

    /**
     * Transaction successfully completed
     */
    COMPLETED("Completed"),

    /**
     * Transaction failed due to error
     */
    FAILED("Failed"),

    /**
     * Transaction was cancelled
     */
    CANCELLED("Cancelled"),

    /**
     * Transaction is currently being processed
     */
    PROCESSING("Processing");

    private final String displayName;

    TransactionStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public boolean isFinalized() {
        return this == COMPLETED || this == FAILED || this == CANCELLED;
    }

    public boolean isSuccessful() {
        return this == COMPLETED;
    }

    public String getCssClass() {
        return switch (this) {
            case COMPLETED -> "status-success";
            case FAILED -> "status-danger";
            case CANCELLED -> "status-secondary";
            case PROCESSING -> "status-info";
            case PENDING -> "status-warning";
        };
    }
}