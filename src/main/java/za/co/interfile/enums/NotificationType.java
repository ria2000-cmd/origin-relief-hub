package za.co.interfile.enums;

/**
 * Enum representing different types of notifications
 */
public enum NotificationType {
    /**
     * Payment-related notifications (grant payments received, etc.)
     */
    PAYMENT("Payment", "Payment notifications about grants and transfers"),

    /**
     * System notifications (maintenance, updates, general info)
     */
    SYSTEM("System", "System announcements and general information"),

    /**
     * Alert notifications (account issues, security alerts, failures)
     */
    ALERT("Alert", "Important alerts requiring attention"),

    /**
     * Reminder notifications (document expiry, action required, etc.)
     */
    REMINDER("Reminder", "Reminders for pending actions or deadlines"),

    /**
     * Withdrawal notifications (withdrawal status updates)
     */
    WITHDRAWAL("Withdrawal", "Notifications about withdrawal requests"),

    /**
     * Account notifications (profile updates, verification status)
     */
    ACCOUNT("Account", "Account-related notifications"),

    /**
     * Security notifications (login attempts, password changes)
     */
    SECURITY("Security", "Security-related alerts and notifications");

    private final String displayName;
    private final String description;

    NotificationType(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Get CSS class for type styling
     */
    public String getCssClass() {
        return switch (this) {
            case PAYMENT -> "notification-payment";
            case SYSTEM -> "notification-system";
            case ALERT -> "notification-alert";
            case REMINDER -> "notification-reminder";
            case WITHDRAWAL -> "notification-withdrawal";
            case ACCOUNT -> "notification-account";
            case SECURITY -> "notification-security";
        };
    }

    /**
     * Get icon class for notification display
     */
    public String getIconClass() {
        return switch (this) {
            case PAYMENT -> "icon-credit-card";
            case SYSTEM -> "icon-info-circle";
            case ALERT -> "icon-alert-triangle";
            case REMINDER -> "icon-bell";
            case WITHDRAWAL -> "icon-arrow-up-circle";
            case ACCOUNT -> "icon-user";
            case SECURITY -> "icon-shield";
        };
    }

    /**
     * Get background color for notification badge
     */
    public String getBadgeColor() {
        return switch (this) {
            case PAYMENT -> "success";
            case SYSTEM -> "info";
            case ALERT -> "warning";
            case REMINDER -> "primary";
            case WITHDRAWAL -> "secondary";
            case ACCOUNT -> "info";
            case SECURITY -> "danger";
        };
    }

    /**
     * Check if notification type should be sent via email by default
     */
    public boolean shouldSendEmail() {
        return switch (this) {
            case PAYMENT, WITHDRAWAL, SECURITY -> true;
            case ALERT -> true;
            case SYSTEM, REMINDER, ACCOUNT -> false;
        };
    }

    /**
     * Check if notification type should be sent via SMS by default
     */
    public boolean shouldSendSms() {
        return switch (this) {
            case PAYMENT, WITHDRAWAL -> true;
            case SECURITY, ALERT -> true;
            case SYSTEM, REMINDER, ACCOUNT -> false;
        };
    }
}
