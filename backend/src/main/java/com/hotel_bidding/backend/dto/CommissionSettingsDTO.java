package com.hotel_bidding.backend.dto;

import jakarta.validation.constraints.DecimalMin;
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
public class CommissionSettingsDTO {
    
    @NotNull(message = "Platform commission rate is required")
    @DecimalMin(value = "0.0", message = "Commission rate must be at least 0%")
    private Double platformCommissionRate; // Percentage (e.g., 5.0 for 5%)
    
    @NotNull(message = "Payment processing fee is required")
    @DecimalMin(value = "0.0", message = "Payment processing fee must be at least 0%")
    private Double paymentProcessingFee; // Percentage (e.g., 2.5 for 2.5%)
    
    @NotNull(message = "Minimum booking value is required")
    @DecimalMin(value = "0.0", message = "Minimum booking value must be at least 0")
    private BigDecimal minimumBookingValue; // In LKR (Rs.)
}
