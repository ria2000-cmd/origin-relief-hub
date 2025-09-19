package za.co.interfile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import za.co.interfile.enums.NotificationPriority;
import za.co.interfile.enums.NotificationType;
import za.co.interfile.model.Notification;
import za.co.interfile.model.Users;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserAndIsReadOrderByCreatedAtDesc(Users user, Boolean isRead);

    List<Notification> findByUserOrderByCreatedAtDesc(Users user);

    int countByUserAndIsRead(Users user, Boolean isRead);

    List<Notification> findByUserAndTypeOrderByCreatedAtDesc(Users user, NotificationType type);

    List<Notification> findByUserAndPriorityOrderByCreatedAtDesc(Users user, NotificationPriority priority);

    @Query("SELECT n FROM Notification n WHERE n.expiresAt < :now")
    List<Notification> findExpiredNotifications(@Param("now") LocalDateTime now);

    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.createdAt >= :since ORDER BY n.createdAt DESC")
    List<Notification> findRecentNotifications(@Param("user") Users user, @Param("since") LocalDateTime since);
}
