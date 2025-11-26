package com.hotel_bidding.backend.constants;

/**
 * Bidding workflow statuses
 */
public enum BiddingStatus {
    OPEN,               // Open for hotels to bid
    CLOSED,             // Bidding closed
    WINNER_SELECTED,    // DMC selected winner
    CANCELLED           // DMC cancelled the bidding
}
