package com.hotel_bidding.backend.constants;

/**
 * Status enum for Hotel Profile approval workflow
 */
public enum HotelProfileStatus {
    PENDING,        // Initial submission, waiting for admin review
    UNDER_REVIEW,   // Admin is reviewing the profile
    APPROVED,       // Profile approved by admin
    REJECTED,       // Profile rejected by admin
    SUSPENDED       // Profile suspended by admin
}
