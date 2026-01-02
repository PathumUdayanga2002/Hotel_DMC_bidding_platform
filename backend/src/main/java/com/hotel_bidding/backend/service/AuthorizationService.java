package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.exception.UnauthorizedException;

/**
 * Comprehensive authorization service for role-based access control
 * 
 * This service provides fine-grained authorization checks for:
 * - Role-level checks (is user a specific role?)
 * - Stakeholder-level checks (does user belong to hotel/DMC?)
 * - Organizational boundary checks (can user access this organization?)
 */
public interface AuthorizationService {
    
    // ============================================
    // ROLE-LEVEL CHECKS (returns boolean)
    // ============================================
    
    /**
     * Check if user is platform super admin
     */
    boolean isPlatformSuperAdmin(String userId);
    
    /**
     * Check if user is hotel super admin
     */
    boolean isHotelSuperAdmin(String userId);
    
    /**
     * Check if user is hotel staff admin
     */
    boolean isHotelStaffAdmin(String userId);
    
    /**
     * Check if user is DMC super admin
     */
    boolean isDMCSuperAdmin(String userId);
    
    /**
     * Check if user is DMC staff admin
     */
    boolean isDMCStaffAdmin(String userId);
    
    // ============================================
    // STAKEHOLDER-LEVEL CHECKS (returns boolean)
    // ============================================
    
    /**
     * Check if user belongs to hotel (super admin or staff)
     */
    boolean isHotelUser(String userId);
    
    /**
     * Check if user belongs to DMC (super admin or staff)
     */
    boolean isDMCUser(String userId);
    
    /**
     * Check if user is any staff admin (not super admin)
     */
    boolean isAnyStaffAdmin(String userId);
    
    // ============================================
    // ENFORCEMENT METHODS (throws exception)
    // ============================================
    
    /**
     * Require user to be platform super admin
     * @throws UnauthorizedException if user is not PLATFORM_SUPER_ADMIN
     */
    void requirePlatformSuperAdmin(String userId) throws UnauthorizedException;
    
    /**
     * Require user to be hotel super admin
     * @throws UnauthorizedException if user is not HOTEL_SUPER_ADMIN
     */
    void requireHotelSuperAdmin(String userId) throws UnauthorizedException;
    
    /**
     * Require user to be hotel user (super or staff)
     * @throws UnauthorizedException if user is not HOTEL_SUPER_ADMIN or HOTEL_STAFF_ADMIN
     */
    void requireHotelAccess(String userId) throws UnauthorizedException;
    
    /**
     * Require user to be DMC super admin
     * @throws UnauthorizedException if user is not DMC_SUPER_ADMIN
     */
    void requireDMCSuperAdmin(String userId) throws UnauthorizedException;
    
    /**
     * Require user to be DMC user (super or staff)
     * @throws UnauthorizedException if user is not DMC_SUPER_ADMIN or DMC_STAFF_ADMIN
     */
    void requireDMCAccess(String userId) throws UnauthorizedException;
    
    /**
     * Verify user belongs to the same organization as target
     * @param userId User ID
     * @param targetOrganizationId Target organization ID (hotel ID or DMC ID)
     * @throws UnauthorizedException if user's organization != target organization
     */
    void requireSameOrganization(String userId, String targetOrganizationId) throws UnauthorizedException;
    
    /**
     * Verify user can access specific user in organization
     * @param userId User ID trying to access
     * @param targetUserId Target user ID to access
     * @throws UnauthorizedException if users are from different organizations
     */
    void requireSameOrganizationAsUser(String userId, String targetUserId) throws UnauthorizedException;
}
