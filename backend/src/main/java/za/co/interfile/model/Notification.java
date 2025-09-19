package za.co.interfile.model;

import jakarta.validation.constraints.*;
import jakarta.persistence.*;
import lombok.*;
import za.co.interfile.enums.NotificationType;
import za.co.interfile.enums.NotificationPriority;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Notification entity for managing user notifications in the Social Relief Payment System
 * Handles payment alerts, system messages, withdrawal confirmations, etc.
 */
@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user"})
@EqualsAndHashCode(exclude = {"user"})
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Message is required")
    @Size(max = 2000, message = "Message must not exceed 2000 characters")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @NotNull(message = "Type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private NotificationType type = NotificationType.SYSTEM;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    @NotNull(message = "Priority is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Builder.Default
    private NotificationPriority priority = NotificationPriority.MEDIUM;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "read_at")
    private LocalDateTime readAt;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    // Additional tracking fields
    @Column(name = "related_entity_type", length = 50)
    private String relatedEntityType; // e.g., "Transaction", "WithdrawalRequest", "SassaAccount"

    @Column(name = "related_entity_id")
    private Long relatedEntityId; // ID of the related entity

    @Column(name = "action_url", length = 500)
    private String actionUrl; // URL for call-to-action

    @Column(name = "action_text", length = 100)
    private String actionText; // Text for call-to-action button

    @Column(name = "expires_at")
    private LocalDateTime expiresAt; // When notification should be automatically removed

    @Column(name = "sent_via_email")
    @Builder.Default
    private Boolean sentViaEmail = false;

    @Column(name = "sent_via_sms")
    @Builder.Default
    private Boolean sentViaSms = false;

    @Column(name = "email_sent_at")
    private LocalDateTime emailSentAt;

    @Column(name = "sms_sent_at")
    private LocalDateTime smsSentAt;

    @Column(name = "metadata", columnDefinition = "JSON")
    private String metadata; // Additional data in JSON format


    @PrePersist
    private void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.type == null) {
            this.type = NotificationType.SYSTEM;
        }
        if (this.priority == null) {
            this.priority = NotificationPriority.MEDIUM;
        }
        if (this.isRead == null) {
            this.isRead = false;
        }
        if (this.sentViaEmail == null) {
            this.sentViaEmail = false;
        }
        if (this.sentViaSms == null) {
            this.sentViaSms = false;
        }
    }

    @PreUpdate
    private void onUpdate() {
        // Set read timestamp when marked as read
        if (Boolean.TRUE.equals(this.isRead) && this.readAt == null) {
            this.readAt = LocalDateTime.now();
        }
    }


    /**
     * Mark notification as read
     */
    public void markAsRead() {
        this.isRead = true;
        this.readAt = LocalDateTime.now();
    }

    /**
     * Mark notification as unread
     */
    public void markAsUnread() {
        this.isRead = false;
        this.readAt = null;
    }

    /**
     * Mark email as sent
     */
    public void markEmailSent() {
        this.sentViaEmail = true;
        this.emailSentAt = LocalDateTime.now();
    }

    /**
     * Mark SMS as sent
     */
    public void markSmsSent() {
        this.sentViaSms = true;
        this.smsSentAt = LocalDateTime.now();
    }

    /**
     * Set expiration time
     * @param hours Hours from now when notification expires
     */
    public void setExpirationHours(int hours) {
        this.expiresAt = LocalDateTime.now().plusHours(hours);
    }

    // Status Checking Methods

    public boolean isRead() {
        return Boolean.TRUE.equals(this.isRead);
    }

    public boolean isUnread() {
        return !isRead();
    }

    public boolean hasExpired() {
        return this.expiresAt != null && LocalDateTime.now().isAfter(this.expiresAt);
    }

    public boolean hasAction() {
        return this.actionUrl != null && !this.actionUrl.trim().isEmpty();
    }

    public boolean isEmailSent() {
        return Boolean.TRUE.equals(this.sentViaEmail);
    }

    public boolean isSmsSent() {
        return Boolean.TRUE.equals(this.sentViaSms);
    }

    public boolean isHighPriority() {
        return this.priority == NotificationPriority.HIGH ||
                this.priority == NotificationPriority.URGENT;
    }

    public boolean isUrgent() {
        return this.priority == NotificationPriority.URGENT;
    }

    public boolean isRecent() {
        return getAgeHours() <= 24;
    }

    // Type Checking Methods

    public boolean isPaymentNotification() {
        return this.type == NotificationType.PAYMENT;
    }

    public boolean isSystemNotification() {
        return this.type == NotificationType.SYSTEM;
    }

    public boolean isAlertNotification() {
        return this.type == NotificationType.ALERT;
    }

    public boolean isReminderNotification() {
        return this.type == NotificationType.REMINDER;
    }

    public boolean isWithdrawalNotification() {
        return "WithdrawalRequest".equals(this.relatedEntityType);
    }

    public boolean isTransactionNotification() {
        return "Transaction".equals(this.relatedEntityType);
    }

    public boolean isSassaNotification() {
        return "SassaAccount".equals(this.relatedEntityType);
    }

    // Display/Formatting Methods

    /**
     * Get formatted creation date
     * @return Formatted date string
     */
    public String getFormattedCreatedAt() {
        return this.createdAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
    }

    /**
     * Get formatted read date
     * @return Formatted date string or "Not read"
     */
    public String getFormattedReadAt() {
        return this.readAt != null
                ? this.readAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))
                : "Not read";
    }

    /**
     * Get time ago string for display
     * @return Time ago string like "2 hours ago"
     */
    public String getTimeAgo() {
        long hours = getAgeHours();
        if (hours < 1) {
            return "Just now";
        } else if (hours < 24) {
            return hours + " hour" + (hours == 1 ? "" : "s") + " ago";
        } else {
            long days = hours / 24;
            return days + " day" + (days == 1 ? "" : "s") + " ago";
        }
    }

    /**
     * Get age in hours
     * @return Hours since creation
     */
    public long getAgeHours() {
        return java.time.Duration.between(this.createdAt, LocalDateTime.now()).toHours();
    }

    /**
     * Get priority display name
     * @return Human-readable priority
     */
    public String getPriorityDisplay() {
        return this.priority.getDisplayName();
    }

    /**
     * Get type display name
     * @return Human-readable type
     */
    public String getTypeDisplay() {
        return this.type.getDisplayName();
    }

    /**
     * Get CSS class for priority styling
     * @return CSS class name
     */
    public String getPriorityCssClass() {
        return this.priority.getCssClass();
    }

    /**
     * Get CSS class for type styling
     * @return CSS class name
     */
    public String getTypeCssClass() {
        return this.type.getCssClass();
    }

    /**
     * Get CSS class for read/unread status
     * @return CSS class name
     */
    public String getReadStatusCssClass() {
        return isRead() ? "notification-read" : "notification-unread";
    }

    /**
     * Get icon class for notification type
     * @return Icon class name
     */
    public String getIconClass() {
        return this.type.getIconClass();
    }

    /**
     * Get truncated message for list display
     * @param maxLength Maximum length
     * @return Truncated message
     */
    public String getTruncatedMessage(int maxLength) {
        if (this.message.length() <= maxLength) {
            return this.message;
        }
        return this.message.substring(0, maxLength - 3) + "...";
    }

    /**
     * Get notification summary for logging
     * @return Summary string
     */
    public String getNotificationSummary() {
        return String.format("Notification[id=%d, type=%s, priority=%s, read=%s, user=%s]",
                this.notificationId,
                this.type,
                this.priority,
                this.isRead,
                this.user != null ? this.user.getEmail() : "null");
    }

    // Business Logic Methods

    /**
     * Check if notification needs attention
     * @return true if needs attention
     */
    public boolean needsAttention() {
        return isUnread() && (isHighPriority() || getAgeHours() > 48);
    }

    /**
     * Get delivery status
     * @return Delivery status description
     */
    public String getDeliveryStatus() {
        if (isEmailSent() && isSmsSent()) {
            return "Sent via Email & SMS";
        } else if (isEmailSent()) {
            return "Sent via Email";
        } else if (isSmsSent()) {
            return "Sent via SMS";
        } else {
            return "In-App Only";
        }
    }

    /**
     * Check if notification should be auto-dismissed
     * @return true if should be dismissed
     */
    public boolean shouldBeAutoDismissed() {
        return hasExpired() || (isRead() && getAgeHours() > 168); // 1 week
    }

    // Static Factory Methods

    /**
     * Create payment notification
     */
    public static Notification createPaymentNotification(Users user, String title, String message, String amount) {
        return Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(NotificationType.PAYMENT)
                .priority(NotificationPriority.HIGH)
                .relatedEntityType("Transaction")
                .actionText("View Transaction")
                .metadata("{\"amount\":\"" + amount + "\"}")
                .build();
    }

    /**
     * Create withdrawal notification
     */
    public static Notification createWithdrawalNotification(Users user, String title, String message, Long withdrawalId) {
        return Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(NotificationType.ALERT)
                .priority(NotificationPriority.HIGH)
                .relatedEntityType("WithdrawalRequest")
                .relatedEntityId(withdrawalId)
                .actionText("View Withdrawal")
                .actionUrl("/withdrawals/" + withdrawalId)
                .build();
    }

    /**
     * Create system notification
     */
    public static Notification createSystemNotification(Users user, String title, String message) {
        return Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(NotificationType.SYSTEM)
                .priority(NotificationPriority.MEDIUM)
                .build();
    }

    /**
     * Create reminder notification
     */
    public static Notification createReminderNotification(Users user, String title, String message, int expiryHours) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(NotificationType.REMINDER)
                .priority(NotificationPriority.LOW)
                .build();

        notification.setExpirationHours(expiryHours);
        return notification;
    }

    /**
     * Create alert notification
     */
    public static Notification createAlertNotification(Users user, String title, String message, NotificationPriority priority) {
        return Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(NotificationType.ALERT)
                .priority(priority)
                .build();
    }
}