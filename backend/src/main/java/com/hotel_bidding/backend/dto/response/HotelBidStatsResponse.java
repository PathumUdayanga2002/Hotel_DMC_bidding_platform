package com.hotel_bidding.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response for hotel bid statistics (Hotel Dashboard)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HotelBidStatsResponse {
    
    private long totalAvailableInquiries;
    private long totalBidsSubmitted;
    private long pendingBids;
    private long acceptedBids;
    private long rejectedBids;
    private long withdrawnBids;
    
    private Double winRate; // Percentage of accepted bids
}
