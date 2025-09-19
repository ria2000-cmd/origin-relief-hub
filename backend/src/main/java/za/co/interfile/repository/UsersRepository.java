package za.co.interfile.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import za.co.interfile.enums.UsersStatus;
import za.co.interfile.model.Users;

import java.util.Optional;

/**
 * Repository interface for User entity operations
 * Extends JpaRepository to provide basic CRUD operations and custom queries
 */
@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByEmail(String email);
    Optional<Users> findByUsername(String username);
    Optional<Users> findByIdNumber(String idNumber);
    Optional<Users> findByEmailAndStatus(String email, UsersStatus status);
    Optional<Users> findByUserIdAndStatus(Long userId, UsersStatus status);
    Optional<Users> findByNationalId(String nationalId);

    @Query("SELECT u FROM Users u WHERE u.status = za.co.interfile.enums.UsersStatus.ACTIVE AND " +
            "(LOWER(u.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "u.phone LIKE CONCAT('%', :searchTerm, '%'))")
    Page<Users> searchActiveUsers(@Param("searchTerm") String searchTerm, Pageable pageable);

    Page<Users> findByStatus(UsersStatus status, Pageable pageable);

    @Query("SELECT COUNT(u) FROM Users u WHERE u.status = :status")
    long countByStatus(@Param("status") UsersStatus status);

    @Query("SELECT u FROM Users u WHERE u.emailVerified = true AND u.phoneVerified = true")
    Page<Users> findFullyVerifiedUsers(Pageable pageable);
}