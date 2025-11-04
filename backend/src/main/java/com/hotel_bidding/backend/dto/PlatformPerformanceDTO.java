package com.hotel_bidding.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlatformPerformanceDTO {
    private Double bookingSuccessRate; // Percentage
    private Double averageResponseTime; // In hours
    private Double userSatisfaction; // Rating out of 5
    private Double disputeRate; // Percentage
    
    // Additional metrics
    private Integer totalInquiries;
    private Integer successfulBookings;
    private Integer totalBids;
    private Integer acceptedBids;
    private Integer totalDisputes;
}
