package com.hotel_bidding.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * Enhanced response for DMC dashboard statistics with analytics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DMCDashboardStatsResponse {
    
    // Basic Stats
    private long totalInquiries;
    private long openInquiries;
    private long closedInquiries;
    private long awardedInquiries;
    private long cancelledInquiries;
    
    private long totalBidsReceived;
    private long pendingBids;
    private long acceptedBids;
    private long rejectedBids;
    
    private Double averageBidsPerInquiry;
    
    // Rates
    private Double bidAwardRate;        // (awardedInquiries / totalInquiries) * 100
    private Double bidRejectionRate;    // (rejectedBids / totalBidsReceived) * 100
    private Double inquiryCompletionRate; // (closedInquiries / totalInquiries) * 100
    
    // Time Series Data for Charts
    private List<TimeSeriesData> dailyStats;
    private List<TimeSeriesData> weeklyStats;
    private List<TimeSeriesData> monthlyStats;
    
    // Bid Status Distribution (for Pie Chart)
    private Map<String, Long> bidStatusDistribution;
    
    // Inquiry Status Distribution (for Pie Chart)
    private Map<String, Long> inquiryStatusDistribution;
    
    // Top Performing Cities (bids received by city)
    private List<CityStats> topCitiesByBids;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TimeSeriesData {
        private String label;  // Date label (e.g., "Jan 15", "Week 3", "January")
        private long inquiries;
        private long bidsReceived;
        private long awarded;
        private long rejected;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CityStats {
        private String city;
        private long inquiryCount;
        private long bidCount;
    }
}
