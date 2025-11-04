package com.hotel_bidding.backend.constants;

/**
 * Payout status enumeration for hotel payments
 */
public enum PayoutStatus {
    PENDING,        // Waiting for admin approval
    APPROVED,       // Admin approved, ready to process
    PROCESSING,     // Payout being processed via PayHere
    PAID,           // Successfully paid to hotel
    FAILED,         // Payout failed
    CANCELLED       // Payout cancelled
}
