package za.co.interfile.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import za.co.interfile.dtos.ApiResponse;
import za.co.interfile.dtos.LinkSassaAccountRequest;
import za.co.interfile.dtos.LinkSassaAccountResponse;
import za.co.interfile.exception.SassaAccountException;
import za.co.interfile.model.SassaAccounts;
import za.co.interfile.model.UserBalance;
import za.co.interfile.model.Users;
import za.co.interfile.repository.UserBalanceRepository;
import za.co.interfile.service.SassaAccountService;

import java.math.BigDecimal;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/relief-hub")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SassaAccountController {

    private final SassaAccountService sassaAccountService;
    private final UserBalanceRepository userBalanceRepository;

    @PostMapping("/sassa-accounts/link")
    public ResponseEntity<?> linkSassaAccount(
            @AuthenticationPrincipal Users currentUser,
            @Valid @RequestBody LinkSassaAccountRequest request) {

        try {
            LinkSassaAccountResponse response = sassaAccountService
                    .linkSassaAccount(currentUser.getUserId(), request);

            return ResponseEntity.ok(response);

        } catch (SassaAccountException e) {
            log.error("Failed to link SASSA account: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(LinkSassaAccountResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build());
        } catch (Exception e) {
            log.error("Unexpected error linking SASSA account", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(LinkSassaAccountResponse.builder()
                            .success(false)
                            .message("An unexpected error occurred. Please try again later.")
                            .build());
        }
    }

    @GetMapping("/user/balance")
    public ResponseEntity<?> getBalance(@AuthenticationPrincipal Users user) {
        try {
            UserBalance balance = userBalanceRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Balance not found"));

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "balance", balance.getAvailableBalance(),
                    "pendingBalance", balance.getPendingBalance(),
                    "totalReceived", balance.getTotalReceived(),
                    "totalWithdrawn", balance.getTotalWithdrawn()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
}

    @GetMapping("/sassa-accounts/active")
    public ResponseEntity<?> getActiveSassaAccount(@AuthenticationPrincipal Users currentUser) {
        try {
            SassaAccounts account = sassaAccountService
                    .getUserActiveSassaAccount(currentUser.getUserId());

            if (account == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No active SASSA account found");
            }

            return ResponseEntity.ok(account);

        } catch (Exception e) {
            log.error("Error fetching active SASSA account", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch SASSA account");
        }
    }

    @DeleteMapping("/sassa-accounts/{accountId}/unlink")
    public ResponseEntity<?> unlinkSassaAccount(
            @AuthenticationPrincipal Users currentUser,
            @PathVariable Long accountId) {

        try {
            sassaAccountService.unlinkSassaAccount(currentUser.getUserId(), accountId);
            return ResponseEntity.ok("SASSA account successfully unlinked");

        } catch (SassaAccountException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error unlinking SASSA account", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred");
        }
    }

    @GetMapping("/sassa-accounts/{sassaAccountId}/balance")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getBalanceBySassaId(
            @AuthenticationPrincipal Users currentUser,
            @PathVariable Long sassaAccountId) {

        try {
            BigDecimal balance = sassaAccountService.getBalanceBySassaId(sassaAccountId, currentUser.getUserId());

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("Balance retrieved successfully")
                    .data(balance)
                    .build());

        } catch (SassaAccountException e) {
            log.error("Error fetching SASSA balance: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build());

        } catch (Exception e) {
            log.error("Unexpected error fetching SASSA balance", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.builder()
                            .success(false)
                            .message("Failed to fetch balance")
                            .build());
        }
    }
}