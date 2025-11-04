package com.hotel_bidding.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlatformAnalyticsDTO {
    private RevenueAnalyticsDTO revenueAnalytics;
    private PlatformPerformanceDTO platformPerformance;
    private List<TopMarketDTO> topMarkets;
    
    // Metadata
    private String period; // e.g., "2024", "Q4 2024", "YTD"
    private String generatedAt;
}
