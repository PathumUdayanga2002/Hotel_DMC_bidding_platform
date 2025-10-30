package com.hotel_bidding.backend.dto.response;

import com.hotel_bidding.backend.constants.NotificationType;
import com.hotel_bidding.backend.constants.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for Notification
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    
    private String id;
    
    // Recipient
    private String recipientUserId;
    private UserRole recipientRole;
    
    // Notification Details
    private NotificationType type;
    private String title;
    private String message;
    
    // Related Entities
    private String relatedInquiryId;
    private String relatedBidId;
    
    // Action
    private String actionUrl;
    
    // Status
    private boolean read;
    private LocalDateTime readAt;
    
    // Timestamps
    private LocalDateTime createdAt;
    
    // Priority
    private int priority;
    
    // Calculated
    private boolean isUnread;
    private boolean isRecent;
}
