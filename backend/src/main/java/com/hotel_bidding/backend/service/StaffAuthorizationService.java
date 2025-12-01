package com.hotel_bidding.backend.service;

/**
 * Service for handling staff authorization checks
 */
public interface StaffAuthorizationService {
    
    /**
     * Check if the current user is a super admin
     * @param userId User ID to check
     * @return true if super admin, false if staff
     */
    boolean isSuperAdmin(String userId);
    
    /**
     * Check if the current user is staff
     * @param userId User ID to check
     * @return true if staff, false if super admin
     */
    boolean isStaff(String userId);
    
    /**
     * Verify that the current user is a super admin, throw exception if not
     * @param userId User ID to check
     * @throws com.hotel_bidding.backend.exception.UnauthorizedException if user is staff
     */
    void requireSuperAdmin(String userId);
    
    /**
     * Check if staff has permission for a specific endpoint
     * Staff are blocked from: profile management, analytics, staff management
     * @param userId User ID to check
     * @param endpoint Endpoint being accessed (e.g., "/dmc/profile", "/dmc/analytics", "/dmc/staff")
     * @return true if allowed, false if blocked
     */
    boolean hasEndpointPermission(String userId, String endpoint);
}
