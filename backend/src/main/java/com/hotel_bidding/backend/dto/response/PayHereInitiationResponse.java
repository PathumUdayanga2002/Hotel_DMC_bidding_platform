package com.hotel_bidding.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * PayHere payment initiation response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayHereInitiationResponse {
    
    private String paymentId;           // Our payment ID
    private String payHereOrderId;      // Order ID for PayHere
    private String payHereCheckoutUrl;  // URL to redirect user for payment
    private String returnUrl;
    private String cancelUrl;
    private String notifyUrl;
    
    // Payment details
    private Double amountInLkr;
    private String itemName;
    private String itemDescription;
    
    // Expiry
    private Long expiresInMinutes;
}
