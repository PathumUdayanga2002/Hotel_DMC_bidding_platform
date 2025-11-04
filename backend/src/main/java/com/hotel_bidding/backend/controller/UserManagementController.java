package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.dto.ApprovalActionRequest;
import com.hotel_bidding.backend.dto.PendingApprovalDTO;
import com.hotel_bidding.backend.dto.UserManagementStatsDTO;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.security.UserDetailsImpl;
import com.hotel_bidding.backend.service.UserManagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/admin/user-management")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserManagementController {

    private final UserManagementService userManagementService;

    /**
     * Get user management statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse> getUserManagementStats() {
        log.info("Fetching user management statistics");
        
        UserManagementStatsDTO stats = userManagementService.getUserManagementStats();

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("User management statistics retrieved successfully")
                .data(stats)
                .build());
    }

    /**
     * Get all pending approvals
     */
    @GetMapping("/pending-approvals")
    public ResponseEntity<ApiResponse> getPendingApprovals(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appliedDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection
    ) {
        log.info("Fetching pending approvals - Page: {}, Size: {}", page, size);

        Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<PendingApprovalDTO> pendingApprovals = userManagementService.getPendingApprovals(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("approvals", pendingApprovals.getContent());
        response.put("currentPage", pendingApprovals.getNumber());
        response.put("totalPages", pendingApprovals.getTotalPages());
        response.put("totalElements", pendingApprovals.getTotalElements());
        response.put("hasNext", pendingApprovals.hasNext());
        response.put("hasPrevious", pendingApprovals.hasPrevious());

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Pending approvals retrieved successfully")
                .data(response)
                .build());
    }

    /**
     * Get pending approval details by ID
     */
    @GetMapping("/pending-approvals/{id}")
    public ResponseEntity<ApiResponse> getPendingApprovalById(
            @PathVariable String id,
            @RequestParam String type
    ) {
        log.info("Fetching pending approval details - ID: {}, Type: {}", id, type);

        PendingApprovalDTO approval = userManagementService.getPendingApprovalById(id, type);

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Pending approval details retrieved successfully")
                .data(approval)
                .build());
    }

    /**
     * Process approval action (approve/reject)
     */
    @PostMapping("/pending-approvals/{id}/action")
    public ResponseEntity<ApiResponse> processApprovalAction(
            @PathVariable String id,
            @RequestParam String type,
            @Valid @RequestBody ApprovalActionRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        log.info("Processing approval action - ID: {}, Type: {}, Action: {}", id, type, request.getAction());

        Map<String, Object> result = userManagementService.processApprovalAction(
                id,
                type,
                request,
                userDetails.getId(),
                userDetails.getUsername()
        );

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message((String) result.get("message"))
                .data(result)
                .build());
    }
}
