package com.hotel_bidding.backend.constants;

public enum NotificationType {
    // Existing bid/inquiry notifications
    NEW_INQUIRY,        // New inquiry posted (for hotels)
    NEW_BID,            // New bid received (for DMC)
    BID_ACCEPTED,       // Your bid was accepted (for hotel)
    BID_REJECTED,       // Your bid was rejected (for hotel)
    INQUIRY_CLOSED,     // Inquiry closed (for hotels that bid)
    INQUIRY_CANCELLED,  // Inquiry cancelled (for hotels that bid)
    DEADLINE_APPROACHING, // 24 hours before deadline
    
    // Hotel-specific notifications
    HOTEL_PROFILE_APPROVED,      // Hotel profile approved by admin
    HOTEL_PROFILE_REJECTED,      // Hotel profile rejected by admin
    DIRECT_INQUIRY_CREATED,      // Direct inquiry created confirmation
    DIRECT_INQUIRY_UPDATED,      // Direct inquiry updated
    PROPOSAL_RECEIVED,           // Proposal received from DMC
    PROPOSAL_ACCEPTED,           // Your proposal was accepted
    PROPOSAL_REJECTED,           // Your proposal was rejected
    HOTEL_STAFF_ADDED,           // New staff member added
    HOTEL_STAFF_REMOVED,         // Staff member removed
    BID_STATUS_UPDATED,          // Bid status changed
    
    // DMC-specific notifications
    DMC_PROFILE_APPROVED,        // DMC profile approved by admin
    DMC_PROFILE_REJECTED,        // DMC profile rejected by admin
    DMC_ACCOUNT_ACTIVATED,       // DMC account activated by admin
    DMC_ACCOUNT_SUSPENDED,       // DMC account suspended by admin
    DMC_ACCOUNT_DEACTIVATED,     // DMC account deactivated by admin
    INQUIRY_RECEIVED,            // New inquiry received (for DMC)
    INQUIRY_UPDATED,             // Inquiry updated notification
    CONTRACT_RECEIVED,           // Contract received from hotel
    CONTRACT_SIGNED,             // Contract signed notification
    DMC_STAFF_ADDED,             // New staff member added
    DMC_STAFF_REMOVED,           // Staff member removed
    
    // Messaging notifications
    MESSAGE_RECEIVED,            // New message received
    MESSAGE_SENT,                // Message sent confirmation
    MESSAGE_FAILED,              // Message delivery failed
    
    // Admin notifications
    USER_REGISTRATION,           // New user registered (for admin)
    DMC_REGISTRATION,            // New DMC registered (for admin)
    HOTEL_REGISTRATION,          // New hotel registered (for admin)
    PROFILE_SUBMITTED,           // New profile submitted for review (for admin)
    PAYMENT_RECEIVED,            // Payment received notification
    SUBSCRIPTION_EXPIRED,        // Subscription expired warning
    SUBSCRIPTION_RENEWED,        // Subscription renewed confirmation
    
    // Platform offer notifications (admin to users)
    PLATFORM_OFFER,              // Platform offer/announcement from admin
    PLATFORM_ANNOUNCEMENT        // Important platform announcements
}
