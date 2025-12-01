package com.hotel_bidding.backend.constants;

/**
 * Activity types for audit logging
 */
public enum ActivityType {
    // Authentication
    LOGIN,
    LOGOUT,
    
    // Staff Management
    STAFF_CREATED,
    STAFF_UPDATED,
    STAFF_ACTIVATED,
    STAFF_DEACTIVATED,
    
    // DMC Actions
    INQUIRY_CREATED,
    INQUIRY_UPDATED,
    INQUIRY_CLOSED,
    BID_AWARDED,
    
    // Hotel Actions
    BID_SUBMITTED,
    BID_UPDATED,
    BID_ACCEPTED,
    BID_REJECTED,
    
    // Payment Actions
    PAYMENT_INITIATED,
    PAYMENT_COMPLETED,
    PAYMENT_FAILED,
    
    // Profile Actions
    PROFILE_UPDATED,
    BANK_DETAILS_UPDATED
}
