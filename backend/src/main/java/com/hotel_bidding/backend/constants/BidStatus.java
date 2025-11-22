package com.hotel_bidding.backend.constants;

public enum BidStatus {
    SUBMITTED,  // Bid submitted, waiting for DMC review (alias for PENDING)
    PENDING,    // Bid submitted, waiting for DMC review
    AWARDED,    // DMC awarded this bid (winning bid) - payment in progress
    ACCEPTED,   // DMC accepted this bid (winning bid) - completed with payment
    REJECTED,   // DMC rejected this bid
    WITHDRAWN   // Hotel withdrew their bid
}
