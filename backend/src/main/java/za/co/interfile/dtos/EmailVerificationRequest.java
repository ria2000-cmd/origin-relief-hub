package za.co.interfile.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record EmailVerificationRequest(
        @NotBlank(message = "Verification token is required")
        String token,

        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        String email
) {}