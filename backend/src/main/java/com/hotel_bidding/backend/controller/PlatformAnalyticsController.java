package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.dto.PlatformAnalyticsDTO;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.service.PlatformAnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/admin/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class PlatformAnalyticsController {

    private final PlatformAnalyticsService platformAnalyticsService;

    /**
     * Get platform analytics for current year (YTD)
     */
    @GetMapping
    public ResponseEntity<ApiResponse> getPlatformAnalytics() {
        log.info("Fetching platform analytics for current year");
        
        PlatformAnalyticsDTO analytics = platformAnalyticsService.getPlatformAnalytics(null);

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Platform analytics retrieved successfully")
                .data(analytics)
                .build());
    }

    /**
     * Get platform analytics for a specific year
     */
    @GetMapping("/year/{year}")
    public ResponseEntity<ApiResponse> getPlatformAnalyticsByYear(@PathVariable Integer year) {
        log.info("Fetching platform analytics for year: {}", year);
        
        if (year < 2020 || year > 2100) {
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .success(false)
                    .message("Invalid year. Please provide a year between 2020 and 2100")
                    .build());
        }
        
        PlatformAnalyticsDTO analytics = platformAnalyticsService.getPlatformAnalytics(year);

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Platform analytics for " + year + " retrieved successfully")
                .data(analytics)
                .build());
    }

    /**
     * Get platform analytics for a custom period
     */
    @GetMapping("/period")
    public ResponseEntity<ApiResponse> getPlatformAnalyticsByPeriod(
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        log.info("Fetching platform analytics for period: {} to {}", startDate, endDate);
        
        try {
            PlatformAnalyticsDTO analytics = platformAnalyticsService
                    .getPlatformAnalyticsByPeriod(startDate, endDate);

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("Platform analytics for period retrieved successfully")
                    .data(analytics)
                    .build());
        } catch (Exception e) {
            log.error("Error fetching analytics for period", e);
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .success(false)
                    .message("Invalid date format. Please use yyyy-MM-dd format")
                    .build());
        }
    }
}
