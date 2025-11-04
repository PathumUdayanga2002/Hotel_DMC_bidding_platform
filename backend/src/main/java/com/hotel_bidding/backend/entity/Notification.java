package com.hotel_bidding.backend.entity;

import com.hotel_bidding.backend.constants.NotificationType;
import com.hotel_bidding.backend.constants.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Notification - In-app notifications for users
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {
    
    @Id
    private String id;
    
    // Recipient Information
    private String recipientUserId;     // User who receives the notification
    private UserRole recipientRole;     // HOTEL_USER, DMC_USER, ADMIN
    
    // Notification Details
    private NotificationType type;
    private String title;
    private String message;
    
    // Related Entities (for linking)
    private String relatedInquiryId;    // BidInquiry ID (if applicable)
    private String relatedBidId;        // HotelBid ID (if applicable)
    
    // Action URL (where to navigate when clicked)
    private String actionUrl;           // e.g., "/dmc/inquiries/123", "/hotel/bids/456"
    
    // Status
    private boolean read;               // Has user read this notification?
    private LocalDateTime readAt;       // When user read it
    
    // Timestamps
    private LocalDateTime createdAt;
    
    // Priority (for sorting)
    private int priority;               // 1 = High, 2 = Medium, 3 = Low
    
    /**
     * Mark notification as read
     */
    public void markAsRead() {
        this.read = true;
        this.readAt = LocalDateTime.now();
    }
    
    /**
     * Check if notification is unread
     */
    public boolean isUnread() {
        return !this.read;
    }
    
    /**
     * Check if notification is recent (within 24 hours)
     */
    public boolean isRecent() {
        return createdAt != null && 
               createdAt.isAfter(LocalDateTime.now().minusHours(24));
    }
}
