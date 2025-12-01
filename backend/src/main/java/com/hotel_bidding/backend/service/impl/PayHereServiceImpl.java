package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.service.PayHereService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;

/**
 * PayHere payment gateway integration implementation
 */
@Service
@Slf4j
public class PayHereServiceImpl implements PayHereService {
    
    @Value("${payhere.merchant.id}")
    private String merchantId;
    
    @Value("${payhere.merchant.secret}")
    private String merchantSecret;
    
    @Value("${payhere.api.url:https://sandbox.payhere.lk}")
    private String payHereApiUrl;
    
    @Value("${payhere.checkout.url:https://sandbox.payhere.lk/pay/checkout}")
    private String checkoutUrl;
    
    @Override
    public String generateCheckoutUrl(
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
            String notifyUrl) {
        
        log.info("Generating PayHere checkout URL for order: {}", orderId);
        
        // Format amount to 2 decimal places
        String formattedAmount = String.format("%.2f", amount);
        
        // Generate hash
        String hashString = merchantId + orderId + formattedAmount + currency.toUpperCase();
        String hash = generateMd5Hash(hashString + merchantSecret);
        
        // Build checkout URL with parameters
        StringBuilder url = new StringBuilder(checkoutUrl);
        url.append("?merchant_id=").append(merchantId);
        url.append("&return_url=").append(returnUrl);
        url.append("&cancel_url=").append(cancelUrl);
        url.append("&notify_url=").append(notifyUrl);
        url.append("&order_id=").append(orderId);
        url.append("&items=").append(itemName);
        url.append("&currency=").append(currency.toUpperCase());
        url.append("&amount=").append(formattedAmount);
        url.append("&first_name=").append(customerName);
        url.append("&last_name=");
        url.append("&email=").append(customerEmail);
        url.append("&phone=");
        url.append("&address=");
        url.append("&city=");
        url.append("&country=");
        url.append("&hash=").append(hash);
        url.append("&custom_1=").append(customerId);
        url.append("&custom_2=").append(itemDescription);
        
        return url.toString();
    }
    
    @Override
    public boolean verifyNotificationSignature(Map<String, String> params) {
        try {
            String merchantId = params.get("merchant_id");
            String orderId = params.get("order_id");
            String paymentId = params.get("payment_id");
            String payhereAmount = params.get("payhere_amount");
            String payhereCurrency = params.get("payhere_currency");
            String statusCode = params.get("status_code");
            String md5sig = params.get("md5sig");
            
            if (merchantId == null || orderId == null || paymentId == null || 
                payhereAmount == null || payhereCurrency == null || 
                statusCode == null || md5sig == null) {
                log.error("Missing required parameters in PayHere notification");
                return false;
            }
            
            // Generate hash for verification
            String hashString = merchantId + orderId + payhereAmount + 
                              payhereCurrency + statusCode + 
                              generateMd5Hash(merchantSecret).toUpperCase();
            
            String generatedHash = generateMd5Hash(hashString).toUpperCase();
            
            boolean isValid = generatedHash.equals(md5sig.toUpperCase());
            
            if (!isValid) {
                log.error("PayHere signature verification failed. Expected: {}, Got: {}", 
                         generatedHash, md5sig);
            } else {
                log.info("PayHere signature verified successfully for order: {}", orderId);
            }
            
            return isValid;
            
        } catch (Exception e) {
            log.error("Error verifying PayHere notification signature", e);
            return false;
        }
    }
    
    @Override
    public String processPayoutToHotel(
            String payoutId,
            String hotelBankAccount,
            Double amount,
            String currency,
            String description) {
        
        log.info("Processing payout {} to hotel account: {}", payoutId, hotelBankAccount);
        
        // TODO: Implement PayHere Payout API integration
        // This would typically involve:
        // 1. Call PayHere Payout API
        // 2. Provide bank account details
        // 3. Get payout reference/transaction ID
        
        // For now, return a mock reference
        // In production, this will call actual PayHere Payout API
        String payoutReference = "PAYOUT-" + System.currentTimeMillis();
        
        log.info("Payout processed successfully: {}", payoutReference);
        return payoutReference;
    }
    
    @Override
    public String generateMd5Hash(String text) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] messageDigest = md.digest(text.getBytes());
            BigInteger no = new BigInteger(1, messageDigest);
            String hashtext = no.toString(16);
            
            while (hashtext.length() < 32) {
                hashtext = "0" + hashtext;
            }
            
            return hashtext.toUpperCase();
            
        } catch (NoSuchAlgorithmException e) {
            log.error("Error generating MD5 hash", e);
            throw new RuntimeException("Failed to generate MD5 hash", e);
        }
    }
    
    @Override
    public Map<String, Object> verifyPaymentStatus(String orderId) {
        log.info("Verifying payment status for order: {}", orderId);
        
        // TODO: Implement PayHere payment verification API call
        // This would query PayHere API to get current payment status
        
        return Map.of(
            "orderId", orderId,
            "status", "PENDING",
            "message", "Payment verification not yet implemented"
        );
    }
}
