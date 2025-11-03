package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.constants.NotificationType;
import com.hotel_bidding.backend.dto.response.NotificationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for Notification operations
 */
public interface NotificationService {
    
    /**
     * Create a notification
     */
    void createNotification(String recipientUserId, NotificationType type, String title, 
                          String message, String relatedInquiryId, String relatedBidId, 
                          String actionUrl, int priority);
    
    /**
     * Get all notifications for user
     */
    Page<NotificationResponse> getNotificationsByUser(String userId, Pageable pageable);
    
    /**
     * Get unread notifications for user
     */
    List<NotificationResponse> getUnreadNotifications(String userId);
    
    /**
     * Count unread notifications
     */
    long countUnreadNotifications(String userId);
    
    /**
     * Mark notification as read
     */
    void markAsRead(String notificationId, String userId);
    
    /**
     * Mark all notifications as read for user
     */
    void markAllAsRead(String userId);
    
    /**
     * Delete notification
     */
    void deleteNotification(String notificationId, String userId);
    
    /**
     * Send new inquiry notification to hotels (matching cities)
     */
    void notifyHotelsAboutNewInquiry(String inquiryId, List<String> cities);
    
    /**
     * Send new bid notification to DMC
     */
    void notifyDmcAboutNewBid(String bidId, String dmcUserId);
    
    /**
     * Send bid accepted notification to hotel
     */
    void notifyHotelAboutBidAcceptance(String bidId, String hotelUserId);
    
    /**
     * Send bid rejected notification to hotel
     */
    void notifyHotelAboutBidRejection(String bidId, String hotelUserId);
    
    /**
     * Send inquiry closed notification to hotels that bid
     */
    void notifyHotelsAboutInquiryClosed(String inquiryId);
    
    /**
     * Send deadline approaching notification
     */
    void notifyAboutApproachingDeadline(String inquiryId);
}
