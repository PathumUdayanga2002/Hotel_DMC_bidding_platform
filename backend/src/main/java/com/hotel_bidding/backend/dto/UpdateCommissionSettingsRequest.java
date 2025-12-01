package com.hotel_bidding.backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCommissionSettingsRequest {
    
    @NotNull(message = "Platform commission rate is required")
    @Min(value = 0, message = "Commission rate must be at least 0%")
    @Max(value = 100, message = "Commission rate cannot exceed 100%")
    private Double platformCommissionRate;
    
    @NotNull(message = "Payment processing fee is required")
    @Min(value = 0, message = "Payment processing fee must be at least 0%")
    @Max(value = 100, message = "Payment processing fee cannot exceed 100%")
    private Double paymentProcessingFee;
    
    @NotNull(message = "Minimum booking value is required")
    @Min(value = 0, message = "Minimum booking value must be at least 0")
    private Double minimumBookingValue;
}
