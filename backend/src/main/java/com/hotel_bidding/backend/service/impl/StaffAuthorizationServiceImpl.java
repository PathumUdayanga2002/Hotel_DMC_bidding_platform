package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.constants.AccountType;
import com.hotel_bidding.backend.entity.User;
import com.hotel_bidding.backend.exception.UnauthorizedException;
import com.hotel_bidding.backend.repository.UserRepository;
import com.hotel_bidding.backend.service.StaffAuthorizationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StaffAuthorizationServiceImpl implements StaffAuthorizationService {

    private final UserRepository userRepository;
    
    // Endpoints that staff cannot access
    private static final List<String> STAFF_BLOCKED_ENDPOINTS = List.of(
            "/dmc/profile",
            "/hotel/profile",
            "/dmc/analytics",
            "/hotel/analytics",
            "/dmc/staff",
            "/hotel/staff"
    );

    @Override
    public boolean isSuperAdmin(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            log.debug("User not found for id: {}", userId);
            return false;
        }
        
        AccountType accountType = user.getAccountType();
        log.debug("Checking isSuperAdmin for user: {}, accountType: {}, accountType class: {}", 
                  userId, accountType, accountType != null ? accountType.getClass().getName() : "null");
        
        // Treat null accountType as SUPER_ADMIN for backward compatibility with existing users
        boolean result = accountType == AccountType.SUPER_ADMIN || accountType == null;
        log.debug("isSuperAdmin result for user {}: {}", userId, result);
        return result;
    }

    @Override
    public boolean isStaff(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        return user != null && user.getAccountType() == AccountType.STAFF;
    }

    @Override
    public void requireSuperAdmin(String userId) {
        if (!isSuperAdmin(userId)) {
            User user = userRepository.findById(userId).orElse(null);
            log.warn("Access denied for user: {}, accountType: {}, Expected: SUPER_ADMIN or null", 
                     userId, user != null ? user.getAccountType() : "user not found");
            throw new UnauthorizedException("This action requires super admin privileges");
        }
    }

    @Override
    public boolean hasEndpointPermission(String userId, String endpoint) {
        User user = userRepository.findById(userId).orElse(null);
        
        if (user == null) {
            return false;
        }
        
        // Super admins have access to everything
        if (user.getAccountType() == AccountType.SUPER_ADMIN) {
            return true;
        }
        
        // Staff are blocked from certain endpoints
        if (user.getAccountType() == AccountType.STAFF) {
            // Check if endpoint starts with any blocked pattern
            for (String blockedEndpoint : STAFF_BLOCKED_ENDPOINTS) {
                if (endpoint.startsWith(blockedEndpoint)) {
                    log.warn("Staff user {} attempted to access blocked endpoint: {}", userId, endpoint);
                    return false;
                }
            }
            return true;
        }
        
        return false;
    }
}
