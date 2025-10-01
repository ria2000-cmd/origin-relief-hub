package za.co.interfile.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import za.co.interfile.enums.UsersStatus;
import za.co.interfile.enums.SassaStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * User entity representing registered clients in the Social Relief Payment System
 * Implements UserDetails for Spring Security integration
 */
@Entity
@Table(schema = "social_relief_system", name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Users implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @NotBlank(message = "Full name is required")
    @Size(max = 255, message = "Full name must not exceed 255 characters")
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @NotBlank(message = "ID number is required")
    @Pattern(regexp = "\\d{13}", message = "ID number must be exactly 13 digits")
    @Column(name = "id_number", unique = true, nullable = false, length = 13)
    private String idNumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Username is required")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    @Column(unique = true, nullable = false)
    private String username;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "\\+?[0-9]{10,15}", message = "Phone number must be 10-15 digits")
    @Column(nullable = false, length = 15)
    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Size(max = 1000, message = "Address must not exceed 1000 characters")
    @Column(columnDefinition = "TEXT")
    private String address;

    @Past(message = "Date of birth must be in the past")
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private UsersStatus status = UsersStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "email_verified")
    @Builder.Default
    private Boolean emailVerified = false;

    @Column(name = "phone_verified")
    @Builder.Default
    private Boolean phoneVerified = false;

    @Column(name = "profile_photo_path")
    private String profilePhotoPath;

    // Relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<SassaAccounts> sassaAccounts = new ArrayList<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserBalance userBalance;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Transaction> transactions = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Notification> notifications = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<WithdrawalRequest> withdrawalRequests = new ArrayList<>();

    // JPA Lifecycle callbacks
    @PrePersist
    private void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = UsersStatus.PENDING;
        }
        if (this.emailVerified == null) {
            this.emailVerified = false;
        }
        if (this.phoneVerified == null) {
            this.phoneVerified = false;
        }
    }

    @PreUpdate
    private void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(() -> "ROLE_USER");
    }

    @Override
    public String getPassword() {
        return this.passwordHash;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return this.status != UsersStatus.DELETED;
    }

    @Override
    public boolean isAccountNonLocked() {
        return this.status != UsersStatus.SUSPENDED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.status == UsersStatus.ACTIVE;
    }

    public boolean isActive() {
        return this.status == UsersStatus.ACTIVE;
    }

    public boolean isPending() {
        return this.status == UsersStatus.PENDING;
    }

    public boolean isSuspended() {
        return this.status == UsersStatus.SUSPENDED;
    }

    public boolean isDeleted() {
        return this.status == UsersStatus.DELETED;
    }

    public boolean hasVerifiedEmail() {
        return Boolean.TRUE.equals(this.emailVerified);
    }

    public boolean hasVerifiedPhone() {
        return Boolean.TRUE.equals(this.phoneVerified);
    }

    public boolean hasActiveSassaAccount() {
        return this.sassaAccounts.stream()
                .anyMatch(account -> account.getStatus() == SassaStatus.ACTIVE);
    }

    public SassaAccounts getActiveSassaAccount() {
        return this.sassaAccounts.stream()
                .filter(account -> account.getStatus() == SassaStatus.ACTIVE)
                .findFirst()
                .orElse(null);
    }

    public boolean canWithdraw() {
        return this.isActive() &&
                this.hasVerifiedEmail() &&
                this.hasActiveSassaAccount() &&
                this.userBalance != null &&
                this.userBalance.getAvailableBalance().compareTo(BigDecimal.ZERO) > 0;
    }

    public int getUnreadNotificationCount() {
        return (int) this.notifications.stream()
                .filter(notification -> !notification.getIsRead())
                .count();
    }

    public void updateLastLogin() {
        this.lastLogin = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void activate() {
        this.status = UsersStatus.ACTIVE;
        this.updatedAt = LocalDateTime.now();
    }

    public void suspend() {
        this.status = UsersStatus.SUSPENDED;
        this.updatedAt = LocalDateTime.now();
    }

    public void verifyEmail() {
        this.emailVerified = true;
        this.updatedAt = LocalDateTime.now();
    }

    public void verifyPhone() {
        this.phoneVerified = true;
        this.updatedAt = LocalDateTime.now();
    }

    // Helper method to get display name
    public String getDisplayName() {
        return this.fullName != null ? this.fullName : this.email;
    }

    // Helper method to get masked ID number for display
    public String getMaskedIdNumber() {
        if (this.idNumber == null || this.idNumber.length() < 13) {
            return "****";
        }
        return this.idNumber.substring(0, 6) + "*******";
    }

    // Helper method to get age from ID number (South African ID format)
    public Integer getAgeFromIdNumber() {
        if (this.idNumber == null || this.idNumber.length() < 6) {
            return null;
        }

        try {
            String yearPart = this.idNumber.substring(0, 2);
            String monthPart = this.idNumber.substring(2, 4);
            String dayPart = this.idNumber.substring(4, 6);

            int year = Integer.parseInt(yearPart);
            int month = Integer.parseInt(monthPart);
            int day = Integer.parseInt(dayPart);

            // Determine century (SA ID logic)
            int fullYear = year >= 0 && year <= 21 ? 2000 + year : 1900 + year;

            LocalDate birthDate = LocalDate.of(fullYear, month, day);
            LocalDate now = LocalDate.now();

            return now.getYear() - birthDate.getYear() -
                    (now.getDayOfYear() < birthDate.getDayOfYear() ? 1 : 0);

        } catch (Exception e) {
            return null;
        }
    }

    // Additional helper methods
    public List<SassaAccounts> getActiveSassaAccounts() {
        return this.sassaAccounts.stream()
                .filter(account -> account.getStatus() == SassaStatus.ACTIVE)
                .toList();
    }

    public BigDecimal getTotalAvailableBalance() {
        return this.userBalance != null ? this.userBalance.getAvailableBalance() : BigDecimal.ZERO;
    }

    public boolean hasAnyBalance() {
        return this.userBalance != null &&
                this.userBalance.getAvailableBalance().compareTo(BigDecimal.ZERO) > 0;
    }

    public boolean isFullyVerified() {
        return this.hasVerifiedEmail() && this.hasVerifiedPhone();
    }

    public boolean isReadyForPayments() {
        return this.isActive() && this.isFullyVerified() && this.hasActiveSassaAccount();
    }
}