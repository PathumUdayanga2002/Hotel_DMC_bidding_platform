package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.dto.DMCProfileRequest;
import com.hotel_bidding.backend.dto.DMCProfileResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface DMCProfileService {
    
    /**
     * Create or update DMC profile
     * @param userId User ID of the DMC
     * @param request DMC profile data
     * @param sltdaCertification SLTDA certification file (optional)
     * @return DMC profile response
     */
    DMCProfileResponse createOrUpdateProfile(
        String userId, 
        DMCProfileRequest request, 
        MultipartFile sltdaCertification
    ) throws IOException;
    
    /**
     * Get DMC profile by user ID
     * @param userId User ID
     * @return DMC profile response
     */
    DMCProfileResponse getProfileByUserId(String userId);
    
    /**
     * Check if DMC profile exists and is approved
     * @param userId User ID
     * @return true if profile exists and is approved
     */
    boolean isProfileApproved(String userId);
}
