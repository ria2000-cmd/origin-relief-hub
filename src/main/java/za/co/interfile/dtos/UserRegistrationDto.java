package za.co.interfile.dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationDto {

    @NotBlank(message = "Full name is required")
    @Size(max = 255, message = "Full name must not exceed 255 characters")
    private String fullName;

    @NotBlank(message = "ID number is required")
    @Pattern(regexp = "\\d{13}", message = "ID number must be exactly 13 digits")
    private String idNumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @NotBlank(message = "Username is required")
    @Size(max = 255, message = "Username must not exceed 255 characters")
    private String username;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "\\+?[0-9]{10,15}", message = "Phone number must be 10-15 digits")
    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @Size(max = 1000, message = "Address must not exceed 1000 characters")
    private String address;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;
}