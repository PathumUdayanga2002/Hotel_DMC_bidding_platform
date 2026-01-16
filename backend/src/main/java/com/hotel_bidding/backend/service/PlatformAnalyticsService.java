package com.hotel_bidding.backend.service;

import java.util.List;

import com.hotel_bidding.backend.dto.analytics.PlatformAnalyticsDTO;
import com.hotel_bidding.backend.dto.analytics.PlatformPerformanceDTO;
import com.hotel_bidding.backend.dto.analytics.RevenueAnalyticsDTO;
import com.hotel_bidding.backend.dto.analytics.TopHotelMarketDTO;

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
     * @param sortBy Sort criteria (revenue, successRate, totalBids)
     * @param minStars Minimum star rating filter
     * @param city City filter
     */
    List<TopHotelMarketDTO> getTopHotelMarkets(int limit, String sortBy, Integer minStars, String city);
    
    /**
     * Get top performing hotels by market share (backward compatibility)
     * @param limit Number of top hotels to return
     */
    default List<TopHotelMarketDTO> getTopHotelMarkets(int limit) {
        return getTopHotelMarkets(limit, null, null, null);
    }
}
