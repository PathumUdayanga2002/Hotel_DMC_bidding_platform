package com.hotel_bidding.backend.runner;

import com.hotel_bidding.backend.service.RoleMigrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * Data Migration Runner
 * Executes role migration on application startup
 * Runs only in production, development, and staging profiles (NOT in test)
 */
@Slf4j
@Component
@RequiredArgsConstructor
@Profile({"!test"})
public class DataMigrationRunner implements CommandLineRunner {
    
    private final RoleMigrationService roleMigrationService;
    
    /**
     * Run migrations on application startup
     */
    @Override
    public void run(String... args) throws Exception {
        log.info("========================================");
        log.info("Starting Data Migration Runner");
        log.info("========================================");
        
        try {
            // Execute role migration
            roleMigrationService.migrateAllUsers();
            
            // Get migration status
            RoleMigrationService.MigrationStatus status = roleMigrationService.getMigrationStatus();
            log.info("Migration Status: {}/{} users migrated ({}%)",
                    status.getMigratedUsers(),
                    status.getTotalUsers(),
                    status.getMigrationPercentage());
            
            if (status.isComplete()) {
                log.info("✓ All users successfully migrated to new role system");
            } else {
                log.warn("⚠ {} users still need migration", status.getNotMigratedUsers());
            }
            
        } catch (Exception e) {
            log.error("Error during data migration", e);
            // Don't stop application startup on migration error
            // Log and continue
        }
        
        log.info("========================================");
        log.info("Data Migration Runner Completed");
        log.info("========================================");
    }
}
