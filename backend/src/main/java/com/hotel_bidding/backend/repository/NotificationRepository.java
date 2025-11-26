package com.hotel_bidding.backend.repository;

import com.hotel_bidding.backend.constants.NotificationType;
import com.hotel_bidding.backend.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for Notification entity
 */
@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    
    // Find by recipient user ID
    Page<Notification> findByRecipientUserIdOrderByCreatedAtDesc(String recipientUserId, Pageable pageable);
    
    // Find unread notifications by user
    List<Notification> findByRecipientUserIdAndReadFalseOrderByCreatedAtDesc(String recipientUserId);
    
    Page<Notification> findByRecipientUserIdAndReadFalseOrderByCreatedAtDesc(String recipientUserId, Pageable pageable);
    
    // Count unread notifications
    long countByRecipientUserIdAndReadFalse(String recipientUserId);
    
    // Find by type
    Page<Notification> findByRecipientUserIdAndTypeOrderByCreatedAtDesc(String recipientUserId, NotificationType type, Pageable pageable);
    
    // Find recent notifications (last 24 hours)
    @Query("{ 'recipientUserId': ?0, 'createdAt': { $gt: ?1 } }")
    List<Notification> findRecentNotifications(String recipientUserId, LocalDateTime since);
    
    // Delete old notifications (cleanup)
    @Query(value = "{ 'createdAt': { $lt: ?0 } }", delete = true)
    void deleteOldNotifications(LocalDateTime before);
    
    // Find by related inquiry
    List<Notification> findByRelatedInquiryId(String inquiryId);
    
    // Find by related bid
    List<Notification> findByRelatedBidId(String bidId);
    
    // Mark all as read for a user
    @Query("{ 'recipientUserId': ?0, 'read': false }")
    List<Notification> findUnreadByUser(String recipientUserId);
}
