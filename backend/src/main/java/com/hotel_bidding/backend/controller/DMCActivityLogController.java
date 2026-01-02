package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.dto.response.ActivityLogResponse;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Activity Log Controller for DMC
 * Only accessible by DMC users (both super admin and staff can view their own company's logs)
 */
@RestController
@RequestMapping("/dmc/activity-logs")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${app.frontend.url:http://localhost:5173}", allowCredentials = "true")
public class DMCActivityLogController {
    
    private final ActivityLogService activityLogService;
    
    /**
     * Get activity logs with pagination
     * GET /dmc/activity-logs
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('DMC_USER', 'DMC_SUPER_ADMIN', 'DMC_STAFF_ADMIN')")
    public ResponseEntity<ApiResponse> getActivityLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        
        log.info("DMC fetching activity logs - Page: {}, Size: {}", page, size);
        String userId = authentication.getName();
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ActivityLogResponse> logs = activityLogService.getActivityLogs(userId, pageable);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Activity logs retrieved successfully")
                .data(logs)
                .build());
    }
    
    /**
     * Get activity logs by date range
     * GET /dmc/activity-logs/range
     */
    @GetMapping("/range")
    @PreAuthorize("hasAnyRole('DMC_USER', 'DMC_SUPER_ADMIN', 'DMC_STAFF_ADMIN')")
    public ResponseEntity<ApiResponse> getActivityLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        
        log.info("DMC fetching activity logs for date range: {} to {}", startDate, endDate);
        String userId = authentication.getName();
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ActivityLogResponse> logs = activityLogService.getActivityLogsByDateRange(
                userId, startDate, endDate, pageable);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Activity logs retrieved successfully")
                .data(logs)
                .build());
    }
    
    /**
     * Get recent activities (last 10)
     * GET /dmc/activity-logs/recent
     */
    @GetMapping("/recent")
    @PreAuthorize("hasAnyRole('DMC_USER', 'DMC_SUPER_ADMIN', 'DMC_STAFF_ADMIN')")
    public ResponseEntity<ApiResponse> getRecentActivities(Authentication authentication) {
        
        log.info("DMC fetching recent activities");
        String userId = authentication.getName();
        
        List<ActivityLogResponse> logs = activityLogService.getRecentActivities(userId);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Recent activities retrieved successfully")
                .data(logs)
                .build());
    }
}
