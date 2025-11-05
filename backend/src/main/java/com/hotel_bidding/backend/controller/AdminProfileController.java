package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.dto.AdminProfileDTO;
import com.hotel_bidding.backend.dto.ChangePasswordRequest;
import com.hotel_bidding.backend.dto.UpdateAdminProfileRequest;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.security.UserDetailsImpl;
import com.hotel_bidding.backend.service.AdminProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/admin/profile")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminProfileController {

    private final AdminProfileService adminProfileService;

    /**
     * Get current admin profile
     */
    @GetMapping
    public ResponseEntity<ApiResponse> getProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        log.info("Fetching profile for admin: {}", userDetails.getUsername());
        
        AdminProfileDTO profile = adminProfileService.getAdminProfile(userDetails.getId());

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Admin profile retrieved successfully")
                .data(profile)
                .build());
    }

    /**
     * Update admin profile
     */
    @PutMapping
    public ResponseEntity<ApiResponse> updateProfile(
            @Valid @RequestBody UpdateAdminProfileRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        log.info("Updating profile for admin: {}", userDetails.getUsername());
        
        AdminProfileDTO profile = adminProfileService.updateAdminProfile(
                userDetails.getId(), 
                request
        );

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Admin profile updated successfully")
                .data(profile)
                .build());
    }

    /**
     * Change password
     */
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        log.info("Changing password for admin: {}", userDetails.getUsername());
        
        adminProfileService.changePassword(userDetails.getId(), request);

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Password changed successfully")
                .build());
    }
}
