package com.hotel_bidding.backend.entity;

import com.hotel_bidding.backend.constants.ActivityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Activity Log entity for audit trail
 * Tracks all actions performed by super admin and staff
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "activity_logs")
public class ActivityLog {
    
    @Id
    private String id;
    
    private ActivityType activityType;
    
    private String performedBy; // User ID who performed the action
    
    private String performedByName; // Full name of the user
    
    private String companyName; // Company name (DMC or Hotel)
    
    private String companyId; // DMC or Hotel user ID (super admin)
    
    private String targetId; // ID of the affected entity (inquiry, bid, staff, etc.)
    
    private String targetType; // Type of entity (BID_INQUIRY, HOTEL_BID, STAFF, etc.)
    
    private String description; // Human-readable description
    
    private String details; // Additional JSON details
    
    private String ipAddress;
    
    private String userAgent;
    
    @CreatedDate
    private LocalDateTime timestamp;
}
