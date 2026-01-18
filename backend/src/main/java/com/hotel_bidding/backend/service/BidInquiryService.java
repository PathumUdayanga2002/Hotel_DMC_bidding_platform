package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.constants.BidInquiryStatus;
import com.hotel_bidding.backend.dto.request.CreateBidInquiryRequest;
import com.hotel_bidding.backend.dto.request.UpdateBidInquiryRequest;
import com.hotel_bidding.backend.dto.response.BidInquiryResponse;
import com.hotel_bidding.backend.dto.response.BidInquiryStatsResponse;
import com.hotel_bidding.backend.dto.response.DMCDashboardStatsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for BidInquiry operations (DMC side)
 */
public interface BidInquiryService {
    
    /**
     * Create a new bid inquiry (only APPROVED DMCs)
     */
    BidInquiryResponse createInquiry(CreateBidInquiryRequest request, String dmcUserId);
    
    /**
     * Update an existing inquiry
     */
    BidInquiryResponse updateInquiry(String inquiryId, UpdateBidInquiryRequest request, String dmcUserId);
    
    /**
     * Get inquiry by ID
     */
    BidInquiryResponse getInquiryById(String inquiryId);
    
    /**
     * Get inquiry by ID (increment view count for hotels)
     */
    BidInquiryResponse getInquiryByIdAndIncrementView(String inquiryId);
    
    /**
     * Get all inquiries by DMC user
     */
    Page<BidInquiryResponse> getInquiriesByDmcUser(String dmcUserId, Pageable pageable);
    
    /**
     * Get inquiries by DMC user and status
     */
    Page<BidInquiryResponse> getInquiriesByDmcUserAndStatus(String dmcUserId, BidInquiryStatus status, Pageable pageable);
    
    /**
     * Search inquiries by DMC user with keyword
     */
    Page<BidInquiryResponse> searchInquiriesByDmcUser(String dmcUserId, String keyword, Pageable pageable);
    
    /**
     * Get available inquiries for hotels (by cities)
     */
    Page<BidInquiryResponse> getAvailableInquiriesForHotel(String hotelCity, Pageable pageable);
    
    /**
     * Close inquiry manually (by DMC)
     */
    BidInquiryResponse closeInquiry(String inquiryId, String dmcUserId);
    
    /**
     * Cancel inquiry (by DMC)
     */
    BidInquiryResponse cancelInquiry(String inquiryId, String dmcUserId);
    
    /**
     * Award inquiry to a bid (accept a bid)
     */
    BidInquiryResponse awardInquiry(String inquiryId, String bidId, String dmcUserId);
    
    /**
     * Get inquiry statistics for DMC dashboard
     */
    BidInquiryStatsResponse getInquiryStats(String dmcUserId);
    
    /**
     * Get enhanced dashboard statistics with analytics
     */
    DMCDashboardStatsResponse getDashboardStats(String dmcUserId, String period);
    
    /**
     * Auto-close expired inquiries (scheduled task)
     */
    void autoCloseExpiredInquiries();
}
