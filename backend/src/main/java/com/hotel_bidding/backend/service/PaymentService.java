package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.dto.request.ApprovePayoutRequest;
import com.hotel_bidding.backend.dto.request.HotelBankDetailsRequest;
import com.hotel_bidding.backend.dto.request.InitiatePaymentRequest;
import com.hotel_bidding.backend.dto.response.PayHereInitiationResponse;
import com.hotel_bidding.backend.dto.response.PaymentResponse;
import com.hotel_bidding.backend.dto.response.PlatformBalanceResponse;
import com.hotel_bidding.backend.entity.HotelBankDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

/**
 * Payment service interface
 * 
 * NOTE: This interface contains methods for the OLD bid payment system.
 * initiatePayment() and handlePayHereNotification() are DEPRECATED.
 * Use the subscription system instead for payments.
 */
public interface PaymentService {
    
    // Payment Initiation - DEPRECATED (Old Bid Payment System)
    /**
     * @deprecated This method is part of the OLD bid payment system.
     * Use subscription-based access instead. Will throw UnsupportedOperationException.
     */
    @Deprecated
    PayHereInitiationResponse initiatePayment(InitiatePaymentRequest request, String dmcUserId);
    
    // PayHere Webhook - DEPRECATED (Old Bid Payment System)
    /**
     * @deprecated This webhook is for the OLD bid payment system.
     * Will throw UnsupportedOperationException.
     */
    @Deprecated
    void handlePayHereNotification(Map<String, String> params);
    
    // Payment Queries
    PaymentResponse getPaymentById(String paymentId);
    PaymentResponse getPaymentByOrderId(String orderId);
    Page<PaymentResponse> getPaymentsByDmc(String dmcUserId, Pageable pageable);
    Page<PaymentResponse> getPaymentsByHotel(String hotelUserId, Pageable pageable);
    Page<PaymentResponse> getAllPayments(Pageable pageable);
    Page<PaymentResponse> getPaymentsByStatus(String status, Pageable pageable);
    
    // Admin Actions
    PaymentResponse approvePayoutAndInitiate(ApprovePayoutRequest request, String adminUserId);
    void processPendingPayouts();
    
    // Hotel Bank Details
    HotelBankDetails saveHotelBankDetails(HotelBankDetailsRequest request, String hotelUserId);
    HotelBankDetails getHotelBankDetails(String hotelUserId);
    HotelBankDetails verifyHotelBankDetails(String hotelUserId, String adminUserId);
    
    // Platform Balance
    PlatformBalanceResponse getPlatformBalance();
    
    // Scheduled Tasks
    void cancelExpiredPayments();
}
