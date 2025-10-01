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
public class CashSendRequestDto {

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "10.00", message = "Minimum cash send amount is R10.00")
    @DecimalMax(value = "3000.00", message = "Maximum cash send amount is R3,000.00")
    private BigDecimal amount;

    @NotBlank(message = "Recipient phone number is required")
    @Pattern(regexp = "\\+?27\\d{9}|0\\d{9}", message = "Invalid South African phone number")
    private String recipientPhone;

    @NotBlank(message = "Recipient name is required")
    @Size(min = 2, max = 100, message = "Recipient name must be between 2 and 100 characters")
    private String recipientName;

    private String message; // Optional message to recipient
}