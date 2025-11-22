package com.hotel_bidding.backend.constants;

/**
 * Payment status enumeration
 */
public enum PaymentStatus {
    PENDING,        // Payment initiated, waiting for PayHere response
    PROCESSING,     // Payment being processed by PayHere
    COMPLETED,      // Payment successful, funds received
    FAILED,         // Payment failed
    CANCELLED,      // Payment cancelled (timeout or manual)
    REFUNDED        // Payment refunded
}
