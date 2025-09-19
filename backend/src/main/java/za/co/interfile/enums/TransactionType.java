package za.co.interfile.enums;

public enum TransactionType {
    /**
     * Money coming into user's account (SASSA payments, refunds)
     */
    DEPOSIT("Deposit"),

    /**
     * Money going out of user's account (withdrawals)
     */
    WITHDRAWAL("Withdrawal"),

    /**
     * Grant payments from SASSA
     */
    PAYMENT("Payment"),

    /**
     * Refunds for failed transactions
     */
    REFUND("Refund"),
    TRANSFER("Transfer"),

    /**
     * Manual adjustments by admin
     */
    ADJUSTMENT("Adjustment");

    private final String displayName;

    TransactionType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public boolean isCredit() {
        return this == DEPOSIT || this == PAYMENT || this == REFUND;
    }

    public boolean isDebit() {
        return this == WITHDRAWAL;
    }
}
