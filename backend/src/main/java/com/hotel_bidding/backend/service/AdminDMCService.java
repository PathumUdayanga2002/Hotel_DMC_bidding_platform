package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.constants.DMCProfileStatus;
import com.hotel_bidding.backend.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminDMCService {
    
    /**
     * Get paginated list of DMC profiles with filters
     * @param status Filter by status (optional)
     * @param search Search by company name or email (optional)
     * @param pageable Pagination and sorting
     * @return Page of DMC profile summaries
     */
    Page<DMCProfileSummary> getAllDMCProfiles(DMCProfileStatus status, String search, Pageable pageable);
    
    /**
     * Get detailed DMC profile by ID (for admin view)
     * @param profileId DMC profile ID
     * @return DMC profile with admin notes
     */
    DMCProfileResponse getDMCProfileById(String profileId);
    
    /**
     * Approve DMC profile
     * @param profileId DMC profile ID
     * @param adminId Admin user ID
     * @param adminUsername Admin username
     * @return Updated profile
     */
    DMCProfileResponse approveDMCProfile(String profileId, String adminId, String adminUsername);
    
    /**
     * Reject DMC profile
     * @param profileId DMC profile ID
     * @param reason Rejection reason
     * @param adminId Admin user ID
     * @param adminUsername Admin username
     * @return Updated profile
     */
    DMCProfileResponse rejectDMCProfile(String profileId, String reason, String adminId, String adminUsername);
    
    /**
     * Update DMC profile status
     * @param profileId DMC profile ID
     * @param request Status update request
     * @param adminId Admin user ID
     * @param adminUsername Admin username
     * @return Updated profile
     */
    DMCProfileResponse updateDMCStatus(String profileId, UpdateDMCStatusRequest request, String adminId, String adminUsername);
    
    /**
     * Add admin note to DMC profile
     * @param profileId DMC profile ID
     * @param request Admin note request
     * @param adminId Admin user ID
     * @param adminUsername Admin username
     * @return Updated profile
     */
    DMCProfileResponse addAdminNote(String profileId, AdminNoteRequest request, String adminId, String adminUsername);
    
    /**
     * Get statistics for DMC profiles
     * @return Stats (total, pending, approved, rejected, suspended)
     */
    DMCProfileStats getStats();
}
