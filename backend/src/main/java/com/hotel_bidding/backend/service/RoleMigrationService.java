package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.constants.AccountType;
import com.hotel_bidding.backend.constants.UserRole;
import com.hotel_bidding.backend.entity.User;
import com.hotel_bidding.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for migrating users from old dual-field role system to new single-field role system
 *
 * OLD SYSTEM:
 *   - Uses UserRole enum: HOTEL_USER, DMC_USER, ADMIN
 *   - Uses AccountType enum: SUPER_ADMIN, STAFF
 *   - Role determined by combining: role + accountType
 *
 * NEW SYSTEM:
 *   - Uses single UserRole enum with specific roles:
 *     * PLATFORM_SUPER_ADMIN (platform admins)
 *     * HOTEL_SUPER_ADMIN (hotel organization owners)
 *     * HOTEL_STAFF_ADMIN (hotel staff members)
 *     * DMC_SUPER_ADMIN (DMC organization owners)
 *     * DMC_STAFF_ADMIN (DMC staff members)
 *   - AccountType field being deprecated
 *
 * MIGRATION MAPPING:
 *   - HOTEL_USER + SUPER_ADMIN -> HOTEL_SUPER_ADMIN
 *   - HOTEL_USER + STAFF -> HOTEL_STAFF_ADMIN
 *   - DMC_USER + SUPER_ADMIN -> DMC_SUPER_ADMIN
 *   - DMC_USER + STAFF -> DMC_STAFF_ADMIN
 *   - ADMIN -> PLATFORM_SUPER_ADMIN
 *   - Already migrated users (having new role) are skipped
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RoleMigrationService {
    
    private final UserRepository userRepository;
    
    /**
     * Execute migration for all users
     * Safe to call multiple times (idempotent)
     */
    public void migrateAllUsers() {
        log.info("Starting role migration process...");
        
        int migratedCount = 0;
        int skippedCount = 0;
        
        // Get all users
        List<User> allUsers = userRepository.findAll();
        log.info("Total users in database: {}", allUsers.size());
        
        for (User user : allUsers) {
            if (isMigrated(user)) {
                log.debug("User {} already migrated with role {}. Skipping.", user.getId(), user.getRole());
                skippedCount++;
                continue;
            }
            
            try {
                migrateUser(user);
                migratedCount++;
                log.debug("Successfully migrated user: {} (id: {})", user.getUsername(), user.getId());
            } catch (Exception e) {
                log.error("Failed to migrate user: {} (id: {}). Error: {}", 
                        user.getUsername(), user.getId(), e.getMessage(), e);
            }
        }
        
        log.info("Role migration completed. Migrated: {}, Skipped: {}, Total: {}", 
                migratedCount, skippedCount, allUsers.size());
    }
    
    /**
     * Migrate a single user based on their current role and account type
     * Returns true if migration was performed, false if already migrated
     */
    public boolean migrateUser(User user) {
        if (isMigrated(user)) {
            return false;
        }
        
        UserRole oldRole = user.getRole();
        AccountType accountType = user.getAccountType();
        UserRole newRole = determineNewRole(oldRole, accountType);
        
        if (newRole != null && newRole != oldRole) {
            user.setRole(newRole);
            userRepository.save(user);
            log.info("Migrated user {} from role {} (accountType: {}) to role {}", 
                    user.getId(), oldRole, accountType, newRole);
            return true;
        }
        
        return false;
    }
    
    /**
     * Check if user has already been migrated to new role system
     */
    private boolean isMigrated(User user) {
        UserRole role = user.getRole();
        // If user has a new specific role, they are already migrated
        return role == UserRole.PLATFORM_SUPER_ADMIN ||
                role == UserRole.HOTEL_SUPER_ADMIN ||
                role == UserRole.HOTEL_STAFF_ADMIN ||
                role == UserRole.DMC_SUPER_ADMIN ||
                role == UserRole.DMC_STAFF_ADMIN;
    }
    
    /**
     * Determine the new role based on old role and account type
     *
     * @param oldRole The old UserRole (HOTEL_USER, DMC_USER, or ADMIN)
     * @param accountType The AccountType (SUPER_ADMIN or STAFF)
     * @return The new specific UserRole, or null if cannot determine
     */
    private UserRole determineNewRole(UserRole oldRole, AccountType accountType) {
        if (oldRole == null) {
            log.warn("User has null role, skipping migration");
            return null;
        }
        
        return switch (oldRole) {
            case HOTEL_USER -> {
                if (accountType == AccountType.SUPER_ADMIN) {
                    yield UserRole.HOTEL_SUPER_ADMIN;
                } else if (accountType == AccountType.STAFF) {
                    yield UserRole.HOTEL_STAFF_ADMIN;
                } else {
                    log.warn("HOTEL_USER with unknown accountType: {}", accountType);
                    yield null;
                }
            }
            
            case DMC_USER -> {
                if (accountType == AccountType.SUPER_ADMIN) {
                    yield UserRole.DMC_SUPER_ADMIN;
                } else if (accountType == AccountType.STAFF) {
                    yield UserRole.DMC_STAFF_ADMIN;
                } else {
                    log.warn("DMC_USER with unknown accountType: {}", accountType);
                    yield null;
                }
            }
            
            case ADMIN -> UserRole.PLATFORM_SUPER_ADMIN;
            
            // If already using new role system, return as-is
            case PLATFORM_SUPER_ADMIN, HOTEL_SUPER_ADMIN, HOTEL_STAFF_ADMIN,
                 DMC_SUPER_ADMIN, DMC_STAFF_ADMIN -> oldRole;
        };
    }
    
    /**
     * Get migration status summary
     */
    public MigrationStatus getMigrationStatus() {
        List<User> allUsers = userRepository.findAll();
        
        int migratedCount = 0;
        int notMigratedCount = 0;
        
        for (User user : allUsers) {
            if (isMigrated(user)) {
                migratedCount++;
            } else {
                notMigratedCount++;
            }
        }
        
        return MigrationStatus.builder()
                .totalUsers(allUsers.size())
                .migratedUsers(migratedCount)
                .notMigratedUsers(notMigratedCount)
                .migrationPercentage((migratedCount * 100) / Math.max(allUsers.size(), 1))
                .isComplete(notMigratedCount == 0)
                .build();
    }
    
    // ==================== Inner Classes ====================
    
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class MigrationStatus {
        private int totalUsers;
        private int migratedUsers;
        private int notMigratedUsers;
        private int migrationPercentage;
        private boolean isComplete;
    }
}
