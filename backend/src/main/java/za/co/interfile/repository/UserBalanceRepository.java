package za.co.interfile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.co.interfile.model.UserBalance;
import za.co.interfile.model.Users;

import java.util.Optional;

public interface UserBalanceRepository extends JpaRepository<UserBalance, Long> {

    Optional<UserBalance> findByUser(Users user);
    Optional<UserBalance> findByUser_UserId(Long userId);
}
