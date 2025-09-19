package za.co.interfile.service;

import za.co.interfile.dtos.*;
import za.co.interfile.model.Users;
import za.co.interfile.enums.UsersStatus;
import za.co.interfile.repository.UsersRepository;
import za.co.interfile.security.JwtTokenProvider;
import za.co.interfile.exception.ResourceNotFoundException;
import za.co.interfile.exception.UserAlreadyExistsException;
import za.co.interfile.exception.InvalidCredentialsException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsersService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public UserResponseDto registerUser(UserRegistrationDto registrationDto) {
        log.info("Registering new user with email: {}", registrationDto.getEmail());

        // Check if user already exists
        if (usersRepository.findByEmail(registrationDto.getEmail().toLowerCase()).isPresent()) {
            throw new UserAlreadyExistsException("User with this email already exists");
        }

        if (usersRepository.findByUsername(registrationDto.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("Username is already taken");
        }

        if (usersRepository.findByIdNumber(registrationDto.getIdNumber()).isPresent()) {
            throw new UserAlreadyExistsException("User with this ID number already exists");
        }

        // Create new user using builder pattern
        Users user = Users.builder()
                .fullName(registrationDto.getFullName())
                .idNumber(registrationDto.getIdNumber())
                .email(registrationDto.getEmail().toLowerCase())
                .username(registrationDto.getUsername())
                .phone(registrationDto.getPhone())
                .passwordHash(passwordEncoder.encode(registrationDto.getPassword()))
                .address(registrationDto.getAddress())
                .dateOfBirth(registrationDto.getDateOfBirth())
                .status(UsersStatus.PENDING)
                .emailVerified(false)
                .phoneVerified(false)
                .build();

        Users savedUser = usersRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getUserId());

        return convertToResponseDto(savedUser);
    }

    @Transactional
    public LoginResponseDto loginUser(UserLoginDto loginDto) {
        log.info("Login attempt for email: {}", loginDto.getEmail());

        Users user = usersRepository.findByEmailAndStatus(loginDto.getEmail().toLowerCase(), UsersStatus.ACTIVE)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // Update last login time
        user.updateLastLogin();
        usersRepository.save(user);

        // Generate JWT token
        String token = jwtTokenProvider.createToken(user.getUserId(), user.getEmail(), user.getUsername());
        long expirationTime = jwtTokenProvider.getExpirationTime();

        LoginResponseDto response = new LoginResponseDto();
        response.setUser(convertToResponseDto(user));
        response.setToken(token);
        response.setExpiresIn(expirationTime);

        log.info("User logged in successfully: {}", user.getUserId());
        return response;
    }

    public UserResponseDto getUserById(Long userId) {
        Users user = usersRepository.findByUserIdAndStatus(userId, UsersStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return convertToResponseDto(user);
    }

    public UserResponseDto getUserByEmail(String email) {
        Users user = usersRepository.findByEmailAndStatus(email.toLowerCase(), UsersStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return convertToResponseDto(user);
    }

    public UserResponseDto getUserByUsername(String username) {
        Users user = usersRepository.findByUsername(username)
                .filter(u -> u.getStatus() == UsersStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return convertToResponseDto(user);
    }

    public Long getUserIdFromToken(String token) {
        return jwtTokenProvider.getUserIdFromToken(token);
    }

    @Transactional
    public UserResponseDto updateUser(Long userId, UserUpdateDto updateDto) {
        Users user = usersRepository.findByUserIdAndStatus(userId, UsersStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (updateDto.getFullName() != null) {
            user.setFullName(updateDto.getFullName());
        }

        if (updateDto.getPhone() != null) {
            user.setPhone(updateDto.getPhone());
        }

        if (updateDto.getAddress() != null) {
            user.setAddress(updateDto.getAddress());
        }

        if (updateDto.getDateOfBirth() != null) {
            user.setDateOfBirth(updateDto.getDateOfBirth());
        }

        Users updatedUser = usersRepository.save(user);
        log.info("User updated successfully: {}", userId);

        return convertToResponseDto(updatedUser);
    }

    @Transactional
    public void updatePassword(Long userId, PasswordUpdateDto passwordDto) {
        Users user = usersRepository.findByUserIdAndStatus(userId, UsersStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(passwordDto.getCurrentPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(passwordDto.getNewPassword()));
        usersRepository.save(user);

        log.info("Password updated successfully for user: {}", userId);
    }

    @Transactional
    public void activateUser(Long userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.activate();
        usersRepository.save(user);

        log.info("User activated: {}", userId);
    }

    @Transactional
    public void suspendUser(Long userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.suspend();
        usersRepository.save(user);

        log.info("User suspended: {}", userId);
    }

    @Transactional
    public void deleteUser(Long userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setStatus(UsersStatus.DELETED);
        user.setUpdatedAt(LocalDateTime.now());
        usersRepository.save(user);

        log.info("User deleted (soft): {}", userId);
    }

    @Transactional
    public void verifyEmail(Long userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.verifyEmail();
        usersRepository.save(user);

        log.info("Email verified for user: {}", userId);
    }

    @Transactional
    public void verifyPhone(Long userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.verifyPhone();
        usersRepository.save(user);

        log.info("Phone verified for user: {}", userId);
    }

    public Page<UserResponseDto> getAllUsers(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Users> users = usersRepository.findByStatus(UsersStatus.ACTIVE, pageable);

        return users.map(this::convertToResponseDto);
    }

    public Page<UserResponseDto> getAllUsersByStatus(UsersStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Users> users = usersRepository.findByStatus(status, pageable);

        return users.map(this::convertToResponseDto);
    }

    public Page<UserResponseDto> searchUsers(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Users> users = usersRepository.searchActiveUsers(searchTerm, pageable);

        return users.map(this::convertToResponseDto);
    }

    public Page<UserResponseDto> getFullyVerifiedUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Users> users = usersRepository.findFullyVerifiedUsers(pageable);

        return users.map(this::convertToResponseDto);
    }

    public boolean validateToken(String token) {
        try {
            Long userId = jwtTokenProvider.getUserIdFromToken(token);
            Optional<Users> user = usersRepository.findByUserIdAndStatus(userId, UsersStatus.ACTIVE);
            return user.isPresent();
        } catch (Exception e) {
            return false;
        }
    }

    // Statistics methods
    public long getTotalActiveUsers() {
        return usersRepository.countByStatus(UsersStatus.ACTIVE);
    }

    public long getTotalPendingUsers() {
        return usersRepository.countByStatus(UsersStatus.PENDING);
    }

    public long getTotalSuspendedUsers() {
        return usersRepository.countByStatus(UsersStatus.SUSPENDED);
    }

    private UserResponseDto convertToResponseDto(Users user) {
        return UserResponseDto.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .idNumber(user.getIdNumber())
                .email(user.getEmail())
                .username(user.getUsername())
                .phone(user.getPhone())
                .address(user.getAddress())
                .dateOfBirth(user.getDateOfBirth())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastLogin(user.getLastLogin())
                .emailVerified(user.getEmailVerified())
                .phoneVerified(user.getPhoneVerified())
                .displayName(user.getDisplayName())
                .maskedIdNumber(user.getMaskedIdNumber())
                .age(user.getAgeFromIdNumber())
                .isActive(user.isActive())
                .isFullyVerified(user.isFullyVerified())
                .canWithdraw(user.canWithdraw())
                .unreadNotificationCount(user.getUnreadNotificationCount())
                .build();
    }
}