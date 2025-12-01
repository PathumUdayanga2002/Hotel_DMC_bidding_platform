package com.hotel_bidding.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response for bid inquiry statistics (DMC Dashboard)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BidInquiryStatsResponse {
    
    private long totalInquiries;
    private long openInquiries;
    private long closedInquiries;
    private long awardedInquiries;
    private long cancelledInquiries;
    
    private long totalBidsReceived;
    private long pendingBids;
    private long acceptedBids;
    
    private Double averageBidsPerInquiry;
}
