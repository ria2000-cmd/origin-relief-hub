package za.co.interfile.enums;

/**
 * Enum for admin user status
 */
public enum AdminStatus {
    ACTIVE("Active"),
    INACTIVE("Inactive"),
    SUSPENDED("Suspended");

    private final String displayName;

    AdminStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}