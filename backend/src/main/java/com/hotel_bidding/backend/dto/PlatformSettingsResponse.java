package com.hotel_bidding.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlatformSettingsResponse {
    
    private String id;
    
    // Commission Settings
    private Double platformCommissionRate;
    private Double paymentProcessingFee;
    private Double minimumBookingValue;
    
    // System Settings
    private Double autoApprovalThreshold;
    private Integer bidResponseTimeHours;
    private String platformSupportEmail;
    
    // Audit fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String updatedBy;
    private Integer version;
}
