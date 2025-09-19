package za.co.interfile.enums;


/**
 * Enum for admin user roles
 */
public enum AdminRole {
    SUPER_ADMIN("Super Admin"),
    ADMIN("Admin"),
    MODERATOR("Moderator"),
    VIEWER("Viewer");

    private final String displayName;

    AdminRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}