package com.hotel_bidding.backend.service;

import java.util.Map;

/**
 * PayHere payment gateway integration service
 */
public interface PayHereService {
    
    /**
     * Generate PayHere checkout URL
     */
    String generateCheckoutUrl(
        String orderId,
        Double amount,
        String currency,
        String itemName,
        String itemDescription,
        String customerId,
        String customerName,
        String customerEmail,
        String returnUrl,
        String cancelUrl,
        String notifyUrl
    );
    
    /**
     * Verify PayHere notification signature
     */
    boolean verifyNotificationSignature(Map<String, String> params);
    
    /**
     * Process payout to hotel via PayHere
     */
    String processPayoutToHotel(
        String payoutId,
        String hotelBankAccount,
        Double amount,
        String currency,
        String description
    );
    
    /**
     * Generate MD5 hash for PayHere
     */
    String generateMd5Hash(String text);
    
    /**
     * Verify payment status from PayHere
     */
    Map<String, Object> verifyPaymentStatus(String orderId);
}
