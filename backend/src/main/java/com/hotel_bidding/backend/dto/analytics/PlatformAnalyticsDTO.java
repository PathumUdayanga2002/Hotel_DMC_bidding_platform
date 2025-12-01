package com.hotel_bidding.backend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Complete Platform Analytics DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlatformAnalyticsDTO {
    
    private RevenueAnalyticsDTO revenueAnalytics;
    private PlatformPerformanceDTO platformPerformance;
    private List<TopHotelMarketDTO> topHotelMarkets;
    
    private String generatedAt;               // Timestamp of analytics generation
    private String period;                    // Period covered (e.g., "YTD 2025")
}
