package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.dto.CommissionSettingsDTO;
import com.hotel_bidding.backend.dto.PlatformSettingsDTO;
import com.hotel_bidding.backend.dto.SystemSettingsDTO;

public interface PlatformSettingsService {
    
    /**
     * Get current platform settings
     */
    PlatformSettingsDTO getPlatformSettings();
    
    /**
     * Update commission settings
     */
    PlatformSettingsDTO updateCommissionSettings(
            CommissionSettingsDTO commissionSettings,
            String adminId,
            String adminUsername
    );
    
    /**
     * Update system settings
     */
    PlatformSettingsDTO updateSystemSettings(
            SystemSettingsDTO systemSettings,
            String adminId,
            String adminUsername
    );
    
    /**
     * Update all platform settings
     */
    PlatformSettingsDTO updateAllSettings(
            PlatformSettingsDTO settings,
            String adminId,
            String adminUsername
    );
    
    /**
     * Reset settings to default values
     */
    PlatformSettingsDTO resetToDefaults(String adminId, String adminUsername);
}
