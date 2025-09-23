package za.co.interfile.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import za.co.interfile.dtos.*;
import za.co.interfile.enums.UsersStatus;
import za.co.interfile.exception.InvalidTokenException;
import za.co.interfile.exception.UserNotFoundException;
import za.co.interfile.service.UsersService;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for User Management in Social Relief System
 * Handles user registration, authentication, and profile management
 */
@RestController
@RequestMapping("/api/relief-hub")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:7005", maxAge = 3600)
public class UsersController {

    private final UsersService userService;


    /**
     * Register a new user
     */
    @PostMapping("/auth/register")
    public ResponseEntity<ApiResponse<UserResponseDto>> registerUser(
            @Valid @RequestBody UserRegistrationDto registrationDto) {

        log.info("Registration request received for email: {}", registrationDto.getEmail());

        try {
            UserResponseDto user = userService.registerUser(registrationDto);

            ApiResponse<UserResponseDto> response = ApiResponse.success("User registered successfully", user);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            log.error("Registration failed for email: {}", registrationDto.getEmail(), e);

            ApiResponse<UserResponseDto> response = ApiResponse.error(e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * User login
     */
    @PostMapping("/auth/login")
    public ResponseEntity<ApiResponse<LoginResponseDto>> loginUser(
            @Valid @RequestBody UserLoginDto loginDto) {

        log.info("Login request received for email: {}", loginDto.getEmail());

        try {
            LoginResponseDto loginResponse = userService.loginUser(loginDto);

            ApiResponse<LoginResponseDto> response = ApiResponse.<LoginResponseDto>builder()
                    .success(true)
                    .message("Login successful")
                    .data(loginResponse)
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Login failed for email: {}", loginDto.getEmail(), e);

            ApiResponse<LoginResponseDto> response = ApiResponse.<LoginResponseDto>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/auth/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordDto forgotPasswordDto) {

        log.info("Forgot password request received for email: {}", forgotPasswordDto.getEmail());

        try {
            userService.initiatePasswordReset(forgotPasswordDto.getEmail());

            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(true)
                    .message("Password reset instructions have been sent to your email")
                    .data("Reset email sent successfully")
                    .build();

            return ResponseEntity.ok(response);

        } catch (UserNotFoundException e) {
            log.warn("Password reset requested for non-existent email: {}", forgotPasswordDto.getEmail());

            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(true)
                    .message("If this email exists, password reset instructions have been sent")
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Password reset failed for email: {}", forgotPasswordDto.getEmail(), e);

            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(false)
                    .message("Password reset failed. Please try again later.")
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/auth/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @Valid @RequestBody ResetPasswordDto resetPasswordDto) {

        log.info("Password reset attempt with token");

        try {
            userService.resetPassword(resetPasswordDto.getToken(), resetPasswordDto.getNewPassword());

            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(true)
                    .message("Password has been reset successfully")
                    .build();

            return ResponseEntity.ok(response);

        } catch (InvalidTokenException e) {
            log.warn("Invalid or expired reset token used");

            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(false)
                    .message("Invalid or expired reset token")
                    .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (Exception e) {
            log.error("Password reset failed", e);

            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(false)
                    .message("Password reset failed. Please try again.")
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    // ==================== USER PROFILE ENDPOINTS ====================

    /**
     * Get current user profile
     */
    @GetMapping("/getProfile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<UserResponseDto>> getCurrentUserProfile(
            @RequestHeader("Authorization") String token) {

        try {
            // Extract user ID from token (you'll need to implement this in your JWT provider)
            String jwtToken = token.substring(7); // Remove "Bearer " prefix
            Long userId = userService.getUserIdFromToken(jwtToken);

            UserResponseDto user = userService.getUserById(userId);

            ApiResponse<UserResponseDto> response = ApiResponse.<UserResponseDto>builder()
                    .success(true)
                    .message("User profile retrieved successfully")
                    .data(user)
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to get current user profile", e);

            ApiResponse<UserResponseDto> response = ApiResponse.<UserResponseDto>builder()
                    .success(false)
                    .message("Failed to retrieve user profile")
                    .build();

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    /**
     * Get user by ID
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<UserResponseDto>> getUserById(@PathVariable Long userId) {

        try {
            UserResponseDto user = userService.getUserById(userId);

            ApiResponse<UserResponseDto> response = ApiResponse.<UserResponseDto>builder()
                    .success(true)
                    .message("User retrieved successfully")
                    .data(user)
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to get user by ID: {}", userId, e);

            ApiResponse<UserResponseDto> response = ApiResponse.<UserResponseDto>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * Update user profile
     */
    @PutMapping("/update/profile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<UserResponseDto>> updateUserProfile(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody UserUpdateDto updateDto) {

        try {
            String jwtToken = token.substring(7);
            Long userId = userService.getUserIdFromToken(jwtToken);

            UserResponseDto updatedUser = userService.updateUser(userId, updateDto);

            ApiResponse<UserResponseDto> response = ApiResponse.<UserResponseDto>builder()
                    .success(true)
                    .message("User profile updated successfully")
                    .data(updatedUser)
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to update user profile", e);

            ApiResponse<UserResponseDto> response = ApiResponse.<UserResponseDto>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Update user password
     */
    @PutMapping("/update/password")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<String>> updatePassword(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody PasswordUpdateDto passwordDto) {

        try {
            String jwtToken = token.substring(7);
            Long userId = userService.getUserIdFromToken(jwtToken);

            userService.updatePassword(userId, passwordDto);

            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(true)
                    .message("Password updated successfully")
                    .data("Password changed")
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to update password", e);

            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    // ==================== EMAIL & PHONE VERIFICATION ====================

    /**
     * Verify user email
     */
    @PostMapping("/user/{userId}/verify-email")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@PathVariable Long userId) {

        try {
            userService.verifyEmail(userId);

            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(true)
                    .message("Email verified successfully")
                    .data("Email verification completed")
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to verify email for user: {}", userId, e);

            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Verify user phone
     */
    @PostMapping("/user/{userId}/verify-phone")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> verifyPhone(@PathVariable Long userId) {

        try {
            userService.verifyPhone(userId);

            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(true)
                    .message("Phone verified successfully")
                    .data("Phone verification completed")
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to verify phone for user: {}", userId, e);

            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    // ==================== ADMIN ENDPOINTS ====================

    /**
     * Get all users with pagination
     */
    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserResponseDto>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        try {
            Page<UserResponseDto> users = userService.getAllUsers(page, size, sortBy, sortDir);

            ApiResponse<Page<UserResponseDto>> response = ApiResponse.<Page<UserResponseDto>>builder()
                    .success(true)
                    .message("Users retrieved successfully")
                    .data(users)
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to get all users", e);

            ApiResponse<Page<UserResponseDto>> response = ApiResponse.<Page<UserResponseDto>>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get users by status
     */
    @GetMapping("/admin/users/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserResponseDto>>> getUsersByStatus(
            @PathVariable UsersStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            Page<UserResponseDto> users = userService.getAllUsersByStatus(status, page, size);

            ApiResponse<Page<UserResponseDto>> response = ApiResponse.<Page<UserResponseDto>>builder()
                    .success(true)
                    .message("Users retrieved successfully")
                    .data(users)
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to get users by status: {}", status, e);

            ApiResponse<Page<UserResponseDto>> response = ApiResponse.<Page<UserResponseDto>>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Search users
     */
    @GetMapping("/admin/users/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserResponseDto>>> searchUsers(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            Page<UserResponseDto> users = userService.searchUsers(query, page, size);

            ApiResponse<Page<UserResponseDto>> response = ApiResponse.<Page<UserResponseDto>>builder()
                    .success(true)
                    .message("Search completed successfully")
                    .data(users)
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to search users with query: {}", query, e);

            ApiResponse<Page<UserResponseDto>> response = ApiResponse.<Page<UserResponseDto>>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Activate user
     */
    @PostMapping("/admin/users/{userId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> activateUser(@PathVariable Long userId) {

        try {
            userService.activateUser(userId);

            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(true)
                    .message("User activated successfully")
                    .data("User account activated")
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to activate user: {}", userId, e);

            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Suspend user
     */
    @PostMapping("/admin/users/{userId}/suspend")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> suspendUser(@PathVariable Long userId) {

        try {
            userService.suspendUser(userId);

            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(true)
                    .message("User suspended successfully")
                    .data("User account suspended")
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to suspend user: {}", userId, e);

            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Delete user (soft delete)
     */
    @DeleteMapping("/admin/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long userId) {

        try {
            userService.deleteUser(userId);

            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(true)
                    .message("User deleted successfully")
                    .data("User account deleted")
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to delete user: {}", userId, e);

            ApiResponse<String> response = ApiResponse.<String>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    // ==================== STATISTICS ENDPOINTS ====================

    /**
     * Get user statistics
     */
    @GetMapping("/admin/users/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUserStatistics() {

        try {
            Map<String, Long> stats = new HashMap<>();
            stats.put("totalActive", userService.getTotalActiveUsers());
            stats.put("totalPending", userService.getTotalPendingUsers());
            stats.put("totalSuspended", userService.getTotalSuspendedUsers());

            ApiResponse<Map<String, Long>> response = ApiResponse.<Map<String, Long>>builder()
                    .success(true)
                    .message("Statistics retrieved successfully")
                    .data(stats)
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to get user statistics", e);

            ApiResponse<Map<String, Long>> response = ApiResponse.<Map<String, Long>>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get fully verified users
     */
    @GetMapping("/admin/users/verified")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserResponseDto>>> getFullyVerifiedUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            Page<UserResponseDto> users = userService.getFullyVerifiedUsers(page, size);

            ApiResponse<Page<UserResponseDto>> response = ApiResponse.<Page<UserResponseDto>>builder()
                    .success(true)
                    .message("Verified users retrieved successfully")
                    .data(users)
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to get verified users", e);

            ApiResponse<Page<UserResponseDto>> response = ApiResponse.<Page<UserResponseDto>>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }
}
