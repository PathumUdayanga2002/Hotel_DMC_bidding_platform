package com.hotel_bidding.backend.dto.response;

import com.hotel_bidding.backend.constants.SubscriptionPlan;
import com.hotel_bidding.backend.constants.SubscriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for subscription responses with user information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionResponse {
    
    private String id;
    private String userId;
    private SubscriptionStatus status;
    private SubscriptionPlan plan;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String paymentId;
    private String payherePaymentId;
    private Double amount;
    private String currency;
    private boolean autoRenew;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // User information
    private UserInfo user;
    
    // Computed fields
    private boolean isExpired;
    private boolean isTrial;
    private long daysRemaining;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserInfo {
        private String id;
        private String username;
        private String email;
        private String fullName;
        private String role;
        private boolean approved;
    }
}
