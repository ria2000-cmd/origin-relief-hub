
package za.co.interfile.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import za.co.interfile.dtos.PaymentHistoryDTO;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentExportService {

    private final PaymentHistoryService paymentHistoryService;

    public InputStreamResource exportToCSV(String idNumber) {
        List<PaymentHistoryDTO> transactions = paymentHistoryService.getAllTransactionsForExport(idNumber);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out);

        // CSV Headers
        writer.println("Date,Transaction Type,Amount,Status,Reference Number,Description");

        // CSV Data
        for (PaymentHistoryDTO transaction : transactions) {
            writer.printf("%s,%s,%s,%s,%s,\"%s\"%n",
                    transaction.getFormattedDate(),
                    transaction.getTypeDisplayName(),
                    transaction.getFormattedAmount(),
                    transaction.getStatusDisplayName(),
                    transaction.getReferenceNumber(),
                    transaction.getDescription() != null ? transaction.getDescription().replace("\"", "\"\"") : ""
            );
        }

        // Add summary
        writer.println();
        writer.println("Summary");
        writer.printf("Total Transactions,%d%n", transactions.size());
        writer.printf("Export Date,%s%n", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm")));

        writer.flush();
        writer.close();

        return new InputStreamResource(new ByteArrayInputStream(out.toByteArray()));
    }

    public InputStreamResource exportToPDF(String idNumber) {
        // For demo purposes, return CSV as text (you can implement actual PDF generation)
        // In real implementation, you'd use libraries like iText or Apache PDFBox

        List<PaymentHistoryDTO> transactions = paymentHistoryService.getAllTransactionsForExport(idNumber);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out);

        writer.println("PAYMENT HISTORY REPORT");
        writer.println("ID Number: " + idNumber);
        writer.println("Generated: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm")));
        writer.println("=====================================");
        writer.println();

        for (PaymentHistoryDTO transaction : transactions) {
            writer.printf("Date: %s%n", transaction.getFormattedDate());
            writer.printf("Type: %s%n", transaction.getTypeDisplayName());
            writer.printf("Amount: %s%n", transaction.getFormattedAmount());
            writer.printf("Status: %s%n", transaction.getStatusDisplayName());
            writer.printf("Reference: %s%n", transaction.getReferenceNumber());
            writer.printf("Description: %s%n", transaction.getDescription() != null ? transaction.getDescription() : "");
            writer.println("-------------------------------------");
        }

        writer.printf("Total Transactions: %d%n", transactions.size());

        writer.flush();
        writer.close();

        return new InputStreamResource(new ByteArrayInputStream(out.toByteArray()));
    }
}