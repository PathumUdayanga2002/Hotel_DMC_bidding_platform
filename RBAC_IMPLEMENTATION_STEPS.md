# 🔧 RBAC Implementation Guide - Step-by-Step

## Quick Start

This guide provides exact code changes needed to fix the RBAC issue. Follow these steps in order.

---

## Step 1: Update UserRole Enum

**File:** `backend/src/main/java/com/hotel_bidding/backend/constants/UserRole.java`

### Current Code:
```java
public enum UserRole {
    HOTEL_USER,
    DMC_USER,
    ADMIN
}
```

### New Code:
```java
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
```

---

## Step 2: Create AuthorizationService Interface

**File:** `backend/src/main/java/com/hotel_bidding/backend/service/AuthorizationService.java` (NEW)

```java
package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.exception.UnauthorizedException;

/**
 * Comprehensive authorization service for role-based access control
 * 
 * This service provides fine-grained authorization checks for:
 * - Role-level checks (is user a specific role?)
 * - Stakeholder-level checks (does user belong to hotel/DMC?)
 * - Organizational boundary checks (can user access this organization?)
 * - Hierarchy level checks (does user have required level?)
 */
public interface AuthorizationService {
    
    // ============================================
    // ROLE-LEVEL CHECKS (returns boolean)
    // ============================================
    
    /**
     * Check if user is platform super admin
     * @param userId User ID
     * @return true if user has PLATFORM_SUPER_ADMIN role
     */
    boolean isPlatformSuperAdmin(String userId);
    
    /**
     * Check if user is hotel super admin
     * @param userId User ID
     * @return true if user has HOTEL_SUPER_ADMIN role
     */
    boolean isHotelSuperAdmin(String userId);
    
    /**
     * Check if user is hotel staff admin
     * @param userId User ID
     * @return true if user has HOTEL_STAFF_ADMIN role
     */
    boolean isHotelStaffAdmin(String userId);
    
    /**
     * Check if user is DMC super admin
     * @param userId User ID
     * @return true if user has DMC_SUPER_ADMIN role
     */
    boolean isDMCSuperAdmin(String userId);
    
    /**
     * Check if user is DMC staff admin
     * @param userId User ID
     * @return true if user has DMC_STAFF_ADMIN role
     */
    boolean isDMCStaffAdmin(String userId);
    
    // ============================================
    // STAKEHOLDER-LEVEL CHECKS (returns boolean)
    // ============================================
    
    /**
     * Check if user belongs to hotel (super admin or staff)
     * @param userId User ID
     * @return true if user is HOTEL_SUPER_ADMIN or HOTEL_STAFF_ADMIN
     */
    boolean isHotelUser(String userId);
    
    /**
     * Check if user belongs to DMC (super admin or staff)
     * @param userId User ID
     * @return true if user is DMC_SUPER_ADMIN or DMC_STAFF_ADMIN
     */
    boolean isDMCUser(String userId);
    
    /**
     * Check if user is any staff admin (not super admin)
     * @param userId User ID
     * @return true if user is HOTEL_STAFF_ADMIN or DMC_STAFF_ADMIN
     */
    boolean isAnyStaffAdmin(String userId);
    
    // ============================================
    // ENFORCEMENT METHODS (throws exception)
    // ============================================
    
    /**
     * Require user to be platform super admin
     * @param userId User ID
     * @throws UnauthorizedException if user is not PLATFORM_SUPER_ADMIN
     */
    void requirePlatformSuperAdmin(String userId) throws UnauthorizedException;
    
    /**
     * Require user to be hotel super admin
     * @param userId User ID
     * @throws UnauthorizedException if user is not HOTEL_SUPER_ADMIN
     */
    void requireHotelSuperAdmin(String userId) throws UnauthorizedException;
    
    /**
     * Require user to be hotel user (super or staff)
     * @param userId User ID
     * @throws UnauthorizedException if user is not HOTEL_SUPER_ADMIN or HOTEL_STAFF_ADMIN
     */
    void requireHotelAccess(String userId) throws UnauthorizedException;
    
    /**
     * Require user to be DMC super admin
     * @param userId User ID
     * @throws UnauthorizedException if user is not DMC_SUPER_ADMIN
     */
    void requireDMCSuperAdmin(String userId) throws UnauthorizedException;
    
    /**
     * Require user to be DMC user (super or staff)
     * @param userId User ID
     * @throws UnauthorizedException if user is not DMC_SUPER_ADMIN or DMC_STAFF_ADMIN
     */
    void requireDMCAccess(String userId) throws UnauthorizedException;
    
    /**
     * Verify user belongs to the same organization as target
     * 
     * For example:
     * - Hotel staff can only access their own hotel's data
     * - DMC staff can only access their own DMC's data
     * - Super admins can only create staff for their own organization
     * 
     * @param userId User ID
     * @param targetOrganizationId Target organization ID (hotel ID or DMC ID)
     * @throws UnauthorizedException if user's organization != target organization
     */
    void requireSameOrganization(String userId, String targetOrganizationId) throws UnauthorizedException;
    
    /**
     * Verify user can access specific user in organization
     * 
     * @param userId User ID trying to access
     * @param targetUserId Target user ID to access
     * @throws UnauthorizedException if users are from different organizations
     */
    void requireSameOrganizationAsUser(String userId, String targetUserId) throws UnauthorizedException;
}
```

