package com.hotel_bidding.backend.constants;

/**
 * Subscription status for platform users
 */
public enum SubscriptionStatus {
    TRIAL,      // Free 30-day trial period
    ACTIVE,     // Paid subscription active
    EXPIRED,    // Subscription expired - user needs to renew
    CANCELLED   // User cancelled subscription
}
