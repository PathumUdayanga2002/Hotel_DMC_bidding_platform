package com.hotel_bidding.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "platform_settings")
public class PlatformSettings {
    
    @Id
    private String id;
    
    // Commission Settings
    private Double platformCommissionRate; // Percentage (e.g., 5.0 for 5%)
    private Double paymentProcessingFee; // Percentage (e.g., 2.5 for 2.5%)
    private Double minimumBookingValue; // In Rs
    
    // System Settings
    private Double autoApprovalThreshold; // In USD
    private Integer bidResponseTimeHours; // In hours
    private String platformSupportEmail;
    
    // Audit fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String updatedBy; // Admin username who last updated
    private String updatedByUserId; // Admin user ID who last updated
    
    // Version control
    private Integer version;
    
    // Notes
    private String notes;
}
