package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.dto.PlatformSettingsResponse;
import com.hotel_bidding.backend.dto.UpdateCommissionSettingsRequest;
import com.hotel_bidding.backend.dto.UpdateSystemSettingsRequest;

public interface PlatformSettingsService {
    
    /**
     * Get current platform settings
     */
    PlatformSettingsResponse getSettings();
    
    /**
     * Update commission settings
     */
    PlatformSettingsResponse updateCommissionSettings(
            UpdateCommissionSettingsRequest request,
            String adminUserId,
            String adminUsername
    );
    
    /**
     * Update system settings
     */
    PlatformSettingsResponse updateSystemSettings(
            UpdateSystemSettingsRequest request,
            String adminUserId,
            String adminUsername
    );
    
    /**
     * Initialize default settings if none exist
     */
    void initializeDefaultSettings();
}