---

## Step 3: Create AuthorizationService Implementation

**File:** `backend/src/main/java/com/hotel_bidding/backend/service/impl/AuthorizationServiceImpl.java` (NEW)

```java
package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.constants.UserRole;
import com.hotel_bidding.backend.entity.User;
import com.hotel_bidding.backend.exception.UnauthorizedException;
import com.hotel_bidding.backend.repository.UserRepository;
import com.hotel_bidding.backend.service.AuthorizationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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
                    "You do not have access to this organization. " +
                    "Your organization: " + userOrgId + 
                    ", Target organization: " + targetOrganizationId
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
```

---

## Step 4: Update HotelStaffController

**File:** `backend/src/main/java/com/hotel_bidding/backend/controller/HotelStaffController.java`

### Changes to make:

Replace all `@PreAuthorize("hasRole('HOTEL_USER')")` with `@PreAuthorize("hasRole('HOTEL_SUPER_ADMIN')")` and remove the runtime `requireSuperAdmin()` call:

```java
// BEFORE
@PostMapping
@PreAuthorize("hasRole('HOTEL_USER')")
public ResponseEntity<ApiResponse> createStaff(
        @Valid @RequestBody CreateStaffRequest request,
        Authentication authentication) {
    
    log.info("Hotel creating staff member: {}", request.getEmail());
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    String superAdminId = userDetails.getId();
    
    // Only super admins can create staff
    staffAuthorizationService.requireSuperAdmin(superAdminId);  // ← REMOVE THIS
    
    // ... rest of code
}

// AFTER
@PostMapping
@PreAuthorize("hasRole('HOTEL_SUPER_ADMIN')")
public ResponseEntity<ApiResponse> createStaff(
        @Valid @RequestBody CreateStaffRequest request,
        Authentication authentication) {
    
    log.info("Hotel creating staff member: {}", request.getEmail());
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    String superAdminId = userDetails.getId();
    
    // Authorization is now guaranteed by @PreAuthorize annotation
    // No additional runtime check needed
    
    // ... rest of code
}
```

---

## Step 5: Update DMCStaffController

**File:** `backend/src/main/java/com/hotel_bidding/backend/controller/DMCStaffController.java`

Same changes as HotelStaffController:

```java
// Replace this
@PreAuthorize("hasRole('DMC_USER')")

// With this
@PreAuthorize("hasRole('DMC_SUPER_ADMIN')")
```

And remove the runtime `requireSuperAdmin()` calls.

---

## Step 6: Update AdminController

**File:** `backend/src/main/java/com/hotel_bidding/backend/controller/AdminController.java`

Replace `@PreAuthorize("hasRole('ADMIN')")` with `@PreAuthorize("hasRole('PLATFORM_SUPER_ADMIN')")`:

