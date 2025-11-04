package com.hotel_bidding.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request to approve payout by admin
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApprovePayoutRequest {
    
    @NotBlank(message = "Payment ID is required")
    private String paymentId;
    
    private String adminNotes;
}
