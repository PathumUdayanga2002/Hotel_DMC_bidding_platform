package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.constants.UserRole;
import com.hotel_bidding.backend.entity.User;
import com.hotel_bidding.backend.exception.UnauthorizedException;
import com.hotel_bidding.backend.repository.UserRepository;
import com.hotel_bidding.backend.service.AuthorizationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Implementation of AuthorizationService
 * Handles role-based and organization-based authorization checks
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthorizationServiceImpl implements AuthorizationService {
    
    private final UserRepository userRepository;
    
    // ============================================
    // HELPER METHOD
    // ============================================
    
    private User getUserOrThrow(String userId) throws UnauthorizedException {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("User not found: " + userId));
    }
    
    // ============================================
    // ROLE-LEVEL CHECKS
    // ============================================
    
    @Override
    public boolean isPlatformSuperAdmin(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            log.debug("User not found: {}", userId);
            return false;
        }
        boolean result = user.getRole() == UserRole.PLATFORM_SUPER_ADMIN;
        log.debug("isPlatformSuperAdmin({}) = {}", userId, result);
        return result;
    }
    
    @Override
    public boolean isHotelSuperAdmin(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return false;
        return user.getRole() == UserRole.HOTEL_SUPER_ADMIN;
    }
    
    @Override
    public boolean isHotelStaffAdmin(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return false;
        return user.getRole() == UserRole.HOTEL_STAFF_ADMIN;
    }
    
    @Override
    public boolean isDMCSuperAdmin(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return false;
        return user.getRole() == UserRole.DMC_SUPER_ADMIN;
    }
    
    @Override
    public boolean isDMCStaffAdmin(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return false;
        return user.getRole() == UserRole.DMC_STAFF_ADMIN;
    }
    
    // ============================================
    // STAKEHOLDER-LEVEL CHECKS
    // ============================================
    
    @Override
    public boolean isHotelUser(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return false;
        UserRole role = user.getRole();
        return role == UserRole.HOTEL_SUPER_ADMIN || role == UserRole.HOTEL_STAFF_ADMIN;
    }
    
    @Override
    public boolean isDMCUser(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return false;
        UserRole role = user.getRole();
        return role == UserRole.DMC_SUPER_ADMIN || role == UserRole.DMC_STAFF_ADMIN;
    }
    
    @Override
    public boolean isAnyStaffAdmin(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return false;
        UserRole role = user.getRole();
        return role == UserRole.HOTEL_STAFF_ADMIN || role == UserRole.DMC_STAFF_ADMIN;
    }
    
    // ============================================
    // ENFORCEMENT METHODS
    // ============================================
    
    @Override
    public void requirePlatformSuperAdmin(String userId) throws UnauthorizedException {
        if (!isPlatformSuperAdmin(userId)) {
            User user = userRepository.findById(userId).orElse(null);
            log.warn("Access denied: user {} is not PLATFORM_SUPER_ADMIN. Current role: {}",
                    userId, user != null ? user.getRole() : "unknown");
            throw new UnauthorizedException(
                    "This action requires PLATFORM_SUPER_ADMIN role. " +
                    "You have: " + (user != null ? user.getRole() : "unknown")
            );
        }
    }
    
    @Override
    public void requireHotelSuperAdmin(String userId) throws UnauthorizedException {
        if (!isHotelSuperAdmin(userId)) {
            User user = userRepository.findById(userId).orElse(null);
            log.warn("Access denied: user {} is not HOTEL_SUPER_ADMIN. Current role: {}",
                    userId, user != null ? user.getRole() : "unknown");
            throw new UnauthorizedException(
                    "This action requires HOTEL_SUPER_ADMIN role. " +
                    "You have: " + (user != null ? user.getRole() : "unknown")
            );
        }
    }
    
    @Override
    public void requireHotelAccess(String userId) throws UnauthorizedException {
        if (!isHotelUser(userId)) {
            User user = userRepository.findById(userId).orElse(null);
            log.warn("Access denied: user {} does not have hotel access. Current role: {}",
                    userId, user != null ? user.getRole() : "unknown");
            throw new UnauthorizedException(
                    "This action requires hotel access. " +
                    "You have: " + (user != null ? user.getRole() : "unknown")
            );
        }
    }
    
    @Override
    public void requireDMCSuperAdmin(String userId) throws UnauthorizedException {
        if (!isDMCSuperAdmin(userId)) {
            User user = userRepository.findById(userId).orElse(null);
            log.warn("Access denied: user {} is not DMC_SUPER_ADMIN. Current role: {}",
                    userId, user != null ? user.getRole() : "unknown");
            throw new UnauthorizedException(
                    "This action requires DMC_SUPER_ADMIN role. " +
                    "You have: " + (user != null ? user.getRole() : "unknown")
            );
        }
    }
    
    @Override
    public void requireDMCAccess(String userId) throws UnauthorizedException {
        if (!isDMCUser(userId)) {
            User user = userRepository.findById(userId).orElse(null);
            log.warn("Access denied: user {} does not have DMC access. Current role: {}",
                    userId, user != null ? user.getRole() : "unknown");
            throw new UnauthorizedException(
                    "This action requires DMC access. " +
                    "You have: " + (user != null ? user.getRole() : "unknown")
            );
        }
    }
    
    @Override
    public void requireSameOrganization(String userId, String targetOrganizationId) 
            throws UnauthorizedException {
        User user = getUserOrThrow(userId);
        
        // Determine user's organization
        String userOrgId = user.getParentUserId() != null ? 
                user.getParentUserId() : user.getId();
        
        // Check if user's organization matches target
        if (!userOrgId.equals(targetOrganizationId)) {
            log.warn("Access denied: user {} organization {} does not match target {}",
                    userId, userOrgId, targetOrganizationId);
            throw new UnauthorizedException(
                    "You do not have access to this organization"
            );
        }
        
        log.debug("Organization check passed: user {} org {} matches target {}",
                userId, userOrgId, targetOrganizationId);
    }
    
    @Override
    public void requireSameOrganizationAsUser(String userId, String targetUserId) 
            throws UnauthorizedException {
        User user = getUserOrThrow(userId);
        User targetUser = getUserOrThrow(targetUserId);
        
        // Determine organizations
        String userOrgId = user.getParentUserId() != null ? 
                user.getParentUserId() : user.getId();
        String targetOrgId = targetUser.getParentUserId() != null ? 
                targetUser.getParentUserId() : targetUser.getId();
        
        // Check if users are from same organization
        if (!userOrgId.equals(targetOrgId)) {
            log.warn("Access denied: user {} org {} does not match target user {} org {}",
                    userId, userOrgId, targetUserId, targetOrgId);
            throw new UnauthorizedException(
                    "You cannot access users from other organizations"
            );
        }
    }
}
