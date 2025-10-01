package za.co.interfile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.co.interfile.model.WithdrawalRequest;

public interface WithdrawalRequestRepository extends JpaRepository<WithdrawalRequest, Long> {
}
