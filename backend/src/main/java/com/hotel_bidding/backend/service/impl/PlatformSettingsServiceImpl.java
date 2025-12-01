package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.dto.PlatformSettingsResponse;
import com.hotel_bidding.backend.dto.UpdateCommissionSettingsRequest;
import com.hotel_bidding.backend.dto.UpdateSystemSettingsRequest;
import com.hotel_bidding.backend.entity.PlatformSettings;
import com.hotel_bidding.backend.exception.ResourceNotFoundException;
import com.hotel_bidding.backend.repository.PlatformSettingsRepository;
import com.hotel_bidding.backend.service.PlatformSettingsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlatformSettingsServiceImpl implements PlatformSettingsService {
    
    private final PlatformSettingsRepository platformSettingsRepository;
    
    @Override
    public PlatformSettingsResponse getSettings() {
        log.info("Fetching platform settings");
        
        PlatformSettings settings = platformSettingsRepository.findFirstByOrderByUpdatedAtDesc()
                .orElseGet(() -> {
                    log.info("No settings found, initializing default settings");
                    initializeDefaultSettings();
                    return platformSettingsRepository.findFirstByOrderByUpdatedAtDesc()
                            .orElseThrow(() -> new ResourceNotFoundException("Failed to initialize settings"));
                });
        
        return mapToResponse(settings);
    }
    
    @Override
    @Transactional
    public PlatformSettingsResponse updateCommissionSettings(
            UpdateCommissionSettingsRequest request,
            String adminUserId,
            String adminUsername
    ) {
        log.info("Updating commission settings by admin: {}", adminUsername);
        
        PlatformSettings settings = platformSettingsRepository.findFirstByOrderByUpdatedAtDesc()
                .orElseGet(() -> createDefaultSettings());
        
        // Update commission settings
        settings.setPlatformCommissionRate(request.getPlatformCommissionRate());
        settings.setPaymentProcessingFee(request.getPaymentProcessingFee());
        settings.setMinimumBookingValue(request.getMinimumBookingValue());
        
        // Update audit fields
        settings.setUpdatedAt(LocalDateTime.now());
        settings.setUpdatedBy(adminUsername);
        settings.setUpdatedByUserId(adminUserId);
        settings.setVersion(settings.getVersion() != null ? settings.getVersion() + 1 : 1);
        
        PlatformSettings savedSettings = platformSettingsRepository.save(settings);
        
        log.info("Commission settings updated successfully. Version: {}", savedSettings.getVersion());
        
        return mapToResponse(savedSettings);
    }
    
    @Override
    @Transactional
    public PlatformSettingsResponse updateSystemSettings(
            UpdateSystemSettingsRequest request,
            String adminUserId,
            String adminUsername
    ) {
        log.info("Updating system settings by admin: {}", adminUsername);
        
        PlatformSettings settings = platformSettingsRepository.findFirstByOrderByUpdatedAtDesc()
                .orElseGet(() -> createDefaultSettings());
        
        // Update system settings
        settings.setAutoApprovalThreshold(request.getAutoApprovalThreshold());
        settings.setBidResponseTimeHours(request.getBidResponseTimeHours());
        settings.setPlatformSupportEmail(request.getPlatformSupportEmail());
        
        // Update audit fields
        settings.setUpdatedAt(LocalDateTime.now());
        settings.setUpdatedBy(adminUsername);
        settings.setUpdatedByUserId(adminUserId);
        settings.setVersion(settings.getVersion() != null ? settings.getVersion() + 1 : 1);
        
        PlatformSettings savedSettings = platformSettingsRepository.save(settings);
        
        log.info("System settings updated successfully. Version: {}", savedSettings.getVersion());
        
        return mapToResponse(savedSettings);
    }
    
    @Override
    public void initializeDefaultSettings() {
        log.info("Initializing default platform settings");
        
        if (!platformSettingsRepository.existsByIdIsNotNull()) {
            PlatformSettings defaultSettings = createDefaultSettings();
            platformSettingsRepository.save(defaultSettings);
            log.info("Default platform settings initialized successfully");
        } else {
            log.info("Platform settings already exist, skipping initialization");
        }
    }
    
    private PlatformSettings createDefaultSettings() {
        PlatformSettings settings = new PlatformSettings();
        
        // Default Commission Settings
        settings.setPlatformCommissionRate(5.0); // 5%
        settings.setPaymentProcessingFee(2.5); // 2.5%
        settings.setMinimumBookingValue(10000.0); // Rs 10,000
        
        // Default System Settings
        settings.setAutoApprovalThreshold(1000.0); // $1,000
        settings.setBidResponseTimeHours(48); // 48 hours
        settings.setPlatformSupportEmail("support@hotelbidding.com");
        
        // Audit fields
        settings.setCreatedAt(LocalDateTime.now());
        settings.setUpdatedAt(LocalDateTime.now());
        settings.setUpdatedBy("System");
        settings.setUpdatedByUserId("system");
        settings.setVersion(1);
        settings.setNotes("Initial default settings");
        
        return settings;
    }
    
    private PlatformSettingsResponse mapToResponse(PlatformSettings settings) {
        PlatformSettingsResponse response = new PlatformSettingsResponse();
        response.setId(settings.getId());
        response.setPlatformCommissionRate(settings.getPlatformCommissionRate());
        response.setPaymentProcessingFee(settings.getPaymentProcessingFee());
        response.setMinimumBookingValue(settings.getMinimumBookingValue());
        response.setAutoApprovalThreshold(settings.getAutoApprovalThreshold());
        response.setBidResponseTimeHours(settings.getBidResponseTimeHours());
        response.setPlatformSupportEmail(settings.getPlatformSupportEmail());
        response.setCreatedAt(settings.getCreatedAt());
        response.setUpdatedAt(settings.getUpdatedAt());
        response.setUpdatedBy(settings.getUpdatedBy());
        response.setVersion(settings.getVersion());
        return response;
    }
}
