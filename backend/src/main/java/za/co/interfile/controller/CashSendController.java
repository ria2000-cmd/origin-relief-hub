package za.co.interfile.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import za.co.interfile.dtos.ApiResponse;
import za.co.interfile.dtos.CashSendRequestDto;
import za.co.interfile.dtos.CashSendResponseDto;
import za.co.interfile.exception.CashSendException;
import za.co.interfile.exception.InsufficientBalanceException;
import za.co.interfile.service.CashSendService;
import za.co.interfile.service.UsersService;

import java.math.BigDecimal;

@Slf4j
@RestController
@RequestMapping("/api/relief-hub")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CashSendController {

    private final CashSendService cashSendService;
    private final UsersService userService;

    @PostMapping("/cash-send/send")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<CashSendResponseDto>> sendCash(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody CashSendRequestDto request) {

        try {
            String jwtToken = token.substring(7);
            Long userId = userService.getUserIdFromToken(jwtToken);

            CashSendResponseDto response = cashSendService.sendCash(userId, request);

            ApiResponse<CashSendResponseDto> apiResponse = ApiResponse.<CashSendResponseDto>builder()
                    .success(true)
                    .message("Cash send successful")
                    .data(response)
                    .build();

            return ResponseEntity.ok(apiResponse);

        } catch (InsufficientBalanceException e) {
            log.error("Insufficient balance: {}", e.getMessage());

            ApiResponse<CashSendResponseDto> response = ApiResponse.<CashSendResponseDto>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);

        } catch (CashSendException e) {
            log.error("Cash send error: {}", e.getMessage());

            ApiResponse<CashSendResponseDto> response = ApiResponse.<CashSendResponseDto>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            log.error("Unexpected error processing cash send", e);

            ApiResponse<CashSendResponseDto> response = ApiResponse.<CashSendResponseDto>builder()
                    .success(false)
                    .message("An unexpected error occurred. Please try again later.")
                    .build();

            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("cash-send/calculate-cost")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<BigDecimal>> calculateCost(@RequestParam BigDecimal amount) {
        try {
            BigDecimal totalCost = cashSendService.calculateCashSendCost(amount);

            ApiResponse<BigDecimal> response = ApiResponse.<BigDecimal>builder()
                    .success(true)
                    .message("Cost calculated")
                    .data(totalCost)
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error calculating cost", e);

            ApiResponse<BigDecimal> response = ApiResponse.<BigDecimal>builder()
                    .success(false)
                    .message("Failed to calculate cost")
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }
}