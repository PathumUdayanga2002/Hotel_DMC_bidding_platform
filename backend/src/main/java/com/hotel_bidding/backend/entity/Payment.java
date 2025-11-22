package com.hotel_bidding.backend.entity;

import com.hotel_bidding.backend.constants.PaymentStatus;
import com.hotel_bidding.backend.constants.PayoutStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Payment entity for bid transactions
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "payments")
public class Payment {
    
    @Id
    private String id;
    
    // References
    private String inquiryId;
    private String bidId;
    private String dmcUserId;
    private String dmcUsername;
    private String dmcCompanyName;
    private String hotelUserId;
    private String hotelUsername;
    private String hotelName;
    
    // Payment Details
    private Double totalAmount;           // Full bid amount
    private String originalCurrency;      // Original currency (USD, EUR, etc.)
    private Double originalAmount;        // Amount in original currency
    private Double amountInLkr;          // Converted to LKR for PayHere
    private Double platformCommission;    // 5% commission
    private Double hotelPayout;          // 95% payout to hotel
    
    // PayHere Details
    private String payHereOrderId;       // Our order ID
    private String payHerePaymentId;     // PayHere payment ID
    private String payHereTransactionId; // PayHere transaction reference
    
    // Status
    private PaymentStatus paymentStatus;
    private PayoutStatus payoutStatus;
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime paymentCompletedAt;
    private LocalDateTime paymentExpiresAt;    // 15 minutes from creation
    private LocalDateTime payoutApprovedAt;
    private LocalDateTime payoutCompletedAt;
    
    // Admin Actions
    private String approvedByAdminId;
    private String approvedByAdminUsername;
    private String adminNotes;
    
    // PayHere Webhook Data
    private String payHereStatusCode;
    private String payHereMessage;
    private String payHereMethod;          // Credit card, bank transfer, etc.
    private String payHereCardType;
    
    // Payout Details
    private String payoutReference;        // PayHere payout reference
    private String payoutBatchId;
    
    // Metadata
    private LocalDateTime updatedAt;
    
    /**
     * Check if payment has expired (15 minutes timeout)
     */
    public boolean isExpired() {
        return paymentExpiresAt != null && 
               LocalDateTime.now().isAfter(paymentExpiresAt) &&
               paymentStatus == PaymentStatus.PENDING;
    }
    
    /**
     * Check if payment can be cancelled
     */
    public boolean canBeCancelled() {
        return paymentStatus == PaymentStatus.PENDING || 
               paymentStatus == PaymentStatus.FAILED;
    }
    
    /**
     * Check if payout can be approved
     */
    public boolean canBeApproved() {
        return paymentStatus == PaymentStatus.COMPLETED &&
               payoutStatus == PayoutStatus.PENDING;
    }
}
