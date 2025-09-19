// PaymentHistoryService.java
package za.co.interfile.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.co.interfile.dtos.PaymentHistoryDTO;
import za.co.interfile.dtos.PaymentHistoryFilterDTO;
import za.co.interfile.dtos.PaymentHistoryResponseDTO;
import za.co.interfile.enums.TransactionStatus;
import za.co.interfile.enums.TransactionType;
import za.co.interfile.model.Transaction;
import za.co.interfile.model.Users;
import za.co.interfile.repository.TransactionRepository;
import za.co.interfile.repository.UsersRepository;

import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PaymentHistoryService {

    private final TransactionRepository transactionRepository;
    private final UsersRepository usersRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm");

    public PaymentHistoryResponseDTO getPaymentHistory(PaymentHistoryFilterDTO filter) {
        try {
            log.info("Retrieving payment history for ID: {}", filter.getIdNumber());

            // Find user
            Users user = usersRepository.findByIdNumber(filter.getIdNumber()).orElse(null);
            if (user == null) {
                return PaymentHistoryResponseDTO.builder()
                        .success(false)
                        .message("User not found with the provided ID number")
                        .transactions(new ArrayList<>())
                        .build();
            }

            // Create pageable
            Sort sort = Sort.by(
                    Sort.Direction.fromString(filter.getSortDirection()),
                    filter.getSortBy()
            );
            Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);

            // Build specification for filtering
            Specification<Transaction> spec = buildSpecification(user.getUserId(), filter);

            // Get transactions
            Page<Transaction> transactionPage = transactionRepository.findAll(spec, pageable);

            // Convert to DTOs
            List<PaymentHistoryDTO> transactionDTOs = transactionPage.getContent()
                    .stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            // Calculate totals
            BigDecimal totalWithdrawn = calculateTotalByType(user.getUserId(), TransactionType.WITHDRAWAL);
            BigDecimal totalReceived = calculateTotalByType(user.getUserId(), TransactionType.DEPOSIT);

            return PaymentHistoryResponseDTO.builder()
                    .success(true)
                    .message("Payment history retrieved successfully")
                    .transactions(transactionDTOs)
                    .totalTransactions((int) transactionPage.getTotalElements())
                    .totalPages(transactionPage.getTotalPages())
                    .currentPage(transactionPage.getNumber())
                    .totalWithdrawn(totalWithdrawn)
                    .totalReceived(totalReceived)
                    .fromDate(filter.getFromDate())
                    .toDate(filter.getToDate())
                    .build();

        } catch (Exception e) {
            log.error("Error retrieving payment history for ID {}: ", filter.getIdNumber(), e);
            return PaymentHistoryResponseDTO.builder()
                    .success(false)
                    .message("Error retrieving payment history: " + e.getMessage())
                    .transactions(new ArrayList<>())
                    .build();
        }
    }

    public List<PaymentHistoryDTO> getAllTransactionsForExport(String idNumber) {
        Users user = usersRepository.findByIdNumber(idNumber).orElse(null);
        if (user == null) {
            return new ArrayList<>();
        }

        List<Transaction> transactions = transactionRepository
                .findByUserUserIdOrderByCreatedAtDesc(user.getUserId());

        return transactions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Build JPA Specification for filtering
    private Specification<Transaction> buildSpecification(Long userId, PaymentHistoryFilterDTO filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always filter by user
            predicates.add(criteriaBuilder.equal(root.get("user").get("userId"), userId));

            // Filter by transaction type
            if (filter.getTransactionType() != null) {
                predicates.add(criteriaBuilder.equal(root.get("transactionType"), filter.getTransactionType()));
            }

            // Filter by status
            if (filter.getStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), filter.getStatus()));
            }

            // Filter by date range
            if (filter.getFromDate() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), filter.getFromDate()));
            }
            if (filter.getToDate() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), filter.getToDate()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private PaymentHistoryDTO convertToDTO(Transaction transaction) {
        return PaymentHistoryDTO.builder()
                .transactionId(transaction.getTransactionId())
                .transactionType(transaction.getTransactionType())
                .amount(transaction.getAmount())
                .status(transaction.getStatus())
                .referenceNumber(transaction.getReferenceNumber())
                .description(transaction.getDescription())
                .createdAt(transaction.getCreatedAt())
                .formattedAmount(formatAmount(transaction.getAmount(), transaction.getTransactionType()))
                .formattedDate(transaction.getCreatedAt().format(DATE_FORMATTER))
                .statusDisplayName(getStatusDisplayName(transaction.getStatus()))
                .typeDisplayName(getTypeDisplayName(transaction.getTransactionType()))
                .statusCssClass(getStatusCssClass(transaction.getStatus()))
                .typeCssClass(getTypeCssClass(transaction.getTransactionType()))
                .build();
    }

    private BigDecimal calculateTotalByType(Long userId, TransactionType type) {
        return transactionRepository.sumAmountByUserAndType(userId, type);
    }

    // Helper methods for formatting and display
    private String formatAmount(BigDecimal amount, TransactionType type) {
        String prefix = type == TransactionType.WITHDRAWAL ? "-R " : "+R ";
        return prefix + String.format("%,.2f", amount);
    }

    private String getStatusDisplayName(TransactionStatus status) {
        return switch (status) {
            case PENDING -> "Pending";
            case COMPLETED -> "Completed";
            case FAILED -> "Failed";
            case CANCELLED -> "Cancelled";
            default -> status.toString();
        };
    }

    private String getTypeDisplayName(TransactionType type) {
        return switch (type) {
            case WITHDRAWAL -> "Withdrawal";
            case DEPOSIT -> "Deposit";
            case TRANSFER -> "Transfer";
            case REFUND -> "Refund";
            default -> type.toString();
        };
    }

    private String getStatusCssClass(TransactionStatus status) {
        return switch (status) {
            case PENDING -> "status-pending";
            case COMPLETED -> "status-completed";
            case FAILED -> "status-failed";
            case CANCELLED -> "status-cancelled";
            default -> "status-unknown";
        };
    }

    private String getTypeCssClass(TransactionType type) {
        return switch (type) {
            case WITHDRAWAL -> "type-withdrawal";
            case DEPOSIT -> "type-deposit";
            case TRANSFER -> "type-transfer";
            case REFUND -> "type-refund";
            default -> "type-unknown";
        };
    }
}