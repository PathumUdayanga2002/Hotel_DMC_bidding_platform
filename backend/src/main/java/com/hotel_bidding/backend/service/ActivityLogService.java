package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.constants.ActivityType;
import com.hotel_bidding.backend.dto.response.ActivityLogResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service interface for activity logging
 */
public interface ActivityLogService {
    
    /**
     * Log an activity
     */
    void logActivity(
            ActivityType activityType,
            String performedBy,
            String performedByName,
            String companyName,
            String companyId,
            String targetId,
            String targetType,
            String description,
            String details,
            HttpServletRequest request
    );
    
    /**
     * Get activity logs for a company
     */
    Page<ActivityLogResponse> getActivityLogs(String companyId, Pageable pageable);
    
    /**
     * Get activity logs by date range
     */
    Page<ActivityLogResponse> getActivityLogsByDateRange(
            String companyId,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable
    );
    
    /**
     * Get recent activities for dashboard
     */
    List<ActivityLogResponse> getRecentActivities(String companyId);
    
    /**
     * Get action count for a user
     */
    Long getActionCount(String userId);
}
