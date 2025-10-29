package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.dto.ApprovalRequestDTO;
import com.hotel_bidding.backend.dto.DashboardStatsDTO;
import com.hotel_bidding.backend.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @GetMapping("/pending-approvals")
    public ResponseEntity<List<ApprovalRequestDTO>> getPendingApprovals() {
        return ResponseEntity.ok(dashboardService.getPendingApprovals());
    }

    @PutMapping("/approval-request")
    public ResponseEntity<Void> updateApprovalRequest(@RequestBody ApprovalRequestDTO request) {
        dashboardService.updateApprovalRequest(request);
        return ResponseEntity.ok().build();
    }
}
