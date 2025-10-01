package za.co.interfile.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import za.co.interfile.dtos.ApiResponse;
import za.co.interfile.dtos.ElectricityPurchaseRequestDto;
import za.co.interfile.dtos.ElectricityPurchaseResponseDto;
import za.co.interfile.exception.ElectricityPurchaseException;
import za.co.interfile.exception.InsufficientBalanceException;
import za.co.interfile.model.ElectricityTransaction;
import za.co.interfile.service.ElectricityService;
import za.co.interfile.service.UsersService;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/relief-hub")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ElectricityController {

    private final ElectricityService electricityService;
    private final UsersService userService;

    @PostMapping("/electricity/purchase")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<ElectricityPurchaseResponseDto>> purchaseElectricity(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody ElectricityPurchaseRequestDto request) {

        try {
            String jwtToken = token.substring(7);
            Long userId = userService.getUserIdFromToken(jwtToken);

            ElectricityPurchaseResponseDto response = electricityService.purchaseElectricity(userId, request);

            ApiResponse<ElectricityPurchaseResponseDto> apiResponse = ApiResponse.<ElectricityPurchaseResponseDto>builder()
                    .success(true)
                    .message("Electricity purchased successfully")
                    .data(response)
                    .build();

            return ResponseEntity.ok(apiResponse);

        } catch (InsufficientBalanceException e) {
            log.error("Insufficient balance: {}", e.getMessage());

            ApiResponse<ElectricityPurchaseResponseDto> response = ApiResponse.<ElectricityPurchaseResponseDto>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);

        } catch (ElectricityPurchaseException e) {
            log.error("Electricity purchase error: {}", e.getMessage());

            ApiResponse<ElectricityPurchaseResponseDto> response = ApiResponse.<ElectricityPurchaseResponseDto>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            log.error("Unexpected error processing electricity purchase", e);

            ApiResponse<ElectricityPurchaseResponseDto> response = ApiResponse.<ElectricityPurchaseResponseDto>builder()
                    .success(false)
                    .message("An unexpected error occurred. Please try again later.")
                    .build();

            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/electricity/history")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<ElectricityTransaction>>> getPurchaseHistory(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "10") int limit) {

        try {
            String jwtToken = token.substring(7);
            Long userId = userService.getUserIdFromToken(jwtToken);

            List<ElectricityTransaction> history = electricityService.getUserElectricityHistory(userId, limit);

            ApiResponse<List<ElectricityTransaction>> response = ApiResponse.<List<ElectricityTransaction>>builder()
                    .success(true)
                    .message("Purchase history retrieved")
                    .data(history)
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error fetching electricity history", e);

            ApiResponse<List<ElectricityTransaction>> response = ApiResponse.<List<ElectricityTransaction>>builder()
                    .success(false)
                    .message("Failed to fetch purchase history")
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/electricity/calculate-units")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<BigDecimal>> calculateUnits(@RequestParam BigDecimal amount) {
        try {
            BigDecimal units = electricityService.calculateUnits(amount);

            ApiResponse<BigDecimal> response = ApiResponse.<BigDecimal>builder()
                    .success(true)
                    .message("Units calculated")
                    .data(units)
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error calculating units", e);

            ApiResponse<BigDecimal> response = ApiResponse.<BigDecimal>builder()
                    .success(false)
                    .message("Failed to calculate units")
                    .build();

            return ResponseEntity.badRequest().body(response);
        }
    }
}