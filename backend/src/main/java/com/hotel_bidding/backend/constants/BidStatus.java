package com.hotel_bidding.backend.constants;

public enum BidStatus {
    PENDING,    // Bid submitted, waiting for DMC review
    ACCEPTED,   // DMC accepted this bid (winning bid)
    REJECTED,   // DMC rejected this bid
    WITHDRAWN   // Hotel withdrew their bid
}
