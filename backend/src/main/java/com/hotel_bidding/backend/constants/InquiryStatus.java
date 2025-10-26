package com.hotel_bidding.backend.constants;

/**
 * Inquiry workflow statuses
 */
public enum InquiryStatus {
    PENDING,                    // Initial state
    WISH_OFFERED,              // Hotel offered Wish rate
    NEGOTIATION_REQUESTED,     // DMC requested better rate
    WANT_OFFERED,              // Hotel offered Want rate
    WANT_ACCEPTED,             // DMC accepted Want rate
    WALK_OFFERED,              // Hotel offered Walk rate (final)
    WALK_ACCEPTED,             // DMC accepted Walk rate
    PAYMENT_PENDING,           // Awaiting payment
    CONFIRMED,                 // Booking confirmed
    CANCELLED                  // Cancelled by either party
}