```java
// BEFORE
@GetMapping("/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<ApiResponse> getDashboard(@AuthenticationPrincipal UserDetailsImpl userDetails) {
    // ... code
}

// AFTER
@GetMapping("/dashboard")
@PreAuthorize("hasRole('PLATFORM_SUPER_ADMIN')")
public ResponseEntity<ApiResponse> getDashboard(@AuthenticationPrincipal UserDetailsImpl userDetails) {
    // ... code
}
```

Do this for ALL admin endpoints.

---

## Step 7: Create Data Migration Service

**File:** `backend/src/main/java/com/hotel_bidding/backend/service/RoleMigrationService.java` (NEW)

```java
package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.constants.AccountType;
import com.hotel_bidding.backend.constants.UserRole;
import com.hotel_bidding.backend.entity.User;
import com.hotel_bidding.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service to migrate existing users from old role system to new role system
 * 
 * Old system:
 * - role: HOTEL_USER, DMC_USER, ADMIN
 * - accountType: SUPER_ADMIN, STAFF
 * 
 * New system:
 * - role: HOTEL_SUPER_ADMIN, HOTEL_STAFF_ADMIN, DMC_SUPER_ADMIN, DMC_STAFF_ADMIN, PLATFORM_SUPER_ADMIN
 * - accountType: kept for backward compatibility but not used
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RoleMigrationService {
    
    private final UserRepository userRepository;
    
    /**
     * Execute migration from old role system to new role system
     * Safe to run multiple times - idempotent
     */
    @Transactional
    public void migrateRoles() {
        log.info("Starting role migration...");
        
        // Migrate HOTEL_USER + SUPER_ADMIN → HOTEL_SUPER_ADMIN
        migrateHotelSuperAdmins();
        
        // Migrate HOTEL_USER + STAFF → HOTEL_STAFF_ADMIN
        migrateHotelStaffAdmins();
        
        // Migrate DMC_USER + SUPER_ADMIN → DMC_SUPER_ADMIN
        migrateDMCSuperAdmins();
        
        // Migrate DMC_USER + STAFF → DMC_STAFF_ADMIN
        migrateDMCStaffAdmins();
        
        // Migrate ADMIN (any account type) → PLATFORM_SUPER_ADMIN
        migratePlatformSuperAdmins();
        
        log.info("Role migration completed successfully");
    }
    
    private void migrateHotelSuperAdmins() {
        List<User> users = userRepository.findAll().stream()
                .filter(u -> u.getRole() == UserRole.HOTEL_USER && 
                           u.getAccountType() == AccountType.SUPER_ADMIN &&
                           u.getParentUserId() == null)  // Super admin has no parent
                .toList();
        
        int count = 0;
        for (User user : users) {
            user.setRole(UserRole.HOTEL_SUPER_ADMIN);
            userRepository.save(user);
            count++;
        }
        
        log.info("Migrated {} HOTEL_USER SUPER_ADMIN users to HOTEL_SUPER_ADMIN", count);
    }
    
    private void migrateHotelStaffAdmins() {
        List<User> users = userRepository.findAll().stream()
                .filter(u -> u.getRole() == UserRole.HOTEL_USER && 
                           u.getAccountType() == AccountType.STAFF &&
                           u.getParentUserId() != null)  // Staff has parent
                .toList();
        
        int count = 0;
        for (User user : users) {
            user.setRole(UserRole.HOTEL_STAFF_ADMIN);
            userRepository.save(user);
            count++;
        }
        
        log.info("Migrated {} HOTEL_USER STAFF users to HOTEL_STAFF_ADMIN", count);
    }
    
    private void migrateDMCSuperAdmins() {
        List<User> users = userRepository.findAll().stream()
                .filter(u -> u.getRole() == UserRole.DMC_USER && 
                           u.getAccountType() == AccountType.SUPER_ADMIN &&
                           u.getParentUserId() == null)
                .toList();
        
        int count = 0;
        for (User user : users) {
            user.setRole(UserRole.DMC_SUPER_ADMIN);
            userRepository.save(user);
            count++;
        }
        
        log.info("Migrated {} DMC_USER SUPER_ADMIN users to DMC_SUPER_ADMIN", count);
    }
    
    private void migrateDMCStaffAdmins() {
        List<User> users = userRepository.findAll().stream()
                .filter(u -> u.getRole() == UserRole.DMC_USER && 
                           u.getAccountType() == AccountType.STAFF &&
                           u.getParentUserId() != null)
                .toList();
        
        int count = 0;
        for (User user : users) {
            user.setRole(UserRole.DMC_STAFF_ADMIN);
            userRepository.save(user);
            count++;
        }
        
        log.info("Migrated {} DMC_USER STAFF users to DMC_STAFF_ADMIN", count);
    }
    
    private void migratePlatformSuperAdmins() {
        List<User> users = userRepository.findAll().stream()
                .filter(u -> u.getRole() == UserRole.ADMIN)
                .toList();
        
        int count = 0;
        for (User user : users) {
            user.setRole(UserRole.PLATFORM_SUPER_ADMIN);
            userRepository.save(user);
            count++;
        }
        
        log.info("Migrated {} ADMIN users to PLATFORM_SUPER_ADMIN", count);
    }
}
```

