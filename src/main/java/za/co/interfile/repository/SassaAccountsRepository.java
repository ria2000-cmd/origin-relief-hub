package za.co.interfile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.co.interfile.enums.SassaStatus;
import za.co.interfile.model.SassaAccounts;
import za.co.interfile.model.Users;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SassaAccountsRepository extends JpaRepository<SassaAccounts, Long> {

    List<SassaAccounts> findByNextPaymentDateLessThanEqualAndStatus(
            LocalDate date, SassaStatus status);

    List<SassaAccounts> findByNextPaymentDateBetweenAndStatus(
            LocalDate startDate, LocalDate endDate, SassaStatus status);

    List<SassaAccounts> findByStatus(SassaStatus status);

    Optional<SassaAccounts> findByUserAndStatus(Users user, SassaStatus status);
}
