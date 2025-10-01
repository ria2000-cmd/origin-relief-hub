package za.co.interfile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.co.interfile.model.CashSendTransaction;

import java.util.List;
import java.util.Optional;

@Repository
public interface CashSendRepository extends JpaRepository<CashSendTransaction, Long> {

    Optional<CashSendTransaction> findByVoucherCode(String voucherCode);

    List<CashSendTransaction> findByUserUserIdOrderByCreatedAtDesc(Long userId);
    boolean existsByVoucherCode(String voucherCode);
}