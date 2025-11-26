package com.hotel_bidding.backend.dto.response;

import com.hotel_bidding.backend.constants.ActivityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for activity log entries
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogResponse {
    
    private String id;
    private ActivityType activityType;
    private String performedBy;
    private String performedByName;
    private String companyName;
    private String companyId;
    private String targetId;
    private String targetType;
    private String description;
    private String details;
    private String ipAddress;
    private LocalDateTime timestamp;
}
