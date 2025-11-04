package com.hotel_bidding.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "platform_settings")
public class PlatformSettings {
    
    @Id
    private String id;
    
    // Commission Settings
    private Double platformCommissionRate;      // Percentage (e.g., 5.0 for 5%)
    private Double paymentProcessingFee;        // Percentage (e.g., 2.5 for 2.5%)
    private BigDecimal minimumBookingValue;     // In LKR (Rs.)
    
    // System Settings
    private BigDecimal autoApprovalThreshold;   // In LKR (Rs.)
    private Integer bidResponseTime;            // In hours
    private String platformSupportEmail;        // Primary support email
    private String additionalSupportEmails;     // Comma-separated additional emails
    
    // Metadata
    @LastModifiedDate
    private LocalDateTime updatedAt;
    private String updatedBy;                   // Admin user ID who last updated
    private String updatedByUsername;           // Admin username
    
    // Default values
    public static PlatformSettings createDefault() {
        return PlatformSettings.builder()
                .platformCommissionRate(5.0)
                .paymentProcessingFee(2.5)
                .minimumBookingValue(new BigDecimal("5000.00"))
                .autoApprovalThreshold(new BigDecimal("10000.00"))
                .bidResponseTime(48)
                .platformSupportEmail("support@hotelbidding.com")
                .additionalSupportEmails("admin@hotelbidding.com,help@hotelbidding.com")
                .updatedAt(LocalDateTime.now())
                .build();
    }
}
