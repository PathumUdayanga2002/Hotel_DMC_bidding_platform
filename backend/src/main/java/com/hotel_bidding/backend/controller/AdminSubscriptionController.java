package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.constants.SubscriptionStatus;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.dto.response.SubscriptionResponse;
import com.hotel_bidding.backend.entity.Subscription;
import com.hotel_bidding.backend.service.AdminSubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Admin controller for subscription management
 */
@RestController
@RequestMapping("/admin/subscriptions")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('ADMIN', 'PLATFORM_SUPER_ADMIN')")
public class AdminSubscriptionController {
    
    private final AdminSubscriptionService adminSubscriptionService;
    
    /**
     * Get all subscriptions with pagination and filtering
     */
    @GetMapping
    public ResponseEntity<ApiResponse> getAllSubscriptions(
            @RequestParam(required = false) SubscriptionStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        log.info("Admin fetching subscriptions - status: {}, search: {}", status, search);
        
        Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<SubscriptionResponse> subscriptions = adminSubscriptionService.getAllSubscriptions(status, search, pageable);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Subscriptions retrieved successfully")
                .data(subscriptions)
                .build());
    }
    
    /**
     * Get subscription statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse> getStatistics() {
        log.info("Admin fetching subscription statistics");
        
        Map<String, Object> stats = adminSubscriptionService.getSubscriptionStatistics();
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Statistics retrieved successfully")
                .data(stats)
                .build());
    }
    
    /**
     * Get subscription by ID
     */
    @GetMapping("/{subscriptionId}")
    public ResponseEntity<ApiResponse> getSubscriptionById(@PathVariable String subscriptionId) {
        log.info("Admin fetching subscription: {}", subscriptionId);
        
        SubscriptionResponse subscription = adminSubscriptionService.getSubscriptionById(subscriptionId);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Subscription retrieved successfully")
                .data(subscription)
                .build());
    }
    
    /**
     * Extend subscription
     */
    @PostMapping("/{subscriptionId}/extend")
    public ResponseEntity<ApiResponse> extendSubscription(
            @PathVariable String subscriptionId,
            @RequestParam int days) {
        
        log.info("Admin extending subscription {} by {} days", subscriptionId, days);
        
        Subscription updated = adminSubscriptionService.extendSubscription(subscriptionId, days);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Subscription extended successfully")
                .data(updated)
                .build());
    }
    
    /**
     * Cancel subscription
     */
    @PostMapping("/{subscriptionId}/cancel")
    public ResponseEntity<ApiResponse> cancelSubscription(@PathVariable String subscriptionId) {
        log.info("Admin cancelling subscription: {}", subscriptionId);
        
        adminSubscriptionService.cancelSubscription(subscriptionId);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Subscription cancelled successfully")
                .build());
    }
}
