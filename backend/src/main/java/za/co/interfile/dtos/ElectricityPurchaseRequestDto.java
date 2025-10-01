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
public class ElectricityPurchaseRequestDto {

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "5.00", message = "Minimum electricity purchase is R5.00")
    @DecimalMax(value = "5000.00", message = "Maximum electricity purchase is R5,000.00")
    private BigDecimal amount;

    @NotBlank(message = "Meter number is required")
    @Pattern(regexp = "\\d{11,20}", message = "Meter number must be 11-20 digits")
    private String meterNumber;

    @NotBlank(message = "Municipality is required")
    private String municipality;
}