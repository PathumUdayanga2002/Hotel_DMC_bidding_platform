package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.constants.HotelProfileStatus;
import com.hotel_bidding.backend.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for admin hotel profile management
 */
public interface AdminHotelService {
    
    /**
     * Get all hotel profiles with optional filtering
     * @param status Optional status filter
     * @param search Optional search term (name or email)
     * @param pageable Pagination information
     * @return Paginated list of hotel profile summaries
     */
    Page<HotelProfileSummary> getAllHotelProfiles(HotelProfileStatus status, String search, Pageable pageable);
    
    /**
     * Get hotel profile by ID with complete details
     * @param profileId Hotel profile ID
     * @return Complete hotel profile response
     */
    HotelProfileResponse getHotelProfileById(String profileId);
    
    /**
     * Approve hotel profile
     * @param profileId Hotel profile ID
     * @param adminId Admin user ID
     * @param adminUsername Admin username
     * @return Updated hotel profile response
     */
    HotelProfileResponse approveHotelProfile(String profileId, String adminId, String adminUsername);
    
    /**
     * Reject hotel profile
     * @param profileId Hotel profile ID
     * @param reason Rejection reason
     * @param adminId Admin user ID
     * @param adminUsername Admin username
     * @return Updated hotel profile response
     */
    HotelProfileResponse rejectHotelProfile(String profileId, String reason, String adminId, String adminUsername);
    
    /**
     * Update hotel profile status
     * @param profileId Hotel profile ID
     * @param request Status update request
     * @param adminId Admin user ID
     * @param adminUsername Admin username
     * @return Updated hotel profile response
     */
    HotelProfileResponse updateHotelStatus(String profileId, UpdateHotelStatusRequest request, 
                                           String adminId, String adminUsername);
    
    /**
     * Add admin note to hotel profile
     * @param profileId Hotel profile ID
     * @param request Admin note request
     * @param adminId Admin user ID
     * @param adminUsername Admin username
     * @return Updated hotel profile response
     */
    HotelProfileResponse addAdminNote(String profileId, HotelAdminNoteRequest request, 
                                      String adminId, String adminUsername);
    
    /**
     * Get hotel profile statistics
     * @return Hotel profile statistics
     */
    HotelProfileStats getStats();
}
