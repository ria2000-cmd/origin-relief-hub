package za.co.interfile.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import za.co.interfile.dtos.ApiResponse;
import za.co.interfile.dtos.WithdrawalRequestDTO;
import za.co.interfile.dtos.WithdrawalResponseDTO;
import za.co.interfile.exception.InsufficientBalanceException;
import za.co.interfile.exception.WithdrawalException;
import za.co.interfile.service.UsersService;
import za.co.interfile.service.WithdrawalService;

import java.math.BigDecimal;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/withdrawals")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WithdrawalController {

    private final WithdrawalService withdrawalService;
    private final UsersService userService;

    @PostMapping("/withdraw")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<WithdrawalResponseDTO>> processWithdrawal(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody WithdrawalRequestDTO request) {

        try {
            String jwtToken = token.substring(7);
            Long userId = userService.getUserIdFromToken(jwtToken);

            WithdrawalResponseDTO response = withdrawalService.processWithdrawal(userId, request);

            ApiResponse<WithdrawalResponseDTO> apiResponse = ApiResponse.<WithdrawalResponseDTO>builder()
                    .success(true)
                    .message("Withdrawal processed successfully")
                    .data(response)
                    .build();

            return ResponseEntity.ok(apiResponse);

        } catch (InsufficientBalanceException e) {
            log.error("Insufficient balance: {}", e.getMessage());

            ApiResponse<WithdrawalResponseDTO> response = ApiResponse.<WithdrawalResponseDTO>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);

        } catch (WithdrawalException e) {
            log.error("Withdrawal error: {}", e.getMessage());

            ApiResponse<WithdrawalResponseDTO> response = ApiResponse.<WithdrawalResponseDTO>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            log.error("Unexpected error processing withdrawal", e);

            ApiResponse<WithdrawalResponseDTO> response = ApiResponse.<WithdrawalResponseDTO>builder()
                    .success(false)
                    .message("An unexpected error occurred. Please try again later.")
                    .build();

            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/balance")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<BigDecimal>> getBalance(
            @RequestHeader("Authorization") String token) {

        try {
            String jwtToken = token.substring(7);
            Long userId = userService.getUserIdFromToken(jwtToken);

            BigDecimal balance = withdrawalService.getUserBalance(userId);

            ApiResponse<BigDecimal> response = ApiResponse.<BigDecimal>builder()
                    .success(true)
                    .message("Balance retrieved successfully")
                    .data(balance)
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error fetching balance", e);

            ApiResponse<BigDecimal> response = ApiResponse.<BigDecimal>builder()
                    .success(false)
                    .message("Failed to fetch balance")
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/calculate-fees")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> calculateFees(
            @RequestParam BigDecimal amount) {

        try {
            Map<String, Object> breakdown = withdrawalService.calculateWithdrawalBreakdown(amount);

            ApiResponse<Map<String, Object>> response = ApiResponse.<Map<String, Object>>builder()
                    .success(true)
                    .message("Withdrawal breakdown calculated")
                    .data(breakdown)
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error calculating fees", e);

            ApiResponse<Map<String, Object>> response = ApiResponse.<Map<String, Object>>builder()
                    .success(false)
                    .message("Failed to calculate fees")
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }
}