package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.dto.analytics.PlatformAnalyticsDTO;
import com.hotel_bidding.backend.dto.analytics.RevenueAnalyticsDTO;
import com.hotel_bidding.backend.dto.analytics.PlatformPerformanceDTO;
import com.hotel_bidding.backend.dto.analytics.TopHotelMarketDTO;

import java.util.List;

/**
 * Service interface for Platform Analytics
 */
public interface PlatformAnalyticsService {
    
    /**
     * Get complete platform analytics
     */
    PlatformAnalyticsDTO getPlatformAnalytics();
    
    /**
     * Get revenue analytics for year-to-date
     */
    RevenueAnalyticsDTO getRevenueAnalytics();
    
    /**
     * Get platform performance metrics
     */
    PlatformPerformanceDTO getPlatformPerformance();
    
    /**
     * Get top performing hotels by market share
     * @param limit Number of top hotels to return
     */
    List<TopHotelMarketDTO> getTopHotelMarkets(int limit);
}
