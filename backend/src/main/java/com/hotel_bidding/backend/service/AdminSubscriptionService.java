package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.constants.SubscriptionStatus;
import com.hotel_bidding.backend.dto.response.SubscriptionResponse;
import com.hotel_bidding.backend.entity.Subscription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

/**
 * Admin service for subscription management
 */
public interface AdminSubscriptionService {
    
    /**
     * Get all subscriptions with pagination and filtering
     */
    Page<SubscriptionResponse> getAllSubscriptions(SubscriptionStatus status, String search, Pageable pageable);
    
    /**
     * Get subscription statistics for dashboard
     */
    Map<String, Object> getSubscriptionStatistics();
    
    /**
     * Manually extend subscription
     */
    Subscription extendSubscription(String subscriptionId, int days);
    
    /**
     * Manually cancel subscription
     */
    void cancelSubscription(String subscriptionId);
    
    /**
     * Get subscription by ID with user info
     */
    SubscriptionResponse getSubscriptionById(String subscriptionId);
}

