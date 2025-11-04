package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.dto.CommissionSettingsDTO;
import com.hotel_bidding.backend.dto.PlatformSettingsDTO;
import com.hotel_bidding.backend.dto.SystemSettingsDTO;
import com.hotel_bidding.backend.entity.PlatformSettings;
import com.hotel_bidding.backend.repository.PlatformSettingsRepository;
import com.hotel_bidding.backend.service.PlatformSettingsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlatformSettingsServiceImpl implements PlatformSettingsService {

    private final PlatformSettingsRepository platformSettingsRepository;

    @Override
    public PlatformSettingsDTO getPlatformSettings() {
        log.info("Fetching platform settings");
        
        PlatformSettings settings = platformSettingsRepository.findFirstByOrderByUpdatedAtDesc()
                .orElseGet(() -> {
                    log.info("No settings found, creating default settings");
                    PlatformSettings defaultSettings = PlatformSettings.createDefault();
                    return platformSettingsRepository.save(defaultSettings);
                });
        
        return convertToDTO(settings);
    }

    @Override
    @Transactional
    public PlatformSettingsDTO updateCommissionSettings(
            CommissionSettingsDTO commissionSettings,
            String adminId,
            String adminUsername
    ) {
        log.info("Updating commission settings by admin: {}", adminUsername);
        
        PlatformSettings settings = platformSettingsRepository.findFirstByOrderByUpdatedAtDesc()
                .orElseGet(PlatformSettings::createDefault);
        
        // Update commission settings
        settings.setPlatformCommissionRate(commissionSettings.getPlatformCommissionRate());
        settings.setPaymentProcessingFee(commissionSettings.getPaymentProcessingFee());
        settings.setMinimumBookingValue(commissionSettings.getMinimumBookingValue());
        
        // Update metadata
        settings.setUpdatedAt(LocalDateTime.now());
        settings.setUpdatedBy(adminId);
        settings.setUpdatedByUsername(adminUsername);
        
        PlatformSettings saved = platformSettingsRepository.save(settings);
        
        log.info("Commission settings updated successfully");
        return convertToDTO(saved);
    }

    @Override
    @Transactional
    public PlatformSettingsDTO updateSystemSettings(
            SystemSettingsDTO systemSettings,
            String adminId,
            String adminUsername
    ) {
        log.info("Updating system settings by admin: {}", adminUsername);
        
        PlatformSettings settings = platformSettingsRepository.findFirstByOrderByUpdatedAtDesc()
                .orElseGet(PlatformSettings::createDefault);
        
        // Update system settings
        settings.setAutoApprovalThreshold(systemSettings.getAutoApprovalThreshold());
        settings.setBidResponseTime(systemSettings.getBidResponseTime());
        settings.setPlatformSupportEmail(systemSettings.getPlatformSupportEmail());
        settings.setAdditionalSupportEmails(systemSettings.getAdditionalSupportEmails());
        
        // Update metadata
        settings.setUpdatedAt(LocalDateTime.now());
        settings.setUpdatedBy(adminId);
        settings.setUpdatedByUsername(adminUsername);
        
        PlatformSettings saved = platformSettingsRepository.save(settings);
        
        log.info("System settings updated successfully");
        return convertToDTO(saved);
    }

    @Override
    @Transactional
    public PlatformSettingsDTO updateAllSettings(
            PlatformSettingsDTO settingsDTO,
            String adminId,
            String adminUsername
    ) {
        log.info("Updating all platform settings by admin: {}", adminUsername);
        
        PlatformSettings settings = platformSettingsRepository.findFirstByOrderByUpdatedAtDesc()
                .orElseGet(PlatformSettings::createDefault);
        
        // Update commission settings
        if (settingsDTO.getCommissionSettings() != null) {
            CommissionSettingsDTO commission = settingsDTO.getCommissionSettings();
            settings.setPlatformCommissionRate(commission.getPlatformCommissionRate());
            settings.setPaymentProcessingFee(commission.getPaymentProcessingFee());
            settings.setMinimumBookingValue(commission.getMinimumBookingValue());
        }
        
        // Update system settings
        if (settingsDTO.getSystemSettings() != null) {
            SystemSettingsDTO system = settingsDTO.getSystemSettings();
            settings.setAutoApprovalThreshold(system.getAutoApprovalThreshold());
            settings.setBidResponseTime(system.getBidResponseTime());
            settings.setPlatformSupportEmail(system.getPlatformSupportEmail());
            settings.setAdditionalSupportEmails(system.getAdditionalSupportEmails());
        }
        
        // Update metadata
        settings.setUpdatedAt(LocalDateTime.now());
        settings.setUpdatedBy(adminId);
        settings.setUpdatedByUsername(adminUsername);
        
        PlatformSettings saved = platformSettingsRepository.save(settings);
        
        log.info("All platform settings updated successfully");
        return convertToDTO(saved);
    }

    @Override
    @Transactional
    public PlatformSettingsDTO resetToDefaults(String adminId, String adminUsername) {
        log.info("Resetting platform settings to defaults by admin: {}", adminUsername);
        
        // Delete existing settings
        platformSettingsRepository.deleteAll();
        
        // Create new default settings
        PlatformSettings defaultSettings = PlatformSettings.createDefault();
        defaultSettings.setUpdatedBy(adminId);
        defaultSettings.setUpdatedByUsername(adminUsername);
        
        PlatformSettings saved = platformSettingsRepository.save(defaultSettings);
        
        log.info("Platform settings reset to defaults successfully");
        return convertToDTO(saved);
    }

    // Helper method to convert entity to DTO
    private PlatformSettingsDTO convertToDTO(PlatformSettings settings) {
        CommissionSettingsDTO commissionSettings = CommissionSettingsDTO.builder()
                .platformCommissionRate(settings.getPlatformCommissionRate())
                .paymentProcessingFee(settings.getPaymentProcessingFee())
                .minimumBookingValue(settings.getMinimumBookingValue())
                .build();
        
        SystemSettingsDTO systemSettings = SystemSettingsDTO.builder()
                .autoApprovalThreshold(settings.getAutoApprovalThreshold())
                .bidResponseTime(settings.getBidResponseTime())
                .platformSupportEmail(settings.getPlatformSupportEmail())
                .additionalSupportEmails(settings.getAdditionalSupportEmails())
                .build();
        
        return PlatformSettingsDTO.builder()
                .id(settings.getId())
                .commissionSettings(commissionSettings)
                .systemSettings(systemSettings)
                .updatedAt(settings.getUpdatedAt())
                .updatedBy(settings.getUpdatedByUsername())
                .build();
    }
}
