package za.co.interfile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import za.co.interfile.enums.TransactionStatus;
import za.co.interfile.enums.TransactionType;
import za.co.interfile.model.Transaction;
import za.co.interfile.model.Users;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserOrderByCreatedAtDesc(Users user);

    List<Transaction> findByUserAndStatusOrderByCreatedAtDesc(Users user, TransactionStatus status);

    List<Transaction> findByUserAndTransactionTypeOrderByCreatedAtDesc(Users user, TransactionType type);

    @Query("SELECT t FROM Transaction t WHERE t.user = :user AND t.createdAt >= :startDate ORDER BY t.createdAt DESC")
    List<Transaction> findRecentTransactions(@Param("user") Users user, @Param("startDate") LocalDateTime startDate);
}
