package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.constants.DMCProfileStatus;
import com.hotel_bidding.backend.constants.HotelProfileStatus;
import com.hotel_bidding.backend.dto.*;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.security.UserDetailsImpl;
import com.hotel_bidding.backend.service.AdminDMCService;
import com.hotel_bidding.backend.service.AdminHotelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminDMCService adminDMCService;
    private final AdminHotelService adminHotelService;

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
}
