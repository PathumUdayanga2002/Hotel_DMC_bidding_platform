package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.dto.DMCProfileRequest;
import com.hotel_bidding.backend.dto.DMCProfileResponse;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.security.UserDetailsImpl;
import com.hotel_bidding.backend.service.DMCProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/dmc")
@RequiredArgsConstructor
public class DMCController {

    private final DMCProfileService dmcProfileService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse> getDashboard(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Map<String, Object> dashboardData = new HashMap<>();
        dashboardData.put("username", userDetails.getUsername());
        dashboardData.put("email", userDetails.getEmail());
        dashboardData.put("role", userDetails.getRole());
        
        // Check if profile is approved
        boolean isApproved = dmcProfileService.isProfileApproved(userDetails.getId());
        dashboardData.put("isProfileApproved", isApproved);
        dashboardData.put("message", "Welcome to DMC Dashboard");

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("DMC Dashboard")
                .data(dashboardData)
                .build());
    }

    @PostMapping(value = "/profile/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> registerProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestPart("profile") DMCProfileRequest request,
            @RequestPart(value = "sltdaCertification", required = false) MultipartFile sltdaCertification
    ) throws IOException {
        
        log.info("Registering DMC profile for user: {}", userDetails.getUsername());
        
        DMCProfileResponse response = dmcProfileService.createOrUpdateProfile(
                userDetails.getId(),
                request,
                sltdaCertification
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.builder()
                .success(true)
                .message("DMC profile submitted successfully. Waiting for admin approval.")
                .data(response)
                .build());
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse> getProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        DMCProfileResponse response = dmcProfileService.getProfileByUserId(userDetails.getId());

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("DMC profile retrieved successfully")
                .data(response)
                .build());
    }

    @GetMapping("/profile/status")
    public ResponseEntity<ApiResponse> getProfileStatus(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            DMCProfileResponse response = dmcProfileService.getProfileByUserId(userDetails.getId());
            
            Map<String, Object> statusData = new HashMap<>();
            statusData.put("status", response.getStatus());
            statusData.put("isApproved", response.getStatus().toString().equals("APPROVED"));
            statusData.put("rejectionReason", response.getCurrentRejectionReason());
            statusData.put("submittedAt", response.getSubmittedAt());
            statusData.put("approvedAt", response.getApprovedAt());

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("Profile status retrieved successfully")
                    .data(statusData)
                    .build());
        } catch (Exception e) {
            // Profile not found - not yet registered
            Map<String, Object> statusData = new HashMap<>();
            statusData.put("status", null);
            statusData.put("isApproved", false);
            statusData.put("profileExists", false);

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("No profile found")
                    .data(statusData)
                    .build());
        }
    }
}

