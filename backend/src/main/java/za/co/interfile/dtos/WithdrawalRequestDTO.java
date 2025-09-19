package za.co.interfile.dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WithdrawalRequestDTO {
    @NotBlank(message = "ID number is required")
    @Pattern(regexp = "\\d{13}", message = "ID number must be exactly 13 digits")
    private String idNumber;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.0", message = "Minimum withdrawal amount is R1.00")
    @DecimalMax(value = "10000.0", message = "Maximum withdrawal amount is R10,000.00")
    @Digits(integer = 8, fraction = 2, message = "Invalid amount format")
    private BigDecimal amount;

    private String description;
}
