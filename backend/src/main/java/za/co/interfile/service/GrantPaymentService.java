package za.co.interfile.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.co.interfile.enums.GrantType;
import za.co.interfile.enums.SassaStatus;
import za.co.interfile.model.SassaAccounts;
import za.co.interfile.repository.SassaAccountsRepository;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GrantPaymentService {

    private final SassaAccountsRepository sassaAccountRepository;

    public LocalDate calculateNextPaymentDate(SassaAccounts sassaAccount) {
        LocalDate today = LocalDate.now();
        GrantType grantType = sassaAccount.getGrantType();

        LocalDate nextPaymentDate = calculateNextPaymentDateByGrantType(grantType, today);

        if (nextPaymentDate.isBefore(today)) {
            nextPaymentDate = nextPaymentDate.plusMonths(1);
        }

        log.debug("Calculated next payment date for grant type {}: {}", grantType, nextPaymentDate);
        return nextPaymentDate;
    }

    /**
     * Calculate next payment date based on grant type and reference date
     * @param grantType The type of grant
     * @param referenceDate The date to calculate from
     * @return The next payment date
     */
    public LocalDate calculateNextPaymentDateByGrantType(GrantType grantType, LocalDate referenceDate) {
        return switch (grantType) {
            case SRD -> {
                LocalDate paymentDate = referenceDate.withDayOfMonth(5);
                yield paymentDate.isBefore(referenceDate) ? paymentDate.plusMonths(1) : paymentDate;
            }
            case CHILD_SUPPORT -> {
                LocalDate paymentDate = referenceDate.withDayOfMonth(3);
                yield paymentDate.isBefore(referenceDate) ? paymentDate.plusMonths(1) : paymentDate;
            }
            case DISABILITY, OLD_AGE, CARE_DEPENDENCY -> {
                LocalDate paymentDate = referenceDate.withDayOfMonth(1);
                yield paymentDate.isBefore(referenceDate) ? paymentDate.plusMonths(1) : paymentDate;
            }
            case FOSTER_CARE -> {
                LocalDate paymentDate = referenceDate.withDayOfMonth(10);
                yield paymentDate.isBefore(referenceDate) ? paymentDate.plusMonths(1) : paymentDate;
            }
            case WAR_VETERANS -> {
                LocalDate paymentDate = referenceDate.withDayOfMonth(1);
                yield paymentDate.isBefore(referenceDate) ? paymentDate.plusMonths(1) : paymentDate;
            }
            default -> {
                LocalDate paymentDate = referenceDate.withDayOfMonth(1);
                yield paymentDate.isBefore(referenceDate) ? paymentDate.plusMonths(1) : paymentDate;
            }
        };
    }

    /**
     * Get days until next payment for a specific SASSA account
     * @param sassaAccount The SASSA account
     * @return Number of days until next payment, -1 if no payment date set
     */
    public long getDaysUntilNextPayment(SassaAccounts sassaAccount) {
        LocalDate nextPaymentDate = sassaAccount.getNextPaymentDate();
        if (nextPaymentDate == null) {
            return -1;
        }
        return ChronoUnit.DAYS.between(LocalDate.now(), nextPaymentDate);
    }

    /**
     * Check if payment is due for a specific SASSA account
     * @param sassaAccount The SASSA account to check
     * @return true if payment is due or overdue
     */
    public boolean isPaymentDue(SassaAccounts sassaAccount) {
        LocalDate nextPaymentDate = sassaAccount.getNextPaymentDate();
        return nextPaymentDate != null && !nextPaymentDate.isAfter(LocalDate.now());
    }

    /**
     * Check if payment is overdue for a specific SASSA account
     * @param sassaAccount The SASSA account to check
     * @return true if payment is overdue
     */
    public boolean isPaymentOverdue(SassaAccounts sassaAccount) {
        LocalDate nextPaymentDate = sassaAccount.getNextPaymentDate();
        return nextPaymentDate != null && nextPaymentDate.isBefore(LocalDate.now());
    }

    /**
     * Update next payment date for a SASSA account and save to database
     * @param sassaAccount The SASSA account to update
     * @return The updated SASSA account
     */
    @Transactional
    public SassaAccounts updateNextPaymentDate(SassaAccounts sassaAccount) {
        LocalDate newPaymentDate = calculateNextPaymentDate(sassaAccount);
        sassaAccount.setNextPaymentDate(newPaymentDate);

        SassaAccounts updatedAccount = sassaAccountRepository.save(sassaAccount);
        log.info("Updated next payment date for SASSA account {}: {}",
                updatedAccount.getSassaAccountId(), newPaymentDate);

        return updatedAccount;
    }

    /**
     * Get all SASSA accounts with payments due today
     * @return List of accounts with payments due
     */
    public List<SassaAccounts> getAccountsWithPaymentsDue() {
        LocalDate today = LocalDate.now();
        List<SassaAccounts> accountsWithPaymentsDue = sassaAccountRepository
                .findByNextPaymentDateLessThanEqualAndStatus(today, SassaStatus.ACTIVE);

        log.info("Found {} accounts with payments due on {}", accountsWithPaymentsDue.size(), today);
        return accountsWithPaymentsDue;
    }

    /**
     * Get all SASSA accounts with upcoming payments (within specified days)
     * @param withinDays Number of days to look ahead
     * @return List of accounts with upcoming payments
     */
    public List<SassaAccounts> getAccountsWithUpcomingPayments(int withinDays) {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(withinDays);

        List<SassaAccounts> upcomingPayments = sassaAccountRepository
                .findByNextPaymentDateBetweenAndStatus(today, futureDate, SassaStatus.ACTIVE);

        log.info("Found {} accounts with payments due within {} days", upcomingPayments.size(), withinDays);
        return upcomingPayments;
    }

    /**
     * Get payment schedule summary for a user's account
     * @param sassaAccount The SASSA account
     * @return Payment schedule information
     */
    public PaymentScheduleInfo getPaymentScheduleInfo(SassaAccounts sassaAccount) {
        LocalDate nextPaymentDate = sassaAccount.getNextPaymentDate();
        if (nextPaymentDate == null) {
            nextPaymentDate = calculateNextPaymentDate(sassaAccount);
        }

        long daysUntilPayment = getDaysUntilNextPayment(sassaAccount);
        boolean isDue = isPaymentDue(sassaAccount);
        boolean isOverdue = isPaymentOverdue(sassaAccount);

        return PaymentScheduleInfo.builder()
                .nextPaymentDate(nextPaymentDate)
                .daysUntilPayment(daysUntilPayment)
                .isPaymentDue(isDue)
                .isPaymentOverdue(isOverdue)
                .grantType(sassaAccount.getGrantType())
                .monthlyAmount(sassaAccount.getMonthlyAmount())
                .paymentDay(getPaymentDayForGrantType(sassaAccount.getGrantType()))
                .build();
    }

    /**
     * Get the standard payment day for a grant type
     * @param grantType The grant type
     * @return The day of month when this grant type is typically paid
     */
    public int getPaymentDayForGrantType(GrantType grantType) {
        return switch (grantType) {
            case SRD -> 5;
            case CHILD_SUPPORT -> 3;
            case DISABILITY, OLD_AGE, CARE_DEPENDENCY, WAR_VETERANS -> 1;
            case FOSTER_CARE -> 10;
            default -> 1;
        };
    }

    /**
     * Calculate payment dates for the next N months
     * @param grantType The grant type
     * @param months Number of months to calculate
     * @return List of payment dates
     */
    public List<LocalDate> calculatePaymentSchedule(GrantType grantType, int months) {
        LocalDate startDate = LocalDate.now();
        return java.util.stream.IntStream.range(0, months)
                .mapToObj(i -> calculateNextPaymentDateByGrantType(grantType, startDate.plusMonths(i)))
                .toList();
    }

    /**
     * Batch update payment dates for all active accounts
     * @return Number of accounts updated
     */
    @Transactional
    public int updateAllPaymentDates() {
        List<SassaAccounts> activeAccounts = sassaAccountRepository
                .findByStatus(SassaStatus.ACTIVE);

        int updatedCount = 0;
        for (SassaAccounts account : activeAccounts) {
            try {
                updateNextPaymentDate(account);
                updatedCount++;
            } catch (Exception e) {
                log.error("Failed to update payment date for account {}: {}",
                        account.getSassaAccountId(), e.getMessage());
            }
        }

        log.info("Updated payment dates for {} out of {} active accounts",
                updatedCount, activeAccounts.size());
        return updatedCount;
    }

    /**
     * Inner class for payment schedule information
     */
    @lombok.Data
    @lombok.Builder
    public static class PaymentScheduleInfo {
        private LocalDate nextPaymentDate;
        private long daysUntilPayment;
        private boolean isPaymentDue;
        private boolean isPaymentOverdue;
        private GrantType grantType;
        private java.math.BigDecimal monthlyAmount;
        private int paymentDay;

        public String getFormattedDaysUntilPayment() {
            if (daysUntilPayment < 0) return "No payment date set";
            if (daysUntilPayment == 0) return "Due today";
            if (daysUntilPayment == 1) return "Due tomorrow";
            if (isPaymentOverdue) return Math.abs(daysUntilPayment) + " days overdue";
            return daysUntilPayment + " days";
        }

        public String getStatusMessage() {
            if (isPaymentOverdue) return "Payment overdue";
            if (isPaymentDue) return "Payment due";
            if (daysUntilPayment <= 3) return "Payment due soon";
            return "Payment scheduled";
        }
    }
}