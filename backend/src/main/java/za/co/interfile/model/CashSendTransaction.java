package za.co.interfile.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import za.co.interfile.enums.CashSendStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cash_send_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CashSendTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cash_send_id")
    private Long cashSendId;

    @NotNull
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @NotNull
    @Column(name = "fee", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal fee = BigDecimal.ZERO;

    @NotNull
    @Column(name = "total_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalCost;

    @NotBlank
    @Column(name = "recipient_phone", nullable = false, length = 15)
    private String recipientPhone;

    @NotBlank
    @Column(name = "recipient_name", nullable = false, length = 100)
    private String recipientName;

    @NotBlank
    @Column(name = "voucher_code", unique = true, nullable = false, length = 20)
    private String voucherCode;

    @NotBlank
    @Column(name = "pin", nullable = false, length = 10)
    private String pin;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private CashSendStatus status = CashSendStatus.ACTIVE;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "redeemed_at")
    private LocalDateTime redeemedAt;

    @Column(name = "redeemed_location")
    private String redeemedLocation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Column(name = "transaction_reference", length = 50)
    private String transactionReference;

    @PrePersist
    private void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = CashSendStatus.ACTIVE;
        }
        // Cash send expires in 30 days
        if (this.expiresAt == null) {
            this.expiresAt = this.createdAt.plusDays(30);
        }
    }

    public boolean isActive() {
        return this.status == CashSendStatus.ACTIVE &&
                LocalDateTime.now().isBefore(this.expiresAt);
    }

    public boolean isRedeemed() {
        return this.status == CashSendStatus.REDEEMED;
    }

    public boolean hasExpired() {
        return LocalDateTime.now().isAfter(this.expiresAt) ||
                this.status == CashSendStatus.EXPIRED;
    }
}