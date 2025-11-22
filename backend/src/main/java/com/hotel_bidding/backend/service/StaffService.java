package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.dto.request.CreateStaffRequest;
import com.hotel_bidding.backend.dto.request.UpdateStaffRequest;
import com.hotel_bidding.backend.dto.response.CreateStaffResponse;
import com.hotel_bidding.backend.dto.response.StaffResponse;

import java.util.List;

/**
 * Service interface for staff management
 */
public interface StaffService {
    
    /**
     * Create a new staff member
     */
    CreateStaffResponse createStaff(CreateStaffRequest request, String superAdminId);
    
    /**
     * Get all staff members for a super admin
     */
    List<StaffResponse> getAllStaff(String superAdminId);
    
    /**
     * Get staff member by ID
     */
    StaffResponse getStaffById(String staffId, String superAdminId);
    
    /**
     * Update staff member details
     */
    StaffResponse updateStaff(String staffId, UpdateStaffRequest request, String superAdminId);
    
    /**
     * Toggle staff active status
     */
    StaffResponse toggleStaffStatus(String staffId, String superAdminId);
    
    /**
     * Delete staff member
     */
    void deleteStaff(String staffId, String superAdminId);
    
    /**
     * Reset staff password
     */
    String resetStaffPassword(String staffId, String superAdminId);
    
    /**
     * Get staff count for super admin
     */
    Long getStaffCount(String superAdminId);
}
