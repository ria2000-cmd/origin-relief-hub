package za.co.interfile.enums;

/**
 * Enum representing notification priority levels
 */
public enum NotificationPriority {
    /**
     * Low priority - general information, non-urgent
     */
    LOW("Low", 1),

    /**
     * Medium priority - standard notifications
     */
    MEDIUM("Medium", 2),

    /**
     * High priority - important notifications requiring attention
     */
    HIGH("High", 3),

    /**
     * Urgent priority - critical notifications requiring immediate attention
     */
    URGENT("Urgent", 4);

    private final String displayName;
    private final int level;

    NotificationPriority(String displayName, int level) {
        this.displayName = displayName;
        this.level = level;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getLevel() {
        return level;
    }

    /**
     * Get CSS class for priority styling
     */
    public String getCssClass() {
        return switch (this) {
            case LOW -> "priority-low";
            case MEDIUM -> "priority-medium";
            case HIGH -> "priority-high";
            case URGENT -> "priority-urgent";
        };
    }

    /**
     * Get badge CSS class for priority display
     */
    public String getBadgeCssClass() {
        return switch (this) {
            case LOW -> "badge-secondary";
            case MEDIUM -> "badge-info";
            case HIGH -> "badge-warning";
            case URGENT -> "badge-danger";
        };
    }

    /**
     * Get icon class for priority display
     */
    public String getIconClass() {
        return switch (this) {
            case LOW -> "icon-chevron-down";
            case MEDIUM -> "icon-minus";
            case HIGH -> "icon-chevron-up";
            case URGENT -> "icon-alert-circle";
        };
    }

    /**
     * Get priority order for sorting (higher number = higher priority)
     */
    public int getSortOrder() {
        return this.level;
    }

    /**
     * Check if priority is high or urgent
     */
    public boolean isHighPriority() {
        return this == HIGH || this == URGENT;
    }

    /**
     * Check if priority is urgent
     */
    public boolean isUrgent() {
        return this == URGENT;
    }

    /**
     * Get auto-dismissal time in hours based on priority
     */
    public int getAutoDismissalHours() {
        return switch (this) {
            case LOW -> 72; // 3 days
            case MEDIUM -> 168; // 1 week
            case HIGH -> 336; // 2 weeks
            case URGENT -> 720; // 1 month
        };
    }

    /**
     * Get expiration time in hours for temporary notifications
     */
    public int getDefaultExpirationHours() {
        return switch (this) {
            case LOW -> 24; // 1 day
            case MEDIUM -> 72; // 3 days
            case HIGH -> 168; // 1 week
            case URGENT -> -1; // Never expires
        };
    }

    /**
     * Check if notifications of this priority should persist
     */
    public boolean shouldPersist() {
        return this == HIGH || this == URGENT;
    }

    /**
     * Get notification sound type
     */
    public String getSoundType() {
        return switch (this) {
            case LOW -> "soft";
            case MEDIUM -> "standard";
            case HIGH -> "attention";
            case URGENT -> "urgent";
        };
    }
}