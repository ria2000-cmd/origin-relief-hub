package za.co.interfile.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import za.co.interfile.enums.GrantType;
import za.co.interfile.enums.SassaStatus;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "sassa_accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SassaAccounts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sassa_account_id")
    private Long sassaAccountId;

    @NotBlank(message = "SASSA reference number is required")
    @Size(max = 50, message = "SASSA reference number must not exceed 50 characters")
    @Column(name = "sassa_reference_number", unique = true, nullable = false, length = 50)
    private String sassaReferenceNumber;

    @NotNull(message = "Grant type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "grant_type", nullable = false, length = 30)
    private GrantType grantType;

    @NotNull(message = "Monthly amount is required")
    @DecimalMin(value = "0.00", message = "Monthly amount must be positive")
    @DecimalMax(value = "999999.99", message = "Monthly amount too large")
    @Column(name = "monthly_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private SassaStatus status = SassaStatus.PENDING_VERIFICATION;

    @Column(name = "verification_date")
    private LocalDateTime verificationDate;

    @Column(name = "next_payment_date")
    private LocalDate nextPaymentDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Column(name = "last_sync_date")
    private LocalDateTime lastSyncDate;

    @Column(name = "external_account_id")
    private String externalAccountId;

    @Column(name = "verification_attempts")
    private Integer verificationAttempts = 0;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "account_notes", columnDefinition = "TEXT")
    private String accountNotes;

    @PrePersist
    private void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = SassaStatus.PENDING_VERIFICATION;
        }
        if (this.verificationAttempts == null) {
            this.verificationAttempts = 0;
        }
    }

    @PreUpdate
    private void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isActive() {
        return this.status == SassaStatus.ACTIVE;
    }

    public boolean isPendingVerification() {
        return this.status == SassaStatus.PENDING_VERIFICATION;
    }

    public boolean isEligibleForPayment() {
        return this.isActive() &&
                this.nextPaymentDate != null &&
                !this.nextPaymentDate.isAfter(LocalDate.now());
    }

}