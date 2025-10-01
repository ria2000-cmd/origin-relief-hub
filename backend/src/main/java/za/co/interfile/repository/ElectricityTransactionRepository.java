package za.co.interfile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.co.interfile.model.ElectricityTransaction;

import java.util.List;

@Repository
public interface ElectricityTransactionRepository extends JpaRepository<ElectricityTransaction, Long> {

    List<ElectricityTransaction> findByUserUserIdOrderByCreatedAtDesc(Long userId);
}