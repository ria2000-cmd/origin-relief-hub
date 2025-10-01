package za.co.interfile.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import za.co.interfile.dtos.ElectricityPurchaseRequestDto;
import za.co.interfile.dtos.ElectricityPurchaseResponseDto;
import za.co.interfile.exception.InsufficientBalanceException;
import za.co.interfile.model.Users;
import za.co.interfile.service.ElectricityService;

import java.time.LocalDateTime;
import java.util.List;


@Slf4j
@RestController
@RequestMapping("/api/relief-hub")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ElectricityController {

    private final ElectricityService electricityService;

    @PostMapping("/electricity/purchase")
    public ResponseEntity<ElectricityPurchaseResponseDto> purchaseElectricity(
            @Valid @RequestBody ElectricityPurchaseRequestDto request,
            @AuthenticationPrincipal Users user) {
        try {
            ElectricityPurchaseResponseDto response = electricityService.purchaseElectricity(request, user);
            return ResponseEntity.ok(response);

        } catch (InsufficientBalanceException | IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ElectricityPurchaseResponseDto.builder()
                            .success(false)
                            .message(e.getMessage())
                            .timestamp(LocalDateTime.now())
                            .build());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ElectricityPurchaseResponseDto.builder()
                            .success(false)
                            .message("Electricity purchase failed: " + e.getMessage())
                            .timestamp(LocalDateTime.now())
                            .build());
        }
    }

    @GetMapping("/electricity/history")
    public ResponseEntity<?> getElectricityHistory(
            @AuthenticationPrincipal Users user) {
        try {
            List<ElectricityPurchaseResponseDto> history = electricityService.getElectricityHistory(user);
            return ResponseEntity.ok(history);

        } catch (Exception e) {
            log.error("Failed to retrieve electricity history for user: {}", user.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ElectricityPurchaseResponseDto.builder()
                            .success(false)
                            .message("Failed to retrieve history: " + e.getMessage())
                            .timestamp(LocalDateTime.now())
                            .build());
        }
    }
}