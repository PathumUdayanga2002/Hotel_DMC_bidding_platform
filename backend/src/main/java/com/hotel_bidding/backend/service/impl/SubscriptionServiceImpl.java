package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.constants.SubscriptionPlan;
import com.hotel_bidding.backend.constants.SubscriptionStatus;
import com.hotel_bidding.backend.entity.Subscription;
import com.hotel_bidding.backend.entity.User;
import com.hotel_bidding.backend.entity.PaymentHistory;
import com.hotel_bidding.backend.exception.ResourceNotFoundException;
import com.hotel_bidding.backend.exception.UnauthorizedException;
import com.hotel_bidding.backend.repository.SubscriptionRepository;
import com.hotel_bidding.backend.repository.UserRepository;
import com.hotel_bidding.backend.repository.PaymentHistoryRepository;
import com.hotel_bidding.backend.service.SubscriptionService;
import com.hotel_bidding.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionServiceImpl implements SubscriptionService {
    
    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PaymentHistoryRepository paymentHistoryRepository;
    
    @Value("${payhere.merchant.id}")
    private String payheremerchant;
    
    @Value("${payhere.merchant.secret}")
    private String payhereSecret;
    
    @Value("${payhere.currency:USD}")
    private String currency;
    
    @Value("${app.base.url}")
    private String baseUrl;
    
    @Value("${app.backend.url}")
    private String backendUrl;
    
    @Override
    @Transactional
    public Subscription createTrialSubscription(String userId) {
        log.info("Creating 30-day trial subscription for user: {}", userId);
        
        // Check if user already has subscription
        if (subscriptionRepository.existsByUserId(userId)) {
            log.warn("User {} already has a subscription", userId);
            return subscriptionRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));
        }
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime trialEndDate = now.plusDays(30);
        
        Subscription subscription = Subscription.builder()
                .userId(userId)
                .status(SubscriptionStatus.TRIAL)
                .plan(null) // Trial has no plan
                .startDate(now)
                .endDate(trialEndDate)
                .amount(0.0)
                .currency(currency)
                .autoRenew(false)
                .createdAt(now)
                .updatedAt(now)
                .createdBy("SYSTEM")
                .updatedBy("SYSTEM")
                .build();
        
        Subscription saved = subscriptionRepository.save(subscription);
        log.info("Trial subscription created successfully for user: {}. Expires: {}", userId, trialEndDate);
        
        return saved;
    }
    
    @Override
    public Subscription getSubscriptionByUserId(String userId) {
        return subscriptionRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No subscription found for user: " + userId));
    }
    
    @Override
    public boolean hasActiveSubscription(String userId) {
        try {
            Subscription subscription = getSubscriptionByUserId(userId);
            
            // Check if expired
            if (subscription.isExpired()) {
                log.info("Subscription expired for user: {}", userId);
                updateSubscriptionStatus(subscription, SubscriptionStatus.EXPIRED);
                return false;
            }
            
            return subscription.isActive();
        } catch (ResourceNotFoundException e) {
            return false;
        }
    }
    
    @Override
    @Transactional
    public Map<String, Object> initializeSubscriptionPayment(String userId, SubscriptionPlan plan) {
        log.info("Initializing subscription payment for user: {}, plan: {}", userId, plan);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Subscription subscription = subscriptionRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No subscription found for user"));
        
        // Generate unique order ID
        String orderId = "SUB-" + UUID.randomUUID().toString();
        
        // Prepare PayHere payment data
        Map<String, Object> paymentData = new HashMap<>();
        paymentData.put("sandbox", true); // CRITICAL: Enable sandbox mode for testing
        paymentData.put("merchant_id", payheremerchant); // Fixed: use merchant ID, not secret
        paymentData.put("return_url", baseUrl + "/subscription/success"); // Frontend URL
        paymentData.put("cancel_url", baseUrl + "/subscription/cancel"); // Frontend URL
        paymentData.put("notify_url", backendUrl + "/subscription/payhere-notify"); // Backend URL for server-to-server callback
        paymentData.put("order_id", orderId);
        paymentData.put("items", plan.name() + " Subscription");
        paymentData.put("currency", currency);
        paymentData.put("amount", String.format("%.2f", plan.getPrice()));
        paymentData.put("first_name", user.getFullName() != null ? user.getFullName().split(" ")[0] : user.getUsername());
        paymentData.put("last_name", user.getFullName() != null && user.getFullName().split(" ").length > 1 ? 
                user.getFullName().split(" ")[1] : "");
        paymentData.put("email", user.getEmail());
        paymentData.put("phone", "");
        paymentData.put("address", "");
        paymentData.put("city", "");
        paymentData.put("country", "Sri Lanka");
        
        // Generate hash
        String hash = generatePayhereHash(
                payhereSecret,
                orderId,
                String.format("%.2f", plan.getPrice()),
                currency
        );
        paymentData.put("hash", hash);
        
        // Update subscription with pending payment
        subscription.setPaymentId(orderId);
        subscription.setPlan(plan);
        subscription.setAmount(plan.getPrice());
        subscription.setUpdatedAt(LocalDateTime.now());
        subscriptionRepository.save(subscription);
        
        log.info("Payment initialization successful. Order ID: {}", orderId);
        return paymentData;
    }
    
    @Override
    @Transactional
    public Subscription verifyAndActivateSubscription(Map<String, String> payhereData) {
        log.info("Verifying PayHere payment notification");
        
        String orderId = payhereData.get("order_id");
        String paymentId = payhereData.get("payment_id");
        String payhereAmount = payhereData.get("payhere_amount");
        String payhereSignature = payhereData.get("md5sig");
        String statusCode = payhereData.get("status_code");
        
        // Find subscription by order ID
        Subscription subscription = subscriptionRepository.findByPaymentId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found for order: " + orderId));
        
        // Verify payment signature
        String localHash = generatePayhereHash(
                payhereSecret,
                orderId,
                payhereAmount,
                currency.toUpperCase()
        );
        
        if (!localHash.equalsIgnoreCase(payhereSignature)) {
            log.error("PayHere signature verification failed for order: {}", orderId);
            throw new UnauthorizedException("Invalid payment signature");
        }
        
        // Check payment status (2 = success)
        if (!"2".equals(statusCode)) {
            log.warn("Payment not successful. Status code: {}", statusCode);
            return subscription;
        }
        
        // Activate subscription
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endDate = now.plusDays(subscription.getPlan().getDurationDays());
        
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setPayherePaymentId(paymentId);
        subscription.setStartDate(now);
        subscription.setEndDate(endDate);
        subscription.setUpdatedAt(now);
        subscription.setUpdatedBy("PAYHERE");
        
        Subscription activated = subscriptionRepository.save(subscription);
        log.info("Subscription activated successfully for user: {}. Expires: {}", subscription.getUserId(), endDate);
        
        // Record payment history
        try {
            PaymentHistory paymentHistory = PaymentHistory.builder()
                    .userId(subscription.getUserId())
                    .subscriptionId(subscription.getId())
                    .orderId(orderId)
                    .payherePaymentId(paymentId)
                    .plan(subscription.getPlan().name())
                    .amount(subscription.getAmount())
                    .currency(currency)
                    .status("SUCCESS")
                    .paymentDate(now)
                    .transactionReference(paymentId)
                    .createdAt(now)
                    .updatedAt(now)
                    .build();
            paymentHistoryRepository.save(paymentHistory);
            log.info("Payment history recorded for order: {}", orderId);
        } catch (Exception e) {
            log.error("Failed to record payment history", e);
        }
        
        // Send payment success email
        try {
            User user = userRepository.findById(subscription.getUserId()).orElse(null);
            if (user != null) {
                String userName = user.getFullName() != null ? user.getFullName() : user.getUsername();
                emailService.sendPaymentSuccessEmail(
                    user.getEmail(),
                    userName,
                    subscription.getPlan().name(),
                    subscription.getAmount(),
                    orderId
                );
            }
        } catch (Exception e) {
            log.error("Failed to send payment success email", e);
        }
        
        
        return activated;
    }
    
    @Override
    @Transactional
    public void cancelSubscription(String userId) {
        log.info("Cancelling subscription for user: {}", userId);
        
        Subscription subscription = subscriptionRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found for user: " + userId));
        
        subscription.setStatus(SubscriptionStatus.CANCELLED);
        subscription.setUpdatedAt(LocalDateTime.now());
        subscription.setUpdatedBy("USER");
        
        subscriptionRepository.save(subscription);
        log.info("Subscription cancelled for user: {}", userId);
    }
    
    @Override
    @Scheduled(cron = "0 0 0 * * ?") // Run daily at midnight
    @Transactional
    public void expireSubscriptions() {
        log.info("Running subscription expiry check");
        
        LocalDateTime now = LocalDateTime.now();
        List<Subscription> trialSubscriptions = subscriptionRepository.findByEndDateBeforeAndStatus(now, SubscriptionStatus.TRIAL);
        List<Subscription> activeSubscriptions = subscriptionRepository.findByEndDateBeforeAndStatus(now, SubscriptionStatus.ACTIVE);
        
        trialSubscriptions.forEach(sub -> updateSubscriptionStatus(sub, SubscriptionStatus.EXPIRED));
        activeSubscriptions.forEach(sub -> updateSubscriptionStatus(sub, SubscriptionStatus.EXPIRED));
        
        log.info("Expired {} trial and {} active subscriptions", trialSubscriptions.size(), activeSubscriptions.size());
    }
    
    @Override
    public long getDaysRemaining(String userId) {
        Subscription subscription = getSubscriptionByUserId(userId);
        return subscription.getDaysRemaining();
    }
    
    // Helper methods
    
    private void updateSubscriptionStatus(Subscription subscription, SubscriptionStatus status) {
        subscription.setStatus(status);
        subscription.setUpdatedAt(LocalDateTime.now());
        subscriptionRepository.save(subscription);
    }
    
    private String generatePayhereHash(String merchantSecret, String orderId, String amount, String currency) {
        try {
            // Decode Base64 merchant secret if needed
            String decodedSecret = merchantSecret;
            try {
                // Check if secret is Base64 encoded
                byte[] decodedBytes = java.util.Base64.getDecoder().decode(merchantSecret);
                decodedSecret = new String(decodedBytes);
                log.debug("Decoded Base64 merchant secret for hash generation");
            } catch (IllegalArgumentException e) {
                // Secret is not Base64 encoded, use as-is
                log.debug("Using merchant secret as-is (not Base64 encoded)");
            }
            
            // Step 1: Generate MD5 of merchant secret
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] secretDigest = md.digest(decodedSecret.getBytes());
            BigInteger secretHash = new BigInteger(1, secretDigest);
            String merchantSecretMd5 = secretHash.toString(16);
            while (merchantSecretMd5.length() < 32) {
                merchantSecretMd5 = "0" + merchantSecretMd5;
            }
            merchantSecretMd5 = merchantSecretMd5.toUpperCase();
            
            // Step 2: Generate final hash using PayHere formula
            // MD5(merchant_id + order_id + amount + currency + MD5(merchant_secret))
            String hashString = payheremerchant + orderId + amount + currency.toUpperCase() + merchantSecretMd5;
            
            byte[] messageDigest = md.digest(hashString.getBytes());
            BigInteger no = new BigInteger(1, messageDigest);
            String hash = no.toString(16);
            while (hash.length() < 32) {
                hash = "0" + hash;
            }
            
            log.debug("Generated PayHere hash for order: {} with merchant_id: {}", orderId, payheremerchant);
            return hash.toUpperCase();
        } catch (Exception e) {
            log.error("Error generating PayHere hash", e);
            throw new RuntimeException("Failed to generate payment hash");
        }
    }
}
