package za.co.interfile.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import za.co.interfile.enums.UsersStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private Long userId;
    private String fullName;
    private String idNumber;
    private String email;
    private String username;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private UsersStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLogin;
    private Boolean emailVerified;
    private Boolean phoneVerified;
    private String displayName;
    private String maskedIdNumber;
    private Integer age;
    private Boolean isActive;
    private Boolean isFullyVerified;
    private Boolean canWithdraw;
    private int unreadNotificationCount;
    private String profilePhotoPath;
}