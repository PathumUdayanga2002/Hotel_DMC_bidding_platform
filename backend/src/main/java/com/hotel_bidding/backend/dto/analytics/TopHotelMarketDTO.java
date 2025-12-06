package com.hotel_bidding.backend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Top Hotel Markets
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopHotelMarketDTO {
    
    private String hotelId;
    private String hotelName;
    private String city;
    private String country;
    private Integer totalBids;                // Total bids submitted by this hotel
    private Integer acceptedBids;             // Total accepted bids
    private Double totalRevenue;              // Total revenue generated
    private Double successRate;               // Success rate percentage
    private Double averageBidValue;           // Average bid amount
    private Integer hotelStars;               // Star rating
    private String status;                    // Hotel status (APPROVED, etc.)
}
