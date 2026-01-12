package com.hotel_bidding.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hotel_bidding.backend.constants.DMCProfileStatus;
import com.hotel_bidding.backend.constants.HotelProfileStatus;
import com.hotel_bidding.backend.dto.AdminNoteRequest;
import com.hotel_bidding.backend.dto.DMCProfileResponse;
import com.hotel_bidding.backend.dto.DMCProfileStats;
import com.hotel_bidding.backend.dto.DMCProfileSummary;
import com.hotel_bidding.backend.dto.HotelAdminNoteRequest;
import com.hotel_bidding.backend.dto.HotelProfileResponse;
import com.hotel_bidding.backend.dto.HotelProfileStats;
import com.hotel_bidding.backend.dto.HotelProfileSummary;
import com.hotel_bidding.backend.dto.PlatformSettingsResponse;
import com.hotel_bidding.backend.dto.UpdateCommissionSettingsRequest;
import com.hotel_bidding.backend.dto.UpdateDMCStatusRequest;
import com.hotel_bidding.backend.dto.UpdateHotelStatusRequest;
import com.hotel_bidding.backend.dto.UpdateSystemSettingsRequest;
import com.hotel_bidding.backend.dto.analytics.PlatformAnalyticsDTO;
import com.hotel_bidding.backend.dto.analytics.PlatformPerformanceDTO;
import com.hotel_bidding.backend.dto.analytics.RevenueAnalyticsDTO;
import com.hotel_bidding.backend.dto.analytics.TopHotelMarketDTO;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.security.UserDetailsImpl;
import com.hotel_bidding.backend.service.AdminDMCService;
import com.hotel_bidding.backend.service.AdminHotelService;
import com.hotel_bidding.backend.service.PlatformAnalyticsService;
import com.hotel_bidding.backend.service.PlatformSettingsService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminDMCService adminDMCService;
    private final AdminHotelService adminHotelService;
    private final PlatformSettingsService platformSettingsService;
    private final PlatformAnalyticsService platformAnalyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse> getDashboard(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Map<String, Object> dashboardData = new HashMap<>();
        dashboardData.put("username", userDetails.getUsername());
        dashboardData.put("email", userDetails.getEmail());
        dashboardData.put("role", userDetails.getRole());
        dashboardData.put("message", "Welcome to Admin Dashboard");

        // Add DMC profile stats
        DMCProfileStats dmcStats = adminDMCService.getStats();
        dashboardData.put("dmcStats", dmcStats);
        
        // Add Hotel profile stats
        HotelProfileStats hotelStats = adminHotelService.getStats();
        dashboardData.put("hotelStats", hotelStats);

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Admin Dashboard")
                .data(dashboardData)
                .build());
    }

    // ==================== DMC Approval Management ====================

    @GetMapping("/dmc-approvals")
    public ResponseEntity<ApiResponse> getAllDMCProfiles(
            @RequestParam(required = false) DMCProfileStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "submittedAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection
    ) {
        Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<DMCProfileSummary> profiles = adminDMCService.getAllDMCProfiles(status, search, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("profiles", profiles.getContent());
        response.put("currentPage", profiles.getNumber());
        response.put("totalPages", profiles.getTotalPages());
        response.put("totalElements", profiles.getTotalElements());
        response.put("hasNext", profiles.hasNext());
        response.put("hasPrevious", profiles.hasPrevious());

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("DMC profiles retrieved successfully")
                .data(response)
                .build());
    }

    @GetMapping("/dmc-approvals/{id}")
    public ResponseEntity<ApiResponse> getDMCProfileById(@PathVariable String id) {
        DMCProfileResponse profile = adminDMCService.getDMCProfileById(id);

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("DMC profile retrieved successfully")
                .data(profile)
                .build());
    }

    @PutMapping("/dmc-approvals/{id}/approve")
    public ResponseEntity<ApiResponse> approveDMCProfile(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        DMCProfileResponse profile = adminDMCService.approveDMCProfile(
                id,
                userDetails.getId(),
                userDetails.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("DMC profile approved successfully")
                .data(profile)
                .build());
    }

    @PutMapping("/dmc-approvals/{id}/reject")
    public ResponseEntity<ApiResponse> rejectDMCProfile(
            @PathVariable String id,
            @RequestBody Map<String, String> requestBody,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        String reason = requestBody.get("reason");
        
        DMCProfileResponse profile = adminDMCService.rejectDMCProfile(
                id,
                reason,
                userDetails.getId(),
                userDetails.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("DMC profile rejected successfully")
                .data(profile)
                .build());
    }

    @PutMapping("/dmc-approvals/{id}/status")
    public ResponseEntity<ApiResponse> updateDMCStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateDMCStatusRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        DMCProfileResponse profile = adminDMCService.updateDMCStatus(
                id,
                request,
                userDetails.getId(),
                userDetails.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("DMC profile status updated successfully")
                .data(profile)
                .build());
    }

    @PostMapping("/dmc-approvals/{id}/notes")
    public ResponseEntity<ApiResponse> addAdminNote(
            @PathVariable String id,
            @Valid @RequestBody AdminNoteRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        DMCProfileResponse profile = adminDMCService.addAdminNote(
                id,
                request,
                userDetails.getId(),
                userDetails.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Admin note added successfully")
                .data(profile)
                .build());
    }

    @GetMapping("/dmc-approvals/stats")
    public ResponseEntity<ApiResponse> getDMCStats() {
        DMCProfileStats stats = adminDMCService.getStats();

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("DMC profile statistics retrieved successfully")
                .data(stats)
                .build());
    }
    
    // ==================== Hotel Approval Management ====================

    @GetMapping("/hotel-approvals")
    public ResponseEntity<ApiResponse> getAllHotelProfiles(
            @RequestParam(required = false) HotelProfileStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection
    ) {
        Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<HotelProfileSummary> profiles = adminHotelService.getAllHotelProfiles(status, search, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("profiles", profiles.getContent());
        response.put("currentPage", profiles.getNumber());
        response.put("totalPages", profiles.getTotalPages());
        response.put("totalElements", profiles.getTotalElements());
        response.put("hasNext", profiles.hasNext());
        response.put("hasPrevious", profiles.hasPrevious());

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Hotel profiles retrieved successfully")
                .data(response)
                .build());
    }

    @GetMapping("/hotel-approvals/{id}")
    public ResponseEntity<ApiResponse> getHotelProfileById(@PathVariable String id) {
        HotelProfileResponse profile = adminHotelService.getHotelProfileById(id);

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Hotel profile retrieved successfully")
                .data(profile)
                .build());
    }

    @PutMapping("/hotel-approvals/{id}/approve")
    public ResponseEntity<ApiResponse> approveHotelProfile(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        HotelProfileResponse profile = adminHotelService.approveHotelProfile(
                id,
                userDetails.getId(),
                userDetails.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Hotel profile approved successfully")
                .data(profile)
                .build());
    }

    @PutMapping("/hotel-approvals/{id}/reject")
    public ResponseEntity<ApiResponse> rejectHotelProfile(
            @PathVariable String id,
            @RequestBody Map<String, String> requestBody,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        String reason = requestBody.get("reason");
        
        HotelProfileResponse profile = adminHotelService.rejectHotelProfile(
                id,
                reason,
                userDetails.getId(),
                userDetails.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Hotel profile rejected successfully")
                .data(profile)
                .build());
    }

    @PutMapping("/hotel-approvals/{id}/status")
    public ResponseEntity<ApiResponse> updateHotelStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateHotelStatusRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        HotelProfileResponse profile = adminHotelService.updateHotelStatus(
                id,
                request,
                userDetails.getId(),
                userDetails.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Hotel profile status updated successfully")
                .data(profile)
                .build());
    }

    @PostMapping("/hotel-approvals/{id}/notes")
    public ResponseEntity<ApiResponse> addHotelAdminNote(
            @PathVariable String id,
            @Valid @RequestBody HotelAdminNoteRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        HotelProfileResponse profile = adminHotelService.addAdminNote(
                id,
                request,
                userDetails.getId(),
                userDetails.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Admin note added successfully")
                .data(profile)
                .build());
    }

    @GetMapping("/hotel-approvals/stats")
    public ResponseEntity<ApiResponse> getHotelStats() {
        HotelProfileStats stats = adminHotelService.getStats();

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Hotel profile statistics retrieved successfully")
                .data(stats)
                .build());
    }

    // ==================== User Management Dashboard ====================

    @GetMapping("/user-management/stats")
    public ResponseEntity<ApiResponse> getUserManagementStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get DMC stats
        DMCProfileStats dmcStats = adminDMCService.getStats();
        stats.put("totalDMCs", dmcStats.getTotal());
        stats.put("approvedDMCs", dmcStats.getApproved());
        stats.put("pendingDMCs", dmcStats.getPending());
        stats.put("rejectedDMCs", dmcStats.getRejected());
        
        // Get Hotel stats
        HotelProfileStats hotelStats = adminHotelService.getStats();
        stats.put("totalHotels", hotelStats.getTotal());
        stats.put("approvedHotels", hotelStats.getApproved());
        stats.put("pendingHotels", hotelStats.getPending());
        stats.put("rejectedHotels", hotelStats.getRejected());
        
        // Calculate total pending approvals
        long totalPendingApprovals = dmcStats.getPending() + hotelStats.getPending();
        stats.put("totalPendingApprovals", totalPendingApprovals);

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("User management statistics retrieved successfully")
                .data(stats)
                .build());
    }

    @GetMapping("/user-management/hotels")
    public ResponseEntity<ApiResponse> getAllHotels(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<HotelProfileSummary> profiles = adminHotelService.getAllHotelProfiles(null, search, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("hotels", profiles.getContent());
        response.put("currentPage", profiles.getNumber());
        response.put("totalPages", profiles.getTotalPages());
        response.put("totalElements", profiles.getTotalElements());
        response.put("hasNext", profiles.hasNext());
        response.put("hasPrevious", profiles.hasPrevious());

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Hotels retrieved successfully")
                .data(response)
                .build());
    }

    @GetMapping("/user-management/dmcs")
    public ResponseEntity<ApiResponse> getAllDMCs(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "submittedAt");
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<DMCProfileSummary> profiles = adminDMCService.getAllDMCProfiles(null, search, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("dmcs", profiles.getContent());
        response.put("currentPage", profiles.getNumber());
        response.put("totalPages", profiles.getTotalPages());
        response.put("totalElements", profiles.getTotalElements());
        response.put("hasNext", profiles.hasNext());
        response.put("hasPrevious", profiles.hasPrevious());

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("DMCs retrieved successfully")
                .data(response)
                .build());
    }

    // ==================== Platform Settings Management ====================

    @GetMapping("/settings")
    public ResponseEntity<ApiResponse> getPlatformSettings() {
        PlatformSettingsResponse settings = platformSettingsService.getSettings();

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Platform settings retrieved successfully")
                .data(settings)
                .build());
    }

    @PutMapping("/settings/commission")
    public ResponseEntity<ApiResponse> updateCommissionSettings(
            @Valid @RequestBody UpdateCommissionSettingsRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        PlatformSettingsResponse settings = platformSettingsService.updateCommissionSettings(
                request,
                userDetails.getId(),
                userDetails.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Commission settings updated successfully")
                .data(settings)
                .build());
    }

    @PutMapping("/settings/system")
    public ResponseEntity<ApiResponse> updateSystemSettings(
            @Valid @RequestBody UpdateSystemSettingsRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        PlatformSettingsResponse settings = platformSettingsService.updateSystemSettings(
                request,
                userDetails.getId(),
                userDetails.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("System settings updated successfully")
                .data(settings)
                .build());
    }

    // ==================== Platform Analytics ====================

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse> getPlatformAnalytics(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) Integer minStars,
            @RequestParam(required = false) String city
    ) {
        log.info("Fetching complete platform analytics with filters: limit={}, sortBy={}, minStars={}, city={}", 
                limit, sortBy, minStars, city);
        
        // Build analytics with filtered top hotels
        PlatformAnalyticsDTO analytics = PlatformAnalyticsDTO.builder()
                .revenueAnalytics(platformAnalyticsService.getRevenueAnalytics())
                .platformPerformance(platformAnalyticsService.getPlatformPerformance())
                .topHotelMarkets(platformAnalyticsService.getTopHotelMarkets(limit, sortBy, minStars, city))
                .generatedAt(java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ISO_DATE_TIME))
                .period("YTD " + java.time.LocalDateTime.now().getYear())
                .build();

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Platform analytics retrieved successfully")
                .data(analytics)
                .build());
    }

    @GetMapping("/analytics/revenue")
    public ResponseEntity<ApiResponse> getRevenueAnalytics() {
        log.info("Fetching revenue analytics");
        RevenueAnalyticsDTO revenue = platformAnalyticsService.getRevenueAnalytics();

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Revenue analytics retrieved successfully")
                .data(revenue)
                .build());
    }

    @GetMapping("/analytics/performance")
    public ResponseEntity<ApiResponse> getPlatformPerformance() {
        log.info("Fetching platform performance metrics");
        PlatformPerformanceDTO performance = platformAnalyticsService.getPlatformPerformance();

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Platform performance metrics retrieved successfully")
                .data(performance)
                .build());
    }

    @GetMapping("/analytics/top-hotels")
    public ResponseEntity<ApiResponse> getTopHotelMarkets(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) Integer minStars,
            @RequestParam(required = false) String city
    ) {
        log.info("Fetching top {} hotel markets with filters: sortBy={}, minStars={}, city={}", limit, sortBy, minStars, city);
        List<TopHotelMarketDTO> topHotels = platformAnalyticsService.getTopHotelMarkets(limit, sortBy, minStars, city);

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Top hotel markets retrieved successfully")
                .data(topHotels)
                .build());
    }
}
