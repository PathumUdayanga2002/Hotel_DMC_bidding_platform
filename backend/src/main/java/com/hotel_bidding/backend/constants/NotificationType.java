package com.hotel_bidding.backend.constants;

public enum NotificationType {
    NEW_INQUIRY,        // New inquiry posted (for hotels)
    NEW_BID,            // New bid received (for DMC)
    BID_ACCEPTED,       // Your bid was accepted (for hotel)
    BID_REJECTED,       // Your bid was rejected (for hotel)
    INQUIRY_CLOSED,     // Inquiry closed (for hotels that bid)
    INQUIRY_CANCELLED,  // Inquiry cancelled (for hotels that bid)
    DEADLINE_APPROACHING // 24 hours before deadline
}
