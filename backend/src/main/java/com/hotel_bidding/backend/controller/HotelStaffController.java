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
 * Hotel Staff Management Controller
 * Only accessible by Hotel Super Admins
 */
@RestController
@RequestMapping("/hotel/staff")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${app.frontend.url:http://localhost:5173}", allowCredentials = "true")
public class HotelStaffController {
    
    private final StaffService staffService;
    private final com.hotel_bidding.backend.service.StaffAuthorizationService staffAuthorizationService;
    private final com.hotel_bidding.backend.service.AuthorizationService authorizationService;
    
    /**
     * Create a new staff member
     * POST /hotel/staff
     */
    @PostMapping
    @PreAuthorize("hasRole('HOTEL_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse> createStaff(
            @Valid @RequestBody CreateStaffRequest request,
            Authentication authentication) {
        
        log.info("Hotel creating staff member: {}", request.getEmail());
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String superAdminId = userDetails.getId();
        
        CreateStaffResponse response = staffService.createStaff(request, superAdminId);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Staff member created successfully")
                .data(response)
                .build());
    }
    
    /**
     * Get all staff members
     * GET /hotel/staff
     */
    @GetMapping
    @PreAuthorize("hasRole('HOTEL_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse> getAllStaff(Authentication authentication) {
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String superAdminId = userDetails.getId();
        log.info("Hotel fetching all staff - User ID: {}, Username: {}", superAdminId, userDetails.getUsername());
        
        List<StaffResponse> staffList = staffService.getAllStaff(superAdminId);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Staff list retrieved successfully")
                .data(staffList)
                .build());
    }
    
    /**
     * Get staff member by ID
     * GET /hotel/staff/{staffId}
     */
    @GetMapping("/{staffId}")
    @PreAuthorize("hasRole('HOTEL_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse> getStaffById(
            @PathVariable String staffId,
            Authentication authentication) {
        
        log.info("Hotel fetching staff by ID: {}", staffId);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String superAdminId = userDetails.getId();
        
        StaffResponse staff = staffService.getStaffById(staffId, superAdminId);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Staff member retrieved successfully")
                .data(staff)
                .build());
    }
    
    /**
     * Update staff member
     * PUT /hotel/staff/{staffId}
     */
    @PutMapping("/{staffId}")
    @PreAuthorize("hasRole('HOTEL_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse> updateStaff(
            @PathVariable String staffId,
            @Valid @RequestBody UpdateStaffRequest request,
            Authentication authentication) {
        
        log.info("Hotel updating staff: {}", staffId);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String superAdminId = userDetails.getId();
        
        StaffResponse staff = staffService.updateStaff(staffId, request, superAdminId);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Staff member updated successfully")
                .data(staff)
                .build());
    }
    
    /**
     * Toggle staff status (activate/deactivate)
     * PUT /hotel/staff/{staffId}/toggle-status
     */
    @PutMapping("/{staffId}/toggle-status")
    @PreAuthorize("hasRole('HOTEL_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse> toggleStaffStatus(
            @PathVariable String staffId,
            Authentication authentication) {
        
        log.info("Hotel toggling staff status: {}", staffId);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String superAdminId = userDetails.getId();
        
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
     * POST /hotel/staff/{staffId}/reset-password
     */
    @PostMapping("/{staffId}/reset-password")
    @PreAuthorize("hasRole('HOTEL_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse> resetStaffPassword(
            @PathVariable String staffId,
            Authentication authentication) {
        
        log.info("Hotel resetting password for staff: {}", staffId);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String superAdminId = userDetails.getId();
        
        String newPassword = staffService.resetStaffPassword(staffId, superAdminId);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Password reset successfully")
                .data(new PasswordResetResponse(newPassword))
                .build());
    }
    
    /**
     * Delete staff member
     * DELETE /hotel/staff/{staffId}
     */
    @DeleteMapping("/{staffId}")
    @PreAuthorize("hasRole('HOTEL_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse> deleteStaff(
            @PathVariable String staffId,
            Authentication authentication) {
        
        log.info("Hotel deleting staff: {}", staffId);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String superAdminId = userDetails.getId();
        
        staffService.deleteStaff(staffId, superAdminId);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Staff member deleted successfully")
                .build());
    }
    
    /**
     * Get staff count
     * GET /hotel/staff/count
     */
    @GetMapping("/count")
    @PreAuthorize("hasRole('HOTEL_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse> getStaffCount(Authentication authentication) {
        
        log.info("Hotel fetching staff count");
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String superAdminId = userDetails.getId();
        
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
