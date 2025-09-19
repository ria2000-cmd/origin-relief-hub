package za.co.interfile.enums;

/**
 * Enum representing different withdrawal methods
 */
public enum WithdrawalMethod {
    /**
     * Demo withdrawal (no actual money transfer)
     */
    DEMO("Demo Withdrawal"),

    /**
     * Bank transfer to user's bank account
     */
    BANK_TRANSFER("Bank Transfer"),

    /**
     * Cash pickup at designated locations
     */
    CASH_PICKUP("Cash Pickup"),

    /**
     * Mobile money transfer
     */
    MOBILE_MONEY("Mobile Money"),

    /**
     * Digital wallet transfer
     */
    DIGITAL_WALLET("Digital Wallet"),

    /**
     * Prepaid card loading
     */
    PREPAID_CARD("Prepaid Card"),

    /**
     * Cryptocurrency transfer
     */
    CRYPTOCURRENCY("Cryptocurrency");

    private final String displayName;

    WithdrawalMethod(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Check if withdrawal method requires bank details
     */
    public boolean requiresBankDetails() {
        return this == BANK_TRANSFER;
    }

    /**
     * Check if withdrawal method requires external gateway
     */
    public boolean requiresExternalGateway() {
        return this == BANK_TRANSFER || this == MOBILE_MONEY ||
                this == DIGITAL_WALLET || this == CRYPTOCURRENCY;
    }

    /**
     * Check if withdrawal method is instant
     */
    public boolean isInstant() {
        return this == DEMO || this == DIGITAL_WALLET || this == MOBILE_MONEY;
    }

    /**
     * Check if withdrawal method is demo/test mode
     */
    public boolean isDemo() {
        return this == DEMO;
    }

    /**
     * Get processing time in hours
     */
    public int getProcessingTimeHours() {
        return switch (this) {
            case DEMO -> 0; // Instant
            case DIGITAL_WALLET, MOBILE_MONEY -> 1;
            case BANK_TRANSFER -> 24;
            case CASH_PICKUP -> 4;
            case PREPAID_CARD -> 2;
            case CRYPTOCURRENCY -> 1;
        };
    }

    /**
     * Get icon class for method display
     */
    public String getIconClass() {
        return switch (this) {
            case DEMO -> "icon-demo";
            case BANK_TRANSFER -> "icon-bank";
            case CASH_PICKUP -> "icon-cash";
            case MOBILE_MONEY -> "icon-mobile";
            case DIGITAL_WALLET -> "icon-wallet";
            case PREPAID_CARD -> "icon-card";
            case CRYPTOCURRENCY -> "icon-crypto";
        };
    }

    /**
     * Get minimum withdrawal amount for this method
     */
    public java.math.BigDecimal getMinimumAmount() {
        return switch (this) {
            case DEMO -> new java.math.BigDecimal("10.00");
            case MOBILE_MONEY -> new java.math.BigDecimal("50.00");
            case BANK_TRANSFER -> new java.math.BigDecimal("100.00");
            case CASH_PICKUP -> new java.math.BigDecimal("20.00");
            case DIGITAL_WALLET -> new java.math.BigDecimal("25.00");
            case PREPAID_CARD -> new java.math.BigDecimal("50.00");
            case CRYPTOCURRENCY -> new java.math.BigDecimal("100.00");
        };
    }

    /**
     * Get maximum withdrawal amount for this method
     */
    public java.math.BigDecimal getMaximumAmount() {
        return switch (this) {
            case DEMO -> new java.math.BigDecimal("5000.00");
            case MOBILE_MONEY -> new java.math.BigDecimal("2000.00");
            case BANK_TRANSFER -> new java.math.BigDecimal("50000.00");
            case CASH_PICKUP -> new java.math.BigDecimal("5000.00");
            case DIGITAL_WALLET -> new java.math.BigDecimal("10000.00");
            case PREPAID_CARD -> new java.math.BigDecimal("3000.00");
            case CRYPTOCURRENCY -> new java.math.BigDecimal("25000.00");
        };
    }

    /**
     * Get fee percentage for this method
     */
    public java.math.BigDecimal getFeePercentage() {
        return switch (this) {
            case DEMO -> new java.math.BigDecimal("2.5");
            case MOBILE_MONEY -> new java.math.BigDecimal("3.0");
            case BANK_TRANSFER -> new java.math.BigDecimal("1.5");
            case CASH_PICKUP -> new java.math.BigDecimal("4.0");
            case DIGITAL_WALLET -> new java.math.BigDecimal("2.0");
            case PREPAID_CARD -> new java.math.BigDecimal("3.5");
            case CRYPTOCURRENCY -> new java.math.BigDecimal("1.0");
        };
    }

    /**
     * Get description of the withdrawal method
     */
    public String getDescription() {
        return switch (this) {
            case DEMO -> "Demo withdrawal for testing purposes - no actual money transfer";
            case BANK_TRANSFER -> "Transfer funds directly to your bank account";
            case CASH_PICKUP -> "Pick up cash at participating locations";
            case MOBILE_MONEY -> "Send money to your mobile money account";
            case DIGITAL_WALLET -> "Transfer to your digital wallet";
            case PREPAID_CARD -> "Load funds onto a prepaid card";
            case CRYPTOCURRENCY -> "Withdraw as cryptocurrency to your wallet";
        };
    }
}