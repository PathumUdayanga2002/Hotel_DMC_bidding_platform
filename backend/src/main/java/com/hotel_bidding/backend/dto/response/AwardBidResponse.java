package com.hotel_bidding.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for awarding a bid with payment information
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AwardBidResponse {
    
    private BidInquiryResponse inquiry;
    private String message;
    private String paymentRequired;
    private String nextStep;
    
    // Payment information (if payment is required)
    private String paymentUrl;           // URL to initiate payment
    private String inquiryId;
    private String bidId;
    private Double bidAmount;
    private String currency;
}
