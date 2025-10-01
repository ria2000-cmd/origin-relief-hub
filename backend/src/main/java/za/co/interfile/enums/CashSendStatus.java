package za.co.interfile.enums;

public enum CashSendStatus {

    ACTIVE("Active"),
    REDEEMED("Redeemed"),
    EXPIRED("Expired"),
    CANCELLED("Cancelled");

    private final String displayName;

    CashSendStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}