package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.dto.ApprovalActionRequest;
import com.hotel_bidding.backend.dto.PendingApprovalDTO;
import com.hotel_bidding.backend.dto.UserManagementStatsDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface UserManagementService {
    
    /**
     * Get user management statistics
     */
    UserManagementStatsDTO getUserManagementStats();
    
    /**
     * Get all pending approvals (both hotels and DMCs)
     */
    Page<PendingApprovalDTO> getPendingApprovals(Pageable pageable);
    
    /**
     * Get pending approval details by ID and type
     */
    PendingApprovalDTO getPendingApprovalById(String id, String type);
    
    /**
     * Process approval action (approve/reject)
     */
    Map<String, Object> processApprovalAction(
            String id, 
            String type, 
            ApprovalActionRequest request,
            String adminId,
            String adminUsername
    );
}
