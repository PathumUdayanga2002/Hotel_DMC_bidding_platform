package com.hotel_bidding.backend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Platform Performance Metrics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlatformPerformanceDTO {
    
    private Double bookingSuccessRate;        // Percentage of successful bookings
    private Double averageResponseTime;       // Average response time in hours
    private Double userSatisfaction;          // User satisfaction score (0-100)
    private Double disputeRate;               // Percentage of disputed transactions
    
    // Additional metrics for context
    private Integer totalBids;                // Total bids received
    private Integer acceptedBids;             // Total accepted bids
    private Integer completedPayments;        // Total completed payments
    private Integer totalDisputes;            // Total disputes/issues
    private Double averageBidResponseTime;    // Average time for hotels to respond
}
