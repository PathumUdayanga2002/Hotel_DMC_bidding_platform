package com.hotel_bidding.backend.constants;

/**
 * User account status
 */
public enum UserStatus {
    PENDING,      // Awaiting admin approval
    APPROVED,     // Approved and active
    REJECTED,     // Registration rejected
    SUSPENDED     // Temporarily suspended
}