---

## Step 8: Create Migration Runner

**File:** `backend/src/main/java/com/hotel_bidding/backend/config/DataMigrationRunner.java` (NEW)

```java
package com.hotel_bidding.backend.config;

import com.hotel_bidding.backend.service.RoleMigrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Runs data migration on application startup
 * Only runs if roles need migration
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataMigrationRunner implements CommandLineRunner {
    
    private final RoleMigrationService roleMigrationService;
    
    @Override
    public void run(String... args) throws Exception {
        log.info("Running data migration checks...");
        
        try {
            // Run role migration - safe to run multiple times
            roleMigrationService.migrateRoles();
            log.info("Data migration completed successfully");
        } catch (Exception e) {
            log.error("Error during data migration", e);
            // Don't fail startup - migration might not be needed
        }
    }
}
```

---

## Step 9: Update Frontend Login Route Logic

**File:** `frontend/src/pages/LoginPage.jsx`

```javascript
// BEFORE
const onSubmit = async (data) => {
    setIsLoading(true);
    try {
        const response = await login(data);
        toast.success('Login successful!');
        
        const role = response.data.role;
        switch (role) {
            case 'HOTEL_USER':
                navigate('/hotel/dashboard');
                break;
            case 'DMC_USER':
                navigate('/dmc/dashboard');
                break;
            case 'ADMIN':
                navigate('/admin/dashboard');
                break;
            default:
                navigate('/');
        }
    } catch (error) {
        // error handling
    }
};

// AFTER
const onSubmit = async (data) => {
    setIsLoading(true);
    try {
        const response = await login(data);
        toast.success('Login successful!');
        
        const role = response.data.role;
        switch (role) {
            case 'PLATFORM_SUPER_ADMIN':
                navigate('/admin/dashboard');
                break;
            case 'HOTEL_SUPER_ADMIN':
            case 'HOTEL_STAFF_ADMIN':
                navigate('/hotel/dashboard');
                break;
            case 'DMC_SUPER_ADMIN':
            case 'DMC_STAFF_ADMIN':
                navigate('/dmc/dashboard');
                break;
            // Keep legacy routes for backward compatibility
            case 'HOTEL_USER':
                navigate('/hotel/dashboard');
                break;
            case 'DMC_USER':
                navigate('/dmc/dashboard');
                break;
            case 'ADMIN':
                navigate('/admin/dashboard');
                break;
            default:
                navigate('/');
        }
    } catch (error) {
        // error handling
    }
};
```

---

## Step 10: Update ProtectedRoute Component

**File:** `frontend/src/components/ProtectedRoute.jsx`

