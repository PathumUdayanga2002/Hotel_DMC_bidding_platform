package com.hotel_bidding.backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSystemSettingsRequest {
    
    @NotNull(message = "Auto approval threshold is required")
    @Min(value = 0, message = "Auto approval threshold must be at least 0")
    private Double autoApprovalThreshold;
    
    @NotNull(message = "Bid response time is required")
    @Min(value = 1, message = "Bid response time must be at least 1 hour")
    @Max(value = 720, message = "Bid response time cannot exceed 720 hours (30 days)")
    private Integer bidResponseTimeHours;
    
    @NotNull(message = "Platform support email is required")
    @Email(message = "Please provide a valid email address")
    private String platformSupportEmail;
}
