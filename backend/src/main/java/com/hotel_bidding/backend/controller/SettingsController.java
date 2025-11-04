package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.dto.CommissionSettingsDTO;
import com.hotel_bidding.backend.dto.PlatformSettingsDTO;
import com.hotel_bidding.backend.dto.SystemSettingsDTO;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.security.UserDetailsImpl;
import com.hotel_bidding.backend.service.PlatformSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/admin/settings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SettingsController {

    private final PlatformSettingsService platformSettingsService;

    /**
     * Get current platform settings
     */
    @GetMapping
    public ResponseEntity<ApiResponse> getPlatformSettings() {
        log.info("Fetching platform settings");
        
        PlatformSettingsDTO settings = platformSettingsService.getPlatformSettings();

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Platform settings retrieved successfully")
                .data(settings)
                .build());
    }

    /**
     * Update commission settings
     */
    @PutMapping("/commission")
    public ResponseEntity<ApiResponse> updateCommissionSettings(
            @Valid @RequestBody CommissionSettingsDTO commissionSettings,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        log.info("Updating commission settings by admin: {}", userDetails.getUsername());
        
        PlatformSettingsDTO settings = platformSettingsService.updateCommissionSettings(
                commissionSettings,
                userDetails.getId(),
                userDetails.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Commission settings updated successfully")
                .data(settings)
                .build());
    }

    /**
     * Update system settings
     */
    @PutMapping("/system")
    public ResponseEntity<ApiResponse> updateSystemSettings(
            @Valid @RequestBody SystemSettingsDTO systemSettings,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        log.info("Updating system settings by admin: {}", userDetails.getUsername());
        
        PlatformSettingsDTO settings = platformSettingsService.updateSystemSettings(
                systemSettings,
                userDetails.getId(),
                userDetails.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("System settings updated successfully")
                .data(settings)
                .build());
    }

    /**
     * Update all platform settings
     */
    @PutMapping
    public ResponseEntity<ApiResponse> updateAllSettings(
            @Valid @RequestBody PlatformSettingsDTO settings,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        log.info("Updating all platform settings by admin: {}", userDetails.getUsername());
        
        PlatformSettingsDTO updatedSettings = platformSettingsService.updateAllSettings(
                settings,
                userDetails.getId(),
                userDetails.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Platform settings updated successfully")
                .data(updatedSettings)
                .build());
    }

    /**
     * Reset settings to default values
     */
    @PostMapping("/reset")
    public ResponseEntity<ApiResponse> resetToDefaults(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        log.info("Resetting platform settings to defaults by admin: {}", userDetails.getUsername());
        
        PlatformSettingsDTO settings = platformSettingsService.resetToDefaults(
                userDetails.getId(),
                userDetails.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Platform settings reset to defaults successfully")
                .data(settings)
                .build());
    }
}
