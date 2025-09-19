package za.co.interfile.dtos;

import lombok.Builder;

@Builder
public record EmailVerificationResponse(
        boolean success,
        String message,
        String redirectUrl
) {
    public static EmailVerificationResponse success(String redirectUrl) {
        return new EmailVerificationResponse(
                true,
                "Email verified successfully! You can now login to your account.",
                redirectUrl
        );
    }

    public static EmailVerificationResponse failure(String message) {
        return new EmailVerificationResponse(false, message, null);
    }
}