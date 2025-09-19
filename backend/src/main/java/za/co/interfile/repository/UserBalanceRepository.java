package za.co.interfile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.co.interfile.model.UserBalance;

public interface UserBalanceRepository extends JpaRepository<UserBalance, Long> {
}
