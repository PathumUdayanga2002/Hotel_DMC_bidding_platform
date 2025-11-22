package com.hotel_bidding.backend.dto.response;

import com.hotel_bidding.backend.constants.PaymentStatus;
import com.hotel_bidding.backend.constants.PayoutStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Payment response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    
    private String id;
    private String inquiryId;
    private String bidId;
    
    // DMC Details
    private String dmcUserId;
    private String dmcUsername;
    private String dmcCompanyName;
    
    // Hotel Details
    private String hotelUserId;
    private String hotelUsername;
    private String hotelName;
    
    // Payment Amounts
    private Double totalAmount;
    private String originalCurrency;
    private Double originalAmount;
    private Double amountInLkr;
    private Double platformCommission;
    private Double hotelPayout;
    
    // PayHere Details
    private String payHereOrderId;
    private String payHerePaymentId;
    private String payHereTransactionId;
    
    // Status
    private PaymentStatus paymentStatus;
    private PayoutStatus payoutStatus;
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime paymentCompletedAt;
    private LocalDateTime paymentExpiresAt;
    private LocalDateTime payoutApprovedAt;
    private LocalDateTime payoutCompletedAt;
    
    // Admin Info
    private String approvedByAdminUsername;
    private String adminNotes;
    
    // Additional Info
    private Boolean isExpired;
    private Long minutesUntilExpiry;
}
