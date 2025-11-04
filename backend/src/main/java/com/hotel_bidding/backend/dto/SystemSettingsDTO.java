package com.hotel_bidding.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemSettingsDTO {
    
    @NotNull(message = "Auto approval threshold is required")
    @DecimalMin(value = "0.0", message = "Auto approval threshold must be at least 0")
    private BigDecimal autoApprovalThreshold; // In LKR (Rs.)
    
    @NotNull(message = "Bid response time is required")
    @DecimalMin(value = "1.0", message = "Bid response time must be at least 1 hour")
    private Integer bidResponseTime; // In hours (e.g., 48)
    
    @NotBlank(message = "Platform support email is required")
    @Email(message = "Please provide a valid email address")
    private String platformSupportEmail; // Primary support email
    
    // Additional support emails (comma-separated)
    private String additionalSupportEmails;
}
