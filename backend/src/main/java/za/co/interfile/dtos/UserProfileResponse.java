package za.co.interfile.dtos;

import lombok.Builder;

@Builder
public record UserProfileResponse(
        Long id,
        String username,
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        String address,
        String status,
        String role,
        boolean emailVerified,
        String createdAt,
        String lastLogin
) {}
