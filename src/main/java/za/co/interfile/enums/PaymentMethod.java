package za.co.interfile.enums;

/**
 * Enum representing different payment methods
 */
public enum PaymentMethod {
    /**
     * Demo withdrawal function (no actual money transfer)
     */
    DEMO_WITHDRAWAL("Demo Withdrawal"),

    /**
     * Instant payment through gateway
     */
    INSTANT_PAYMENT("Instant Payment"),

    /**
     * Scheduled monthly grant payment
     */
    SCHEDULED_PAYMENT("Scheduled Payment"),

    /**
     * Manual payment by admin
     */
    MANUAL_PAYMENT("Manual Payment"),

    /**
     * Bank transfer
     */
    BANK_TRANSFER("Bank Transfer"),

    /**
     * Cash pickup
     */
    CASH_PICKUP("Cash Pickup"),

    /**
     * Mobile money transfer
     */
    MOBILE_MONEY("Mobile Money"),

    /**
     * System adjustment
     */
    SYSTEM_ADJUSTMENT("System Adjustment");

    private final String displayName;

    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public boolean requiresExternalGateway() {
        return this == INSTANT_PAYMENT || this == BANK_TRANSFER || this == MOBILE_MONEY;
    }

    public boolean isDemo() {
        return this == DEMO_WITHDRAWAL || this == MANUAL_PAYMENT || this == SYSTEM_ADJUSTMENT;
    }

    public String getIconClass() {
        return switch (this) {
            case DEMO_WITHDRAWAL -> "icon-demo";
            case INSTANT_PAYMENT -> "icon-instant";
            case SCHEDULED_PAYMENT -> "icon-schedule";
            case MANUAL_PAYMENT -> "icon-manual";
            case BANK_TRANSFER -> "icon-bank";
            case CASH_PICKUP -> "icon-cash";
            case MOBILE_MONEY -> "icon-mobile";
            case SYSTEM_ADJUSTMENT -> "icon-system";
        };
    }
}