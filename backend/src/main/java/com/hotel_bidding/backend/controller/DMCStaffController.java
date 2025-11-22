package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.dto.request.CreateStaffRequest;
import com.hotel_bidding.backend.dto.request.UpdateStaffRequest;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.dto.response.CreateStaffResponse;
import com.hotel_bidding.backend.dto.response.StaffResponse;
import com.hotel_bidding.backend.security.UserDetailsImpl;
import com.hotel_bidding.backend.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * DMC Staff Management Controller
 * Only accessible by DMC Super Admins
 */
@RestController
@RequestMapping("/dmc/staff")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${app.frontend.url:http://localhost:5173}", allowCredentials = "true")
public class DMCStaffController {
    
    private final StaffService staffService;
    private final com.hotel_bidding.backend.service.StaffAuthorizationService staffAuthorizationService;
    
    /**
     * Create a new staff member
     * POST /dmc/staff
     */
    @PostMapping
    @PreAuthorize("hasRole('DMC_USER')")
    public ResponseEntity<ApiResponse> createStaff(
            @Valid @RequestBody CreateStaffRequest request,
            Authentication authentication) {
        
        log.info("DMC creating staff member: {}", request.getEmail());
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String superAdminId = userDetails.getId();
        
        // Only super admins can create staff
        staffAuthorizationService.requireSuperAdmin(superAdminId);
        
        CreateStaffResponse response = staffService.createStaff(request, superAdminId);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Staff member created successfully")
                .data(response)
                .build());
    }
    
    /**
     * Get all staff members
     * GET /dmc/staff
     */
    @GetMapping
    @PreAuthorize("hasRole('DMC_USER')")
    public ResponseEntity<ApiResponse> getAllStaff(Authentication authentication) {
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String superAdminId = userDetails.getId();
        log.info("DMC fetching all staff - User ID: {}, Username: {}", superAdminId, userDetails.getUsername());
        
        // Only super admins can view staff
        staffAuthorizationService.requireSuperAdmin(superAdminId);
        
        List<StaffResponse> staffList = staffService.getAllStaff(superAdminId);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Staff list retrieved successfully")
                .data(staffList)
                .build());
    }
    
    /**
     * Get staff member by ID
     * GET /dmc/staff/{staffId}
     */
    @GetMapping("/{staffId}")
    @PreAuthorize("hasRole('DMC_USER')")
    public ResponseEntity<ApiResponse> getStaffById(
            @PathVariable String staffId,
            Authentication authentication) {
        
        log.info("DMC fetching staff by ID: {}", staffId);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String superAdminId = userDetails.getId();
        
        // Only super admins can view staff
        staffAuthorizationService.requireSuperAdmin(superAdminId);
        
        StaffResponse staff = staffService.getStaffById(staffId, superAdminId);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Staff member retrieved successfully")
                .data(staff)
                .build());
    }
    
    /**
     * Update staff member
     * PUT /dmc/staff/{staffId}
     */
    @PutMapping("/{staffId}")
    @PreAuthorize("hasRole('DMC_USER')")
    public ResponseEntity<ApiResponse> updateStaff(
            @PathVariable String staffId,
            @Valid @RequestBody UpdateStaffRequest request,
            Authentication authentication) {
        
        log.info("DMC updating staff: {}", staffId);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String superAdminId = userDetails.getId();
        
        // Only super admins can update staff
        staffAuthorizationService.requireSuperAdmin(superAdminId);
        
        StaffResponse staff = staffService.updateStaff(staffId, request, superAdminId);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Staff member updated successfully")
                .data(staff)
                .build());
    }
    
    /**
     * Toggle staff status (activate/deactivate)
     * PUT /dmc/staff/{staffId}/toggle-status
     */
    @PutMapping("/{staffId}/toggle-status")
    @PreAuthorize("hasRole('DMC_USER')")
    public ResponseEntity<ApiResponse> toggleStaffStatus(
            @PathVariable String staffId,
            Authentication authentication) {
        
        log.info("DMC toggling staff status: {}", staffId);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String superAdminId = userDetails.getId();
        
        // Only super admins can toggle staff status
        staffAuthorizationService.requireSuperAdmin(superAdminId);
        
        StaffResponse staff = staffService.toggleStaffStatus(staffId, superAdminId);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message(String.format("Staff member %s successfully", 
                        staff.getIsActive() ? "activated" : "deactivated"))
                .data(staff)
                .build());
    }
    
    /**
     * Reset staff password
     * POST /dmc/staff/{staffId}/reset-password
     */
    @PostMapping("/{staffId}/reset-password")
    @PreAuthorize("hasRole('DMC_USER')")
    public ResponseEntity<ApiResponse> resetStaffPassword(
            @PathVariable String staffId,
            Authentication authentication) {
        
        log.info("DMC resetting password for staff: {}", staffId);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String superAdminId = userDetails.getId();
        
        // Only super admins can reset passwords
        staffAuthorizationService.requireSuperAdmin(superAdminId);
        
        String newPassword = staffService.resetStaffPassword(staffId, superAdminId);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Password reset successfully")
                .data(new PasswordResetResponse(newPassword))
                .build());
    }
    
    /**
     * Delete staff member
     * DELETE /dmc/staff/{staffId}
     */
    @DeleteMapping("/{staffId}")
    @PreAuthorize("hasRole('DMC_USER')")
    public ResponseEntity<ApiResponse> deleteStaff(
            @PathVariable String staffId,
            Authentication authentication) {
        
        log.info("DMC deleting staff: {}", staffId);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String superAdminId = userDetails.getId();
        
        // Only super admins can delete staff
        staffAuthorizationService.requireSuperAdmin(superAdminId);
        
        staffService.deleteStaff(staffId, superAdminId);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Staff member deleted successfully")
                .build());
    }
    
    /**
     * Get staff count
     * GET /dmc/staff/count
     */
    @GetMapping("/count")
    @PreAuthorize("hasRole('DMC_USER')")
    public ResponseEntity<ApiResponse> getStaffCount(Authentication authentication) {
        
        log.info("DMC fetching staff count");
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String superAdminId = userDetails.getId();
        
        // Only super admins can view staff count
        staffAuthorizationService.requireSuperAdmin(superAdminId);
        
        Long count = staffService.getStaffCount(superAdminId);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Staff count retrieved successfully")
                .data(new StaffCountResponse(count))
                .build());
    }
    
    // Inner classes for simple responses
    private record PasswordResetResponse(String newPassword) {}
    private record StaffCountResponse(Long count) {}
}
