package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.constants.BidInquiryStatus;
import com.hotel_bidding.backend.constants.BidStatus;
import com.hotel_bidding.backend.constants.PaymentStatus;
import com.hotel_bidding.backend.constants.PayoutStatus;
import com.hotel_bidding.backend.dto.request.ApprovePayoutRequest;
import com.hotel_bidding.backend.dto.request.HotelBankDetailsRequest;
import com.hotel_bidding.backend.dto.request.InitiatePaymentRequest;
import com.hotel_bidding.backend.dto.response.PayHereInitiationResponse;
import com.hotel_bidding.backend.dto.response.PaymentResponse;
import com.hotel_bidding.backend.dto.response.PlatformBalanceResponse;
import com.hotel_bidding.backend.entity.*;
import com.hotel_bidding.backend.exception.ResourceNotFoundException;
import com.hotel_bidding.backend.exception.UnauthorizedException;
import com.hotel_bidding.backend.repository.*;
import com.hotel_bidding.backend.service.CurrencyConversionService;
// import com.hotel_bidding.backend.service.EmailService; // TODO: Uncomment when email methods are implemented
import com.hotel_bidding.backend.service.PayHereService;
import com.hotel_bidding.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Payment service implementation
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final HotelBankDetailsRepository bankDetailsRepository;
    private final PlatformBalanceRepository platformBalanceRepository;
    private final BidInquiryRepository bidInquiryRepository;
    private final HotelBidRepository hotelBidRepository;
    private final UserRepository userRepository;
    private final PayHereService payHereService;
    private final CurrencyConversionService currencyService;
    // private final EmailService emailService; // TODO: Uncomment when email methods are implemented
    
    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;
    
    @Value("${app.backend.url:http://localhost:8080}")
    private String backendUrl;
    
    private static final double PLATFORM_COMMISSION_RATE = 0.05; // 5%
    private static final long PAYMENT_TIMEOUT_MINUTES = 15;
    
    @Override
    @Transactional
    public PayHereInitiationResponse initiatePayment(InitiatePaymentRequest request, String dmcUserId) {
        log.info("Initiating payment for inquiry: {}, bid: {} by DMC: {}", 
                 request.getInquiryId(), request.getBidId(), dmcUserId);
        
        // Get DMC user
        User dmcUser = userRepository.findByUsername(dmcUserId)
                .orElseThrow(() -> new ResourceNotFoundException("DMC user not found"));
        
        // Get inquiry
        BidInquiry inquiry = bidInquiryRepository.findById(request.getInquiryId())
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found"));
        
        // Verify DMC owns this inquiry
        if (!inquiry.getDmcUserId().equals(dmcUser.getId())) {
            throw new UnauthorizedException("You don't own this inquiry");
        }
        
        // Get bid
        HotelBid bid = hotelBidRepository.findById(request.getBidId())
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found"));
        
        // Verify bid is awarded
        if (bid.getStatus() != BidStatus.AWARDED) {
            throw new IllegalStateException("Bid must be awarded before payment");
        }
        
        // Check if payment already exists
        paymentRepository.findByInquiryIdAndBidId(request.getInquiryId(), request.getBidId())
                .ifPresent(existingPayment -> {
                    if (existingPayment.getPaymentStatus() == PaymentStatus.COMPLETED) {
                        throw new IllegalStateException("Payment already completed for this bid");
                    }
                    if (existingPayment.getPaymentStatus() == PaymentStatus.PENDING && 
                        !existingPayment.isExpired()) {
                        throw new IllegalStateException("Payment already in progress");
                    }
                });
        
        // Get hotel user
        User hotelUser = userRepository.findById(bid.getHotelUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel user not found"));
        
        // Calculate amounts
        Double totalAmount = bid.getTotalPrice();
        String originalCurrency = bid.getCurrency();
        Double amountInLkr = currencyService.convertToLkr(totalAmount, originalCurrency);
        Double platformCommission = amountInLkr * PLATFORM_COMMISSION_RATE;
        Double hotelPayout = amountInLkr - platformCommission;
        
        // Create payment record
        String orderId = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusMinutes(PAYMENT_TIMEOUT_MINUTES);
        
        Payment payment = Payment.builder()
                .inquiryId(request.getInquiryId())
                .bidId(request.getBidId())
                .dmcUserId(dmcUser.getId())
                .dmcUsername(dmcUser.getUsername())
                .dmcCompanyName(inquiry.getDmcCompanyName())
                .hotelUserId(hotelUser.getId())
                .hotelUsername(hotelUser.getUsername())
                .hotelName(bid.getHotelName())
                .totalAmount(totalAmount)
                .originalCurrency(originalCurrency)
                .originalAmount(totalAmount)
                .amountInLkr(amountInLkr)
                .platformCommission(platformCommission)
                .hotelPayout(hotelPayout)
                .payHereOrderId(orderId)
                .paymentStatus(PaymentStatus.PENDING)
                .payoutStatus(PayoutStatus.PENDING)
                .createdAt(now)
                .paymentExpiresAt(expiresAt)
                .updatedAt(now)
                .build();
        
        payment = paymentRepository.save(payment);
        log.info("Payment record created: {} for order: {}", payment.getId(), orderId);
        
        // Generate PayHere checkout URL
        String returnUrl = request.getReturnUrl() != null ? 
                          request.getReturnUrl() : 
                          frontendUrl + "/payment/success";
        String cancelUrl = request.getCancelUrl() != null ? 
                          request.getCancelUrl() : 
                          frontendUrl + "/payment/cancelled";
        String notifyUrl = request.getNotifyUrl() != null ? 
                          request.getNotifyUrl() : 
                          backendUrl + "/api/v1/payments/webhook/payhere";
        
        String itemName = "Bid Payment - " + inquiry.getTitle();
        String itemDescription = String.format("Payment for %d rooms, %d nights", 
                                              inquiry.getNumberOfRooms(), 
                                              inquiry.getNumberOfNights());
        
        String checkoutUrl = payHereService.generateCheckoutUrl(
                orderId,
                amountInLkr,
                "LKR",
                itemName,
                itemDescription,
                dmcUser.getId(),
                dmcUser.getUsername(),
                dmcUser.getEmail(),
                returnUrl,
                cancelUrl,
                notifyUrl
        );
        
        // Send email notification
        // TODO: Implement email service methods
        /*
        try {
            emailService.sendPaymentInitiatedEmail(
                    dmcUser.getEmail(),
                    dmcUser.getUsername(),
                    orderId,
                    amountInLkr,
                    expiresAt
            );
        } catch (Exception e) {
            log.error("Failed to send payment initiation email", e);
        }
        */
        
        return PayHereInitiationResponse.builder()
                .paymentId(payment.getId())
                .payHereOrderId(orderId)
                .payHereCheckoutUrl(checkoutUrl)
                .returnUrl(returnUrl)
                .cancelUrl(cancelUrl)
                .notifyUrl(notifyUrl)
                .amountInLkr(amountInLkr)
                .itemName(itemName)
                .itemDescription(itemDescription)
                .expiresInMinutes(PAYMENT_TIMEOUT_MINUTES)
                .build();
    }
    
    @Override
    @Transactional
    public void handlePayHereNotification(Map<String, String> params) {
        log.info("Received PayHere notification: {}", params);
        
        // Verify signature
        if (!payHereService.verifyNotificationSignature(params)) {
            log.error("Invalid PayHere notification signature");
            throw new UnauthorizedException("Invalid PayHere notification");
        }
        
        String orderId = params.get("order_id");
        String paymentId = params.get("payment_id");
        String statusCode = params.get("status_code");
        String method = params.get("method");
        String cardType = params.get("card_type");
        String statusMessage = params.get("status_message");
        
        Payment payment = paymentRepository.findByPayHereOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order: " + orderId));
        
        // Update payment with PayHere details
        payment.setPayHerePaymentId(paymentId);
        payment.setPayHereStatusCode(statusCode);
        payment.setPayHereMessage(statusMessage);
        payment.setPayHereMethod(method);
        payment.setPayHereCardType(cardType);
        payment.setUpdatedAt(LocalDateTime.now());
        
        // Update status based on PayHere status code
        if ("2".equals(statusCode)) {
            // Payment successful
            payment.setPaymentStatus(PaymentStatus.COMPLETED);
            payment.setPaymentCompletedAt(LocalDateTime.now());
            
            // Update platform balance
            updatePlatformBalance(payment);
            
            // Update bid inquiry status to COMPLETED
            BidInquiry inquiry = bidInquiryRepository.findById(payment.getInquiryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found"));
            inquiry.setStatus(BidInquiryStatus.COMPLETED);
            inquiry.setUpdatedAt(LocalDateTime.now());
            bidInquiryRepository.save(inquiry);
            
            log.info("Payment completed successfully: {}", payment.getId());
            
            // Send success email
            // TODO: Implement email service methods
            /*
            try {
                User dmcUser = userRepository.findById(payment.getDmcUserId()).orElse(null);
                if (dmcUser != null) {
                    emailService.sendPaymentSuccessEmail(
                            dmcUser.getEmail(),
                            dmcUser.getUsername(),
                            orderId,
                            payment.getAmountInLkr()
                    );
                }
            } catch (Exception e) {
                log.error("Failed to send payment success email", e);
            }
            */
            
        } else if ("0".equals(statusCode)) {
            // Payment pending
            payment.setPaymentStatus(PaymentStatus.PROCESSING);
            log.info("Payment processing: {}", payment.getId());
            
        } else {
            // Payment failed
            payment.setPaymentStatus(PaymentStatus.FAILED);
            
            // Cancel the awarded bid
            HotelBid bid = hotelBidRepository.findById(payment.getBidId()).orElse(null);
            if (bid != null) {
                bid.setStatus(BidStatus.SUBMITTED);
                bid.setUpdatedAt(LocalDateTime.now());
                hotelBidRepository.save(bid);
            }
            
            log.error("Payment failed: {}", payment.getId());
        }
        
        paymentRepository.save(payment);
    }
    
    private void updatePlatformBalance(Payment payment) {
        PlatformBalance balance = platformBalanceRepository.findFirstByOrderByCreatedAtDesc()
                .orElseGet(() -> PlatformBalance.builder()
                        .totalCommissionsEarned(0.0)
                        .availableBalance(0.0)
                        .pendingCommissions(0.0)
                        .totalTransactions(0)
                        .completedPayments(0)
                        .pendingPayouts(0)
                        .completedPayouts(0)
                        .createdAt(LocalDateTime.now())
                        .build());
        
        balance.setTotalCommissionsEarned(
                balance.getTotalCommissionsEarned() + payment.getPlatformCommission());
        balance.setAvailableBalance(
                balance.getAvailableBalance() + payment.getPlatformCommission());
        balance.setTotalTransactions(balance.getTotalTransactions() + 1);
        balance.setCompletedPayments(balance.getCompletedPayments() + 1);
        balance.setPendingPayouts(balance.getPendingPayouts() + 1);
        balance.setLastUpdated(LocalDateTime.now());
        
        platformBalanceRepository.save(balance);
        log.info("Platform balance updated. Commission: {}", payment.getPlatformCommission());
    }

    @Override
    public PaymentResponse getPaymentById(String paymentId) {
        log.info("Getting payment by ID: {}", paymentId);
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + paymentId));
        return convertToResponse(payment);
    }

    @Override
    public PaymentResponse getPaymentByOrderId(String orderId) {
        log.info("Getting payment by order ID: {}", orderId);
        return paymentRepository.findByPayHereOrderId(orderId)
                .map(this::convertToResponse)
                .orElseThrow(() -> new RuntimeException("Payment not found with order ID: " + orderId));
    }

    @Override
    public Page<PaymentResponse> getPaymentsByDmc(String dmcUserId, Pageable pageable) {
        log.info("Getting payments for DMC user: {} with pagination", dmcUserId);
        Page<Payment> payments = paymentRepository.findByDmcUserIdOrderByCreatedAtDesc(dmcUserId, pageable);
        return payments.map(this::convertToResponse);
    }

    @Override
    public Page<PaymentResponse> getPaymentsByHotel(String hotelUserId, Pageable pageable) {
        log.info("Getting payments for hotel user: {} with pagination", hotelUserId);
        Page<Payment> payments = paymentRepository.findByHotelUserIdOrderByCreatedAtDesc(hotelUserId, pageable);
        return payments.map(this::convertToResponse);
    }

    @Override
    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        log.info("Getting all payments with pagination");
        Page<Payment> payments = paymentRepository.findAll(pageable);
        return payments.map(this::convertToResponse);
    }

    @Override
    public Page<PaymentResponse> getPaymentsByStatus(String status, Pageable pageable) {
        log.info("Getting payments by status: {} with pagination", status);
        PaymentStatus paymentStatus = PaymentStatus.valueOf(status.toUpperCase());
        Page<Payment> payments = paymentRepository.findByPaymentStatusOrderByCreatedAtDesc(paymentStatus, pageable);
        return payments.map(this::convertToResponse);
    }

    @Override
    @Transactional
    public PaymentResponse approvePayoutAndInitiate(ApprovePayoutRequest request, String adminUserId) {
        log.info("Approving payout for payment: {} by admin: {}", request.getPaymentId(), adminUserId);
        
        // Get payment
        Payment payment = paymentRepository.findById(request.getPaymentId())
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + request.getPaymentId()));
        
        // Validate payment state
        if (payment.getPaymentStatus() != PaymentStatus.COMPLETED) {
            throw new RuntimeException("Cannot approve payout for non-completed payment");
        }
        
        if (!payment.canBeApproved()) {
            throw new RuntimeException("Payment payout cannot be approved in current state");
        }
        
        // Verify admin user exists
        userRepository.findById(adminUserId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));
        
        // Check if hotel has bank details
        HotelBankDetails bankDetails = bankDetailsRepository.findByHotelUserId(payment.getHotelUserId())
                .orElseThrow(() -> new RuntimeException("Hotel bank details not found. Cannot process payout."));
        
        if (bankDetails.getIsVerified() == null || !bankDetails.getIsVerified()) {
            throw new RuntimeException("Hotel bank details not verified. Cannot process payout.");
        }
        
        // Update payment with approval
        payment.setPayoutStatus(PayoutStatus.APPROVED);
        payment.setPayoutApprovedAt(LocalDateTime.now());
        payment.setApprovedByAdminId(adminUserId);
        if (request.getAdminNotes() != null) {
            payment.setAdminNotes(request.getAdminNotes());
        }
        
        // Save payment
        Payment savedPayment = paymentRepository.save(payment);
        log.info("Payout approved for payment: {}", request.getPaymentId());
        
        // Send notification email to hotel
        // emailService.sendPayoutApprovedEmail(payment.getHotelUserId(), payment);
        
        return convertToResponse(savedPayment);
    }

    @Override
    @Transactional
    public void processPendingPayouts() {
        log.info("Processing pending payouts...");
        
        // Find all approved payouts that haven't been processed
        Page<Payment> approvedPayouts = paymentRepository.findByPayoutStatusOrderByCreatedAtDesc(
                PayoutStatus.APPROVED, Pageable.unpaged());
        
        log.info("Found {} approved payouts to process", approvedPayouts.getTotalElements());
        
        for (Payment payment : approvedPayouts.getContent()) {
            try {
                // Get hotel bank details
                HotelBankDetails bankDetails = bankDetailsRepository.findByHotelUserId(payment.getHotelUserId())
                        .orElseThrow(() -> new RuntimeException("Hotel bank details not found"));
                
                // Update status to processing
                payment.setPayoutStatus(PayoutStatus.PROCESSING);
                paymentRepository.save(payment);
                
                // Call PayHere payout API
                String payoutReference = payHereService.processPayoutToHotel(
                        payment.getId(),
                        bankDetails.getAccountNumber(),
                        payment.getHotelPayout(),
                        "LKR",
                        "Payout for bid: " + payment.getBidId()
                );
                
                // Update payment with payout details
                payment.setPayoutStatus(PayoutStatus.PAID);
                payment.setPayoutCompletedAt(LocalDateTime.now());
                payment.setPayoutReference(payoutReference);
                
                // Update platform balance
                PlatformBalance balance = platformBalanceRepository.findFirstByOrderByCreatedAtDesc()
                        .orElseGet(PlatformBalance::new);
                balance.setPendingPayouts(Math.max(0, balance.getPendingPayouts() - 1));
                balance.setCompletedPayouts(balance.getCompletedPayouts() + 1);
                platformBalanceRepository.save(balance);
                
                paymentRepository.save(payment);
                
                log.info("Payout processed successfully for payment: {}, reference: {}", 
                        payment.getId(), payoutReference);
                
                // Send success email to hotel
                // emailService.sendPayoutCompletedEmail(payment.getHotelUserId(), payment);
                
            } catch (Exception e) {
                log.error("Error processing payout for payment: {}", payment.getId(), e);
                
                // Update status to failed
                payment.setPayoutStatus(PayoutStatus.FAILED);
                paymentRepository.save(payment);
                
                // Send failure notification
                // emailService.sendPayoutFailedEmail(payment.getHotelUserId(), payment);
            }
        }
        
        log.info("Finished processing pending payouts");
    }

    @Override
    @Transactional
    public HotelBankDetails saveHotelBankDetails(HotelBankDetailsRequest request, String hotelUserId) {
        log.info("Saving bank details for hotel user: {}", hotelUserId);
        
        // Verify hotel user exists
        userRepository.findById(hotelUserId)
                .orElseThrow(() -> new RuntimeException("Hotel user not found"));
        
        // Check if bank details already exist
        HotelBankDetails bankDetails = bankDetailsRepository.findByHotelUserId(hotelUserId)
                .orElseGet(() -> {
                    HotelBankDetails newDetails = new HotelBankDetails();
                    newDetails.setHotelUserId(hotelUserId);
                    newDetails.setCreatedAt(LocalDateTime.now());
                    return newDetails;
                });
        
        // Update bank details
        bankDetails.setAccountHolderName(request.getAccountHolderName());
        bankDetails.setBankName(request.getBankName());
        bankDetails.setBranchName(request.getBranchName());
        bankDetails.setAccountNumber(request.getAccountNumber());
        bankDetails.setSwiftCode(request.getSwiftCode());
        bankDetails.setIfscCode(request.getIfscCode());
        bankDetails.setRoutingNumber(request.getRoutingNumber());
        bankDetails.setUpdatedAt(LocalDateTime.now());
        
        // Reset verification if details changed
        if (bankDetails.getId() != null) {
            bankDetails.setIsVerified(false);
            bankDetails.setVerifiedByAdminId(null);
            bankDetails.setVerifiedAt(null);
        }
        
        HotelBankDetails saved = bankDetailsRepository.save(bankDetails);
        log.info("Bank details saved for hotel user: {}", hotelUserId);
        
        return saved;
    }

    @Override
    public HotelBankDetails getHotelBankDetails(String hotelUserId) {
        log.info("Getting bank details for hotel user: {}", hotelUserId);
        return bankDetailsRepository.findByHotelUserId(hotelUserId)
                .orElseThrow(() -> new RuntimeException("Bank details not found for hotel user: " + hotelUserId));
    }

    @Override
    @Transactional
    public HotelBankDetails verifyHotelBankDetails(String hotelUserId, String adminUserId) {
        log.info("Verifying bank details for hotel: {} by admin: {}", hotelUserId, adminUserId);
        
        // Verify admin user exists
        userRepository.findById(adminUserId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));
        
        // Get bank details
        HotelBankDetails bankDetails = bankDetailsRepository.findByHotelUserId(hotelUserId)
                .orElseThrow(() -> new RuntimeException("Bank details not found for hotel user: " + hotelUserId));
        
        // Verify bank details
        bankDetails.setIsVerified(true);
        bankDetails.setVerifiedByAdminId(adminUserId);
        bankDetails.setVerifiedAt(LocalDateTime.now());
        
        HotelBankDetails verified = bankDetailsRepository.save(bankDetails);
        log.info("Bank details verified for hotel user: {}", hotelUserId);
        
        // Send notification to hotel
        // emailService.sendBankDetailsVerifiedEmail(hotelUserId, bankDetails);
        
        return verified;
    }

    @Override
    public PlatformBalanceResponse getPlatformBalance() {
        log.info("Getting platform balance");
        
        PlatformBalance balance = platformBalanceRepository.findFirstByOrderByCreatedAtDesc()
                .orElseGet(() -> {
                    PlatformBalance newBalance = new PlatformBalance();
                    newBalance.setCreatedAt(LocalDateTime.now());
                    return platformBalanceRepository.save(newBalance);
                });
        
        // Build response
        PlatformBalanceResponse response = new PlatformBalanceResponse();
        response.setTotalCommissionsEarned(balance.getTotalCommissionsEarned());
        response.setAvailableBalance(balance.getAvailableBalance());
        response.setPendingCommissions(balance.getPendingCommissions());
        response.setTotalTransactions(balance.getTotalTransactions());
        response.setCompletedPayments(balance.getCompletedPayments());
        response.setPendingPayouts(balance.getPendingPayouts());
        response.setCompletedPayouts(balance.getCompletedPayouts());
        response.setLastUpdated(balance.getLastUpdated() != null ? balance.getLastUpdated().toString() : null);
        
        return response;
    }

    @Override
    @Transactional
    public void cancelExpiredPayments() {
        log.info("Cancelling expired payments...");
        
        // Find all pending payments that have expired
        List<Payment> expiredPayments = paymentRepository.findByPaymentStatusAndPaymentExpiresAtBefore(
                PaymentStatus.PENDING,
                LocalDateTime.now()
        );
        
        log.info("Found {} expired payments to cancel", expiredPayments.size());
        
        for (Payment payment : expiredPayments) {
            try {
                // Cancel payment
                payment.setPaymentStatus(PaymentStatus.CANCELLED);
                
                // Note: Payment entity doesn't have setCancelledAt or setCancellationReason
                // We'll just update the status
                
                paymentRepository.save(payment);
                log.info("Cancelled expired payment: {}", payment.getId());
                
                // Send notification to DMC
                // emailService.sendPaymentExpiredEmail(payment.getDmcUserId(), payment);
                
            } catch (Exception e) {
                log.error("Error cancelling expired payment: {}", payment.getId(), e);
            }
        }
        
        log.info("Finished cancelling expired payments");
    }

    // Helper method to convert Payment entity to PaymentResponse DTO
    private PaymentResponse convertToResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setInquiryId(payment.getInquiryId());
        response.setBidId(payment.getBidId());
        response.setDmcUserId(payment.getDmcUserId());
        response.setDmcUsername(payment.getDmcUsername());
        response.setDmcCompanyName(payment.getDmcCompanyName());
        response.setHotelUserId(payment.getHotelUserId());
        response.setHotelUsername(payment.getHotelUsername());
        response.setHotelName(payment.getHotelName());
        response.setTotalAmount(payment.getTotalAmount());
        response.setOriginalCurrency(payment.getOriginalCurrency());
        response.setOriginalAmount(payment.getOriginalAmount());
        response.setAmountInLkr(payment.getAmountInLkr());
        response.setPlatformCommission(payment.getPlatformCommission());
        response.setHotelPayout(payment.getHotelPayout());
        response.setPaymentStatus(payment.getPaymentStatus());
        response.setPayoutStatus(payment.getPayoutStatus());
        response.setPayHereOrderId(payment.getPayHereOrderId());
        response.setPayHerePaymentId(payment.getPayHerePaymentId());
        response.setPayHereTransactionId(payment.getPayHereTransactionId());
        response.setCreatedAt(payment.getCreatedAt());
        response.setPaymentCompletedAt(payment.getPaymentCompletedAt());
        response.setPaymentExpiresAt(payment.getPaymentExpiresAt());
        response.setPayoutApprovedAt(payment.getPayoutApprovedAt());
        response.setPayoutCompletedAt(payment.getPayoutCompletedAt());
        response.setApprovedByAdminUsername(payment.getApprovedByAdminUsername());
        response.setAdminNotes(payment.getAdminNotes());
        response.setIsExpired(payment.isExpired());
        
        // Calculate minutes until expiry
        if (payment.getPaymentExpiresAt() != null && !payment.isExpired()) {
            long minutes = ChronoUnit.MINUTES.between(LocalDateTime.now(), payment.getPaymentExpiresAt());
            response.setMinutesUntilExpiry(minutes);
        }
        
        return response;
    }
}
