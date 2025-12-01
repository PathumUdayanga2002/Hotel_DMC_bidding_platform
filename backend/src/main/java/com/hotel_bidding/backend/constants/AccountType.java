package com.hotel_bidding.backend.constants;

/**
 * Account type to differentiate between Super Admin and Staff
 */
public enum AccountType {
    SUPER_ADMIN,  // Original registered user (owner)
    STAFF         // Staff member added by super admin
}
