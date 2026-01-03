package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.constants.SubscriptionPlan;
import com.hotel_bidding.backend.entity.Subscription;

import java.util.Map;

/**
 * Service interface for subscription management
 */
public interface SubscriptionService {
    
    /**
     * Create 30-day free trial subscription for newly approved users
     */
    Subscription createTrialSubscription(String userId);
    
    /**
     * Get subscription status for a user
     */
    Subscription getSubscriptionByUserId(String userId);
    
    /**
     * Check if user has active subscription (trial or paid)
     */
    boolean hasActiveSubscription(String userId);
    
    /**
     * Initialize payment order for subscription purchase
     * Returns PayHere order details
     */
    Map<String, Object> initializeSubscriptionPayment(String userId, SubscriptionPlan plan);
    
    /**
     * Verify PayHere payment and activate subscription
     */
    Subscription verifyAndActivateSubscription(Map<String, String> payhereData);
    
    /**
     * Cancel subscription
     */
    void cancelSubscription(String userId);
    
    /**
     * Check and expire subscriptions (scheduled task)
     */
    void expireSubscriptions();
    
    /**
     * Get days remaining in current subscription
     */
    long getDaysRemaining(String userId);
}
