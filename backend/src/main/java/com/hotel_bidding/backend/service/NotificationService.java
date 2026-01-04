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
    
    // ==================== HOTEL-SPECIFIC NOTIFICATIONS ====================
    
    /**
     * Notify hotel when profile is approved by admin
     */
    void notifyHotelProfileApproved(String hotelUserId, String profileId);
    
    /**
     * Notify hotel when profile is rejected by admin
     */
    void notifyHotelProfileRejected(String hotelUserId, String profileId, String reason);
    
    /**
     * Notify hotel when direct inquiry is created
     */
    void notifyDirectInquiryCreated(String hotelUserId, String inquiryId);
    
    /**
     * Notify hotel when proposal is received
     */
    void notifyProposalReceived(String hotelUserId, String proposalId, String dmcName);
    
    /**
     * Notify hotel when bid status is updated
     */
    void notifyBidStatusUpdated(String hotelUserId, String bidId, String status);
    
    /**
     * Notify hotel when staff member is added
     */
    void notifyHotelStaffAdded(String hotelUserId, String staffName, String staffEmail);
    
    /**
     * Notify hotel when staff member is removed
     */
    void notifyHotelStaffRemoved(String hotelUserId, String staffName);
    
    /**
     * Notify hotel when message is received
     */
    void notifyMessageReceived(String recipientUserId, String senderName, String messageId);
    
    /**
     * Notify when message delivery failed
     */
    void notifyMessageFailed(String senderUserId, String recipientName, String reason);
    
    // ==================== DMC-SPECIFIC NOTIFICATIONS ====================
    
    /**
     * Notify DMC when profile is approved by admin
     */
    void notifyDmcProfileApproved(String dmcUserId, String profileId);
    
    /**
     * Notify DMC when profile is rejected by admin
     */
    void notifyDmcProfileRejected(String dmcUserId, String profileId, String reason);
    
    /**
     * Notify DMC when account status is changed
     */
    void notifyDmcAccountStatusChanged(String dmcUserId, String newStatus, String reason);
    
    /**
     * Notify DMC when inquiry is received
     */
    void notifyInquiryReceived(String dmcUserId, String inquiryId, String hotelName);
    
    /**
     * Notify DMC when inquiry is updated
     */
    void notifyInquiryUpdated(String dmcUserId, String inquiryId, String updateType);
    
    /**
     * Notify DMC when contract is received
     */
    void notifyContractReceived(String dmcUserId, String contractId, String hotelName);
    
    /**
     * Notify DMC when staff member is added
     */
    void notifyDmcStaffAdded(String dmcUserId, String staffName, String staffEmail);
    
    /**
     * Notify DMC when staff member is removed
     */
    void notifyDmcStaffRemoved(String dmcUserId, String staffName);
    
    // ==================== ADMIN NOTIFICATIONS ====================
    
    /**
     * Notify admin when new user registers
     */
    void notifyAdminNewRegistration(String userEmail, String userType);
    
    /**
     * Notify admin when profile is submitted for review
     */
    void notifyAdminProfileSubmitted(String profileId, String profileType, String companyName);
}
