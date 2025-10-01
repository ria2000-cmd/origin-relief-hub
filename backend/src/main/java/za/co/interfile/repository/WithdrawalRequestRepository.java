package za.co.interfile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.co.interfile.model.Users;
import za.co.interfile.model.WithdrawalRequest;

import java.util.List;

public interface WithdrawalRequestRepository extends JpaRepository<WithdrawalRequest, Long> {

    List<WithdrawalRequest> findByUserOrderByRequestedAtDesc(Users user);
}
