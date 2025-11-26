package com.hotel_bidding.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request to initiate payment after DMC awards a bid
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InitiatePaymentRequest {
    
    @NotBlank(message = "Inquiry ID is required")
    private String inquiryId;
    
    @NotBlank(message = "Bid ID is required")
    private String bidId;
    
    // Optional: For custom success/failure URLs
    private String returnUrl;
    private String cancelUrl;
    private String notifyUrl;
}
