package za.co.interfile.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import za.co.interfile.dtos.CashSendRequestDto;
import za.co.interfile.dtos.CashSendResponseDto;
import za.co.interfile.exception.InsufficientBalanceException;
import za.co.interfile.model.Users;
import za.co.interfile.service.CashSendService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/relief-hub")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CashSendController {

    private final CashSendService cashSendService;

    @PostMapping("cash-send/send")
    public ResponseEntity<CashSendResponseDto> sendCash(
            @Valid @RequestBody CashSendRequestDto request,
            @AuthenticationPrincipal Users user) {
        try {
            CashSendResponseDto response = cashSendService.processCashSend(request, user);
            return ResponseEntity.ok(response);

        } catch (InsufficientBalanceException | IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(CashSendResponseDto.builder()
                            .success(false)
                            .message(e.getMessage())
                            .timestamp(LocalDateTime.now())
                            .build());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CashSendResponseDto.builder()
                            .success(false)
                            .message("Cash send failed: " + e.getMessage())
                            .timestamp(LocalDateTime.now())
                            .build());
        }
    }

    @GetMapping("cash-send/history")
    public ResponseEntity<?> getCashSendHistory(
            @AuthenticationPrincipal Users user) {
        try {
            List<CashSendResponseDto> history = cashSendService.getCashSendHistory(user);
            return ResponseEntity.ok(history);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CashSendResponseDto.builder()
                            .success(false)
                            .message("Failed to retrieve history: " + e.getMessage())
                            .timestamp(LocalDateTime.now())
                            .build());

        }

    }
}