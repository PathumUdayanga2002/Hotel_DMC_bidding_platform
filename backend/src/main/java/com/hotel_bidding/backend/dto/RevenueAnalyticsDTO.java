package com.hotel_bidding.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueAnalyticsDTO {
    private BigDecimal totalRevenue; // Year to Date
    private BigDecimal platformCommission;
    private BigDecimal averageBookingValue;
    private Double growthRate; // Percentage
    
    // Additional metrics for detailed view
    private BigDecimal monthlyRevenue;
    private BigDecimal quarterlyRevenue;
    private Integer totalBookings;
    private Integer activeHotels;
    private Integer activeDMCs;
}
