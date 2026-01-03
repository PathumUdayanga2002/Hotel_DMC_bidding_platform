package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.constants.SubscriptionPlan;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.entity.Subscription;
import com.hotel_bidding.backend.entity.PaymentHistory;
import com.hotel_bidding.backend.repository.PaymentHistoryRepository;
import com.hotel_bidding.backend.security.UserDetailsImpl;
import com.hotel_bidding.backend.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for subscription management
 * Handles trial subscriptions, paid subscriptions, and PayHere integration
 */
@RestController
@RequestMapping("/subscription")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('DMC_USER', 'DMC_SUPER_ADMIN', 'DMC_STAFF_ADMIN', 'HOTEL_USER', 'HOTEL_SUPER_ADMIN', 'HOTEL_STAFF_ADMIN')")
public class SubscriptionController {
    
    private final SubscriptionService subscriptionService;
    private final PaymentHistoryRepository paymentHistoryRepository;
    
    /**
     * Get current subscription status for authenticated user
     * Returns special status for users without subscription (pending profile approval)
     */
    @GetMapping("/status")
    public ResponseEntity<ApiResponse> getSubscriptionStatus(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            Subscription subscription = subscriptionService.getSubscriptionByUserId(userDetails.getId());
            
            Map<String, Object> statusData = new HashMap<>();
            statusData.put("status", subscription.getStatus());
            statusData.put("plan", subscription.getPlan());
            statusData.put("startDate", subscription.getStartDate());
            statusData.put("endDate", subscription.getEndDate());
            statusData.put("daysRemaining", subscription.getDaysRemaining());
            statusData.put("isActive", subscription.isActive());
            statusData.put("isTrial", subscription.isTrial());
            statusData.put("isExpired", subscription.isExpired());
            
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("Subscription status retrieved successfully")
                    .data(statusData)
                    .build());
        } catch (Exception e) {
            log.info("No subscription found for user: {} - pending profile approval", userDetails.getId());
            
            // Return a special status for users without subscription (pending approval)
            Map<String, Object> pendingData = new HashMap<>();
            pendingData.put("status", "PENDING_APPROVAL");
            pendingData.put("plan", null);
            pendingData.put("startDate", null);
            pendingData.put("endDate", null);
            pendingData.put("daysRemaining", 0);
            pendingData.put("isActive", false);
            pendingData.put("isTrial", false);
            pendingData.put("isExpired", false);
            pendingData.put("isPendingApproval", true);
            pendingData.put("message", "Complete your profile and wait for admin approval. Your 30-day free trial will start once approved!");
            
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("Profile pending approval - trial not started yet")
                    .data(pendingData)
                    .build());
        }
    }
    
    /**
     * Initialize payment for subscription purchase
     */
    @PostMapping("/purchase")
    public ResponseEntity<ApiResponse> purchaseSubscription(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam SubscriptionPlan plan) {
        
        log.info("User {} initiating {} subscription purchase", userDetails.getUsername(), plan);
        
        try {
            Map<String, Object> paymentData = subscriptionService.initializeSubscriptionPayment(userDetails.getId(), plan);
            
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("Payment initialized successfully")
                    .data(paymentData)
                    .build());
        } catch (Exception e) {
            log.error("Error initializing subscription payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.builder()
                            .success(false)
                            .message("Failed to initialize payment: " + e.getMessage())
                            .build());
        }
    }
    
    /**
     * PayHere webhook endpoint for payment verification
     * This endpoint is called by PayHere after payment completion
     */
    @PostMapping("/payhere-notify")
    public ResponseEntity<String> payhereNotify(@RequestParam Map<String, String> payhereData) {
        log.info("Received PayHere notification: {}", payhereData);
        
        try {
            subscriptionService.verifyAndActivateSubscription(payhereData);
            return ResponseEntity.ok("SUCCESS");
        } catch (Exception e) {
            log.error("Error processing PayHere notification", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("FAILED");
        }
    }
    
    /**
     * Cancel subscription
     */
    @PostMapping("/cancel")
    public ResponseEntity<ApiResponse> cancelSubscription(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.info("User {} cancelling subscription", userDetails.getUsername());
        
        try {
            subscriptionService.cancelSubscription(userDetails.getId());
            
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("Subscription cancelled successfully")
                    .build());
        } catch (Exception e) {
            log.error("Error cancelling subscription", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.builder()
                            .success(false)
                            .message("Failed to cancel subscription: " + e.getMessage())
                            .build());
        }
    }
    
    /**
     * Get subscription plans with pricing
     */
    @GetMapping("/plans")
    public ResponseEntity<ApiResponse> getPlans() {
        Map<String, Object> plans = new HashMap<>();
        
        Map<String, Object> monthly = new HashMap<>();
        monthly.put("name", "MONTHLY");
        monthly.put("price", SubscriptionPlan.MONTHLY.getPrice());
        monthly.put("duration", SubscriptionPlan.MONTHLY.getDurationDays());
        monthly.put("durationLabel", "30 days");
        
        Map<String, Object> yearly = new HashMap<>();
        yearly.put("name", "YEARLY");
        yearly.put("price", SubscriptionPlan.YEARLY.getPrice());
        yearly.put("duration", SubscriptionPlan.YEARLY.getDurationDays());
        yearly.put("durationLabel", "365 days");
        yearly.put("savings", "Save $400 per year!");
        
        plans.put("monthly", monthly);
        plans.put("yearly", yearly);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Subscription plans retrieved successfully")
                .data(plans)
                .build());
    }
    
    /**
     * Get payment history for authenticated user
     */
    @GetMapping("/payment-history")
    public ResponseEntity<ApiResponse> getPaymentHistory(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.info("Fetching payment history for user: {}", userDetails.getId());
        
        try {
            List<PaymentHistory> history = paymentHistoryRepository.findByUserIdOrderByPaymentDateDesc(userDetails.getId());
            
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("Payment history retrieved successfully")
                    .data(history)
                    .build());
        } catch (Exception e) {
            log.error("Error fetching payment history", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.builder()
                            .success(false)
                            .message("Failed to fetch payment history")
                            .build());
        }
    }
}
