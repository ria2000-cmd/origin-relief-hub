package za.co.interfile.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import za.co.interfile.enums.ElectricityTransactionStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "electricity_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElectricityTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    @NotNull
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @NotNull
    @Column(name = "units", nullable = false, precision = 10, scale = 2)
    private BigDecimal units; // kWh purchased

    @NotBlank
    @Column(name = "meter_number", nullable = false, length = 20)
    private String meterNumber;

    @NotBlank
    @Column(name = "municipality", nullable = false, length = 100)
    private String municipality;

    @NotBlank
    @Column(name = "token", nullable = false, length = 30)
    private String token; // 20-digit electricity token

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ElectricityTransactionStatus status = ElectricityTransactionStatus.COMPLETED;

    @Column(name = "transaction_reference", length = 50)
    private String transactionReference;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "token_expiry_date")
    private LocalDateTime tokenExpiryDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Column(name = "rate_per_unit", precision = 10, scale = 4)
    private BigDecimal ratePerUnit; // Rate at time of purchase

    @PrePersist
    private void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = ElectricityTransactionStatus.COMPLETED;
        }
        // Token expires in 7 days
        if (this.tokenExpiryDate == null) {
            this.tokenExpiryDate = this.createdAt.plusDays(7);
        }
    }

    public boolean isTokenValid() {
        return LocalDateTime.now().isBefore(this.tokenExpiryDate);
    }
}