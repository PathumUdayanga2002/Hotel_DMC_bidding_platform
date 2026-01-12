package com.hotel_bidding.backend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Revenue Analytics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueAnalyticsDTO {
    
    private Double totalRevenueYTD;           // Total revenue year-to-date
    private Double platformCommission;        // Total commission earned
    private Double subscriptionRevenue;       // Revenue from subscriptions
    private Double averageBookingValue;       // Average booking amount
    private Double growthRate;                // Growth rate percentage (YoY or MoM)
    private String currency;                  // Default currency (e.g., "USD")
    
    // Additional insights
    private Integer totalBookingsYTD;         // Total number of bookings
    private Double previousPeriodRevenue;     // For growth calculation
    private Integer previousPeriodBookings;   // For comparison
}
