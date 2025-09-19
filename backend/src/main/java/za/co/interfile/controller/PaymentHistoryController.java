package za.co.interfile.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.co.interfile.dtos.PaymentHistoryFilterDTO;
import za.co.interfile.dtos.PaymentHistoryResponseDTO;
import za.co.interfile.enums.TransactionStatus;
import za.co.interfile.enums.TransactionType;
import za.co.interfile.service.PaymentHistoryService;
import za.co.interfile.service.PaymentExportService;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/payment-history")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class PaymentHistoryController {

    private final PaymentHistoryService paymentHistoryService;
    private final PaymentExportService paymentExportService;

    @GetMapping("/{idNumber}")
    public ResponseEntity<PaymentHistoryResponseDTO> getPaymentHistory(
            @PathVariable String idNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String transactionType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        PaymentHistoryFilterDTO filter = new PaymentHistoryFilterDTO();
        filter.setIdNumber(idNumber);
        filter.setPage(page);
        filter.setSize(size);
        filter.setSortBy(sortBy);
        filter.setSortDirection(sortDirection);

        // Parse optional filters
        if (transactionType != null && !transactionType.isEmpty()) {
            try {
                filter.setTransactionType(TransactionType.valueOf(transactionType.toUpperCase()));
            } catch (IllegalArgumentException e) {
                log.warn("Invalid transaction type: {}", transactionType);
            }
        }

        if (status != null && !status.isEmpty()) {
            try {
                filter.setStatus(TransactionStatus.valueOf(status.toUpperCase()));
            } catch (IllegalArgumentException e) {
                log.warn("Invalid status: {}", status);
            }
        }

        // Parse dates (expecting ISO format: 2025-01-01T00:00:00)
        if (fromDate != null && !fromDate.isEmpty()) {
            try {
                filter.setFromDate(LocalDateTime.parse(fromDate));
            } catch (Exception e) {
                log.warn("Invalid fromDate format: {}", fromDate);
            }
        }

        if (toDate != null && !toDate.isEmpty()) {
            try {
                filter.setToDate(LocalDateTime.parse(toDate));
            } catch (Exception e) {
                log.warn("Invalid toDate format: {}", toDate);
            }
        }

        PaymentHistoryResponseDTO response = paymentHistoryService.getPaymentHistory(filter);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/search")
    public ResponseEntity<PaymentHistoryResponseDTO> searchPaymentHistory(
            @Valid @RequestBody PaymentHistoryFilterDTO filter) {

        PaymentHistoryResponseDTO response = paymentHistoryService.getPaymentHistory(filter);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{idNumber}/download/csv")
    public ResponseEntity<Resource> downloadPaymentHistoryCSV(@PathVariable String idNumber) {
        try {
            InputStreamResource resource = paymentExportService.exportToCSV(idNumber);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=payment_history_" + idNumber + ".csv")
                    .contentType(MediaType.parseMediaType("text/csv"))
                    .body(resource);

        } catch (Exception e) {
            log.error("Error generating CSV export: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{idNumber}/download/pdf")
    public ResponseEntity<Resource> downloadPaymentHistoryPDF(@PathVariable String idNumber) {
        try {
            InputStreamResource resource = paymentExportService.exportToPDF(idNumber);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=payment_history_" + idNumber + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);

        } catch (Exception e) {
            log.error("Error generating PDF export: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}