package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.constants.ActivityType;
import com.hotel_bidding.backend.dto.response.ActivityLogResponse;
import com.hotel_bidding.backend.entity.ActivityLog;
import com.hotel_bidding.backend.repository.ActivityLogRepository;
import com.hotel_bidding.backend.service.ActivityLogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of ActivityLogService
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityLogServiceImpl implements ActivityLogService {
    
    private final ActivityLogRepository activityLogRepository;
    
    @Override
    public void logActivity(
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
    ) {
        try {
            ActivityLog activityLog = ActivityLog.builder()
                    .activityType(activityType)
                    .performedBy(performedBy)
                    .performedByName(performedByName)
                    .companyName(companyName)
                    .companyId(companyId)
                    .targetId(targetId)
                    .targetType(targetType)
                    .description(description)
                    .details(details)
                    .ipAddress(getClientIP(request))
                    .userAgent(request != null ? request.getHeader("User-Agent") : null)
                    .timestamp(LocalDateTime.now())
                    .build();
            
            activityLogRepository.save(activityLog);
            log.info("Activity logged: {} by {}", activityType, performedByName);
        } catch (Exception e) {
            log.error("Failed to log activity: {}", e.getMessage());
        }
    }
    
    @Override
    public Page<ActivityLogResponse> getActivityLogs(String companyId, Pageable pageable) {
        Page<ActivityLog> logs = activityLogRepository.findByCompanyIdOrderByTimestampDesc(companyId, pageable);
        return logs.map(this::mapToResponse);
    }
    
    @Override
    public Page<ActivityLogResponse> getActivityLogsByDateRange(
            String companyId,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable
    ) {
        Page<ActivityLog> logs = activityLogRepository.findByCompanyIdAndTimestampBetweenOrderByTimestampDesc(
                companyId, startDate, endDate, pageable);
        return logs.map(this::mapToResponse);
    }
    
    @Override
    public List<ActivityLogResponse> getRecentActivities(String companyId) {
        List<ActivityLog> logs = activityLogRepository.findTop10ByCompanyIdOrderByTimestampDesc(companyId);
        return logs.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public Long getActionCount(String userId) {
        return activityLogRepository.countByPerformedBy(userId);
    }
    
    private ActivityLogResponse mapToResponse(ActivityLog log) {
        return ActivityLogResponse.builder()
                .id(log.getId())
                .activityType(log.getActivityType())
                .performedBy(log.getPerformedBy())
                .performedByName(log.getPerformedByName())
                .companyName(log.getCompanyName())
                .companyId(log.getCompanyId())
                .targetId(log.getTargetId())
                .targetType(log.getTargetType())
                .description(log.getDescription())
                .details(log.getDetails())
                .ipAddress(log.getIpAddress())
                .timestamp(log.getTimestamp())
                .build();
    }
    
    private String getClientIP(HttpServletRequest request) {
        if (request == null) {
            return "Unknown";
        }
        
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
