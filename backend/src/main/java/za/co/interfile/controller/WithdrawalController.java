package za.co.interfile.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.co.interfile.dtos.WithdrawalRequestDTO;
import za.co.interfile.dtos.WithdrawalResponseDTO;
import za.co.interfile.dtos.UserBalanceDetailsDTO;
import za.co.interfile.service.WithdrawalService;

@RestController
@RequestMapping("/api/withdrawal")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class WithdrawalController {

    private final WithdrawalService withdrawalService;

    @PostMapping("/process")
    public ResponseEntity<WithdrawalResponseDTO> processWithdrawal(
            @Valid @RequestBody WithdrawalRequestDTO request) {

        log.info("Withdrawal request received for ID: {}", request.getIdNumber());

        WithdrawalResponseDTO response = withdrawalService.processWithdrawal(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/balance/{idNumber}")
    public ResponseEntity<WithdrawalResponseDTO> getUserBalance(@PathVariable String idNumber) {
        WithdrawalResponseDTO response = withdrawalService.getUserBalanceInfo(idNumber);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/balance/details/{idNumber}")
    public ResponseEntity<UserBalanceDetailsDTO> getDetailedBalance(@PathVariable String idNumber) {
        UserBalanceDetailsDTO details = withdrawalService.getDetailedBalance(idNumber);
        return ResponseEntity.ok(details);
    }
}