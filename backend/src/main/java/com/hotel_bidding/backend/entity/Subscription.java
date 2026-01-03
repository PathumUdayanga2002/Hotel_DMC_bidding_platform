package com.hotel_bidding.backend.entity;

import com.hotel_bidding.backend.constants.SubscriptionPlan;
import com.hotel_bidding.backend.constants.SubscriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Subscription entity for platform access control
 * Manages free trial and paid subscriptions
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "subscriptions")
public class Subscription {
    
    @Id
    private String id;
    
    private String userId;
    
    private SubscriptionStatus status;
    
    private SubscriptionPlan plan;
    
    // Trial/Subscription period
    private LocalDateTime startDate;
    
    private LocalDateTime endDate;
    
    // PayHere payment details
    private String paymentId;           // PayHere order_id
    
    private String payherePaymentId;    // PayHere payment_id from webhook
    
    private Double amount;
    
    private String currency;
    
    // Auto-renewal settings
    private boolean autoRenew;
    
    // Audit fields
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private String createdBy;
    
    private String updatedBy;
    
    // Helper methods
    public boolean isActive() {
        return status == SubscriptionStatus.ACTIVE || status == SubscriptionStatus.TRIAL;
    }
    
    public boolean isExpired() {
        return endDate != null && LocalDateTime.now().isAfter(endDate);
    }
    
    public boolean isTrial() {
        return status == SubscriptionStatus.TRIAL;
    }
    
    public long getDaysRemaining() {
        if (endDate == null) return 0;
        long hours = java.time.Duration.between(LocalDateTime.now(), endDate).toHours();
        return hours / 24;
    }
}
