package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.dto.PlatformAnalyticsDTO;

public interface PlatformAnalyticsService {
    
    /**
     * Get comprehensive platform analytics including revenue, performance, and market data
     * @param year The year for analytics (null for current year)
     * @return PlatformAnalyticsDTO with all analytics data
     */
    PlatformAnalyticsDTO getPlatformAnalytics(Integer year);
    
    /**
     * Get platform analytics for a specific period
     * @param startDate Start date in ISO format (yyyy-MM-dd)
     * @param endDate End date in ISO format (yyyy-MM-dd)
     * @return PlatformAnalyticsDTO with analytics for the specified period
     */
    PlatformAnalyticsDTO getPlatformAnalyticsByPeriod(String startDate, String endDate);
}
