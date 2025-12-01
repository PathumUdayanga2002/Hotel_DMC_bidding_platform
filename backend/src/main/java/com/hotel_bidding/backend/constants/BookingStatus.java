package com.hotel_bidding.backend.constants;

/**
 * Booking lifecycle statuses
 */
public enum BookingStatus {
    PAYMENT_PENDING,    // Awaiting payment
    CONFIRMED,          // Payment successful, booking confirmed
    CHECKED_IN,         // Guest checked in
    CHECKED_OUT,        // Guest checked out
    COMPLETED,          // Stay completed, ready for review
    CANCELLED,          // Cancelled
    REFUNDED            // Payment refunded
}