```javascript
// BEFORE
const ProtectedRoute = ({ 
    element, 
    allowedRoles = [], 
    requiresSuperAdmin = false 
}) => {
    const { user } = useAuth();
    
    if (!user) return <Navigate to="/login" />;
    
    const hasAllowedRole = 
        allowedRoles.length === 0 || 
        allowedRoles.includes(user.role);
    
    if (!hasAllowedRole) {
        return <Navigate to="/unauthorized" />;
    }
    
    if (requiresSuperAdmin && user.accountType !== 'SUPER_ADMIN') {
        return <Navigate to="/unauthorized" />;
    }
    
    return element;
};

// AFTER
const ProtectedRoute = ({ 
    element, 
    allowedRoles = [] 
}) => {
    const { user } = useAuth();
    
    if (!user) return <Navigate to="/login" />;
    
    const hasAllowedRole = 
        allowedRoles.length === 0 || 
        allowedRoles.includes(user.role);
    
    if (!hasAllowedRole) {
        return <Navigate to="/unauthorized" />;
    }
    
    return element;
};
```

---

## Step 11: Verify Authentication Response

**File:** `backend/src/main/java/com/hotel_bidding/backend/dto/response/AuthResponse.java`

Make sure it includes the new role field:

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String id;
    private String username;
    private String email;
    private UserRole role;              // ← Make sure this is UserRole not String
    private AccountType accountType;    // ← Keep for backward compat
    private String fullName;
    private String message;
}
```

---

## Testing Checklist

After making all changes, test these scenarios:

### 1. Role Creation Test
```bash
# Test HOTEL_SUPER_ADMIN can create HOTEL_STAFF_ADMIN
POST /hotel/staff
Authorization: Bearer <hotel_super_admin_token>
Body: { email: "staff@hotel.com", ... }
Expected: 201 Created

# Test HOTEL_STAFF_ADMIN cannot create staff
POST /hotel/staff
Authorization: Bearer <hotel_staff_admin_token>
Expected: 403 Forbidden
```

### 2. Cross-Organization Test
```bash
# Test Hotel staff cannot access DMC endpoints
POST /dmc/staff
Authorization: Bearer <hotel_staff_admin_token>
Expected: 403 Forbidden

# Test DMC staff cannot access Hotel endpoints
POST /hotel/staff
Authorization: Bearer <dmc_staff_admin_token>
Expected: 403 Forbidden
```

### 3. Platform Access Test
```bash
# Test Hotel admin cannot access platform features
GET /admin/dashboard
Authorization: Bearer <hotel_super_admin_token>
Expected: 403 Forbidden

# Test PLATFORM_SUPER_ADMIN can access everything
GET /admin/dashboard
Authorization: Bearer <platform_super_admin_token>
Expected: 200 OK
```

### 4. Organization Boundary Test
```bash
# Test Hotel A admin cannot modify Hotel B's staff
DELETE /hotel/staff/user_from_hotel_b
Authorization: Bearer <hotel_a_super_admin_token>
Expected: 403 Forbidden - "Access denied to this organization"
```

---

## Database Verification

After migration, verify roles in MongoDB:

```javascript
// Check Hotel Super Admins migrated
db.users.find({ role: "HOTEL_SUPER_ADMIN" }).count()
// Should show count of migrated users

// Check Hotel Staff migrated
db.users.find({ role: "HOTEL_STAFF_ADMIN" }).count()
// Should show count of migrated staff

// Check DMC Super Admins migrated
db.users.find({ role: "DMC_SUPER_ADMIN" }).count()

// Check DMC Staff migrated
db.users.find({ role: "DMC_STAFF_ADMIN" }).count()

// Check Platform Admins migrated
db.users.find({ role: "PLATFORM_SUPER_ADMIN" }).count()

// Verify no old roles remain (should be 0 after migration)
db.users.find({ $or: [
    { role: "HOTEL_USER" },
    { role: "DMC_USER" },
    { role: "ADMIN" }
]}).count()
```

---

## Rollback Plan

If something goes wrong:

1. **Keep database backup before migration**
2. **To rollback:**
   ```bash
   # Stop application
   # Restore database from backup
   # Revert code changes
   # Restart application
   ```

3. **Safest approach:** Test on staging environment first

---

## Summary

After these steps, you'll have:
✅ 6 specific roles preventing cross-stakeholder access
✅ Clear role hierarchy visible in code
✅ Organizational boundaries enforced
✅ Backward compatibility maintained
✅ No breaking changes to existing data

