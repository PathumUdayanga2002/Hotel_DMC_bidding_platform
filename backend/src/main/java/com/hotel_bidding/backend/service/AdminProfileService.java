package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.dto.AdminProfileDTO;
import com.hotel_bidding.backend.dto.ChangePasswordRequest;
import com.hotel_bidding.backend.dto.UpdateAdminProfileRequest;

public interface AdminProfileService {
    
    /**
     * Get admin profile by ID
     */
    AdminProfileDTO getAdminProfile(String adminId);
    
    /**
     * Update admin profile
     */
    AdminProfileDTO updateAdminProfile(String adminId, UpdateAdminProfileRequest request);
    
    /**
     * Change admin password
     */
    void changePassword(String adminId, ChangePasswordRequest request);
}
