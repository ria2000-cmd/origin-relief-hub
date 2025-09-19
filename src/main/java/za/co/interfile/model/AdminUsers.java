package za.co.interfile.model;

import jakarta.validation.constraints.*;
import lombok.*;
import za.co.interfile.enums.AdminRole;
import za.co.interfile.enums.AdminStatus;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * AdminUsers entity representing system administrators
 */
@Entity
@Table(name = "admin_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"passwordHash"})
public class AdminUsers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Long adminId;

    @NotBlank(message = "Username is required")
    @Size(max = 100, message = "Username must not exceed 100 characters")
    @Column(unique = true, nullable = false, length = 100)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Password is required")
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @NotBlank(message = "Full name is required")
    @Size(max = 255, message = "Full name must not exceed 255 characters")
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AdminRole role = AdminRole.ADMIN;

    @Column(columnDefinition = "JSON")
    private String permissions; // JSON string for specific permissions

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AdminStatus status = AdminStatus.ACTIVE;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    // JPA Lifecycle callbacks
    @PrePersist
    private void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    private void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Business methods
    public boolean isActive() {
        return this.status == AdminStatus.ACTIVE;
    }

    public boolean canProcessWithdrawals() {
        return this.isActive() &&
                (this.role == AdminRole.SUPER_ADMIN ||
                        this.role == AdminRole.ADMIN);
    }

    public String getDisplayName() {
        return this.fullName != null ? this.fullName : this.username;
    }
}
