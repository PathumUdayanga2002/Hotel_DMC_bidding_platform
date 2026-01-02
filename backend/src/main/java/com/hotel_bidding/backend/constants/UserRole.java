package com.hotel_bidding.backend.constants;

/**
 * User roles with explicit stakeholder and level information
 * 
 * Hierarchy:
 * - PLATFORM_SUPER_ADMIN: Full platform control
 * - HOTEL_SUPER_ADMIN: Full hotel control
 * - HOTEL_STAFF_ADMIN: Limited hotel access
 * - DMC_SUPER_ADMIN: Full DMC control
 * - DMC_STAFF_ADMIN: Limited DMC access
 * 
 * Legacy (deprecated - for backward compatibility):
 * - HOTEL_USER: Will be migrated to HOTEL_SUPER_ADMIN or HOTEL_STAFF_ADMIN
 * - DMC_USER: Will be migrated to DMC_SUPER_ADMIN or DMC_STAFF_ADMIN
 * - ADMIN: Will be migrated to PLATFORM_SUPER_ADMIN
 */
public enum UserRole {
    // Platform Level (1 role)
    PLATFORM_SUPER_ADMIN,      // Full platform access - controls settings, analytics, approvals
    
    // Hotel Level (2 roles)
    HOTEL_SUPER_ADMIN,         // Hotel owner - full hotel control, can create staff
    HOTEL_STAFF_ADMIN,         // Hotel staff - limited hotel access, cannot create staff
    
    // DMC Level (2 roles)
    DMC_SUPER_ADMIN,           // DMC owner - full DMC control, can create staff
    DMC_STAFF_ADMIN,           // DMC staff - limited DMC access, cannot create staff
    
    // Legacy Roles (deprecated - kept for backward compatibility)
    @Deprecated
    HOTEL_USER,                // Deprecated: Use HOTEL_SUPER_ADMIN or HOTEL_STAFF_ADMIN
    @Deprecated
    DMC_USER,                  // Deprecated: Use DMC_SUPER_ADMIN or DMC_STAFF_ADMIN
    @Deprecated
    ADMIN                       // Deprecated: Use PLATFORM_SUPER_ADMIN
}
