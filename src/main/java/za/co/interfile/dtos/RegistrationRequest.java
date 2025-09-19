package za.co.interfile.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Builder
public record RegistrationRequest(
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
        @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers, and underscores")
        String username,

        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        @Size(max = 100, message = "Email must not exceed 100 characters")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters long")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&].*$",
                message = "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character")
        String password,

        @NotBlank(message = "Password confirmation is required")
        String confirmPassword,

        @NotBlank(message = "First name is required")
        @Size(max = 50, message = "First name must not exceed 50 characters")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(max = 50, message = "Last name must not exceed 50 characters")
        String lastName,

        @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number should be valid")
        @Size(max = 20, message = "Phone number must not exceed 20 characters")
        String phoneNumber,

        @Size(max = 255, message = "Address must not exceed 255 characters")
        String address,

        boolean agreeToTerms
) {
    // Custom validation methods
    public boolean isPasswordMatching() {
        return password != null && password.equals(confirmPassword);
    }

    public boolean hasAgreedToTerms() {
        return agreeToTerms;
    }
}