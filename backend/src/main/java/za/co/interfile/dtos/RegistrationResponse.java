package za.co.interfile.dtos;

import lombok.Builder;

@Builder
public record RegistrationResponse(
        Long userId,
        String username,
        String email,
        String firstName,
        String lastName,
        String message,
        boolean success,
        String verificationToken
) {
    public static RegistrationResponse success(Long userId, String username, String email,
                                               String firstName, String lastName, String verificationToken) {
        return new RegistrationResponse(
                userId,
                username,
                email,
                firstName,
                lastName,
                "Registration successful! Please check your email to verify your account.",
                true,
                verificationToken
        );
    }

    public static RegistrationResponse failure(String message) {
        return new RegistrationResponse(
                null,
                null,
                null,
                null,
                null,
                message,
                false,
                null
        );
    }
}
