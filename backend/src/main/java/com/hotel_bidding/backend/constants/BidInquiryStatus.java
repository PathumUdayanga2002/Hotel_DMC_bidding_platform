package com.hotel_bidding.backend.constants;

/**
 * Bid Inquiry statuses (DMC posts inquiries, hotels bid)
 */
public enum BidInquiryStatus {
    OPEN,       // Hotels can bid (within 48 hours)
    CLOSED,     // Deadline passed or DMC closed it
    AWARDED,    // DMC selected a winning bid - payment in progress
    COMPLETED,  // Bid completed with successful payment
    CANCELLED   // DMC cancelled the inquiry
}
