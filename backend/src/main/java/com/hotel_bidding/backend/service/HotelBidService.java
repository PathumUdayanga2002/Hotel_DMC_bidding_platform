package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.constants.BidStatus;
import com.hotel_bidding.backend.dto.request.CreateHotelBidRequest;
import com.hotel_bidding.backend.dto.request.UpdateHotelBidRequest;
import com.hotel_bidding.backend.dto.response.HotelBidResponse;
import com.hotel_bidding.backend.dto.response.HotelBidStatsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for HotelBid operations (Hotel side)
 */
public interface HotelBidService {
    
    /**
     * Create a new bid (only APPROVED hotels)
     */
    HotelBidResponse createBid(CreateHotelBidRequest request, String hotelUserId);
    
    /**
     * Update an existing bid
     */
    HotelBidResponse updateBid(String bidId, UpdateHotelBidRequest request, String hotelUserId);
    
    /**
     * Get bid by ID
     */
    HotelBidResponse getBidById(String bidId);
    
    /**
     * Get all bids for an inquiry (DMC views all bids)
     */
    List<HotelBidResponse> getBidsByInquiryId(String inquiryId);
    
    Page<HotelBidResponse> getBidsByInquiryId(String inquiryId, Pageable pageable);
    
    /**
     * Get all bids by hotel user
     */
    Page<HotelBidResponse> getBidsByHotelUser(String hotelUserId, Pageable pageable);
    
    /**
     * Get bids by hotel and status
     */
    Page<HotelBidResponse> getBidsByHotelUserAndStatus(String hotelUserId, BidStatus status, Pageable pageable);
    
    /**
     * Search bids by hotel with keyword
     */
    Page<HotelBidResponse> searchBidsByHotel(String hotelUserId, String keyword, Pageable pageable);
    
    /**
     * Accept a bid (DMC accepts hotel's bid)
     */
    HotelBidResponse acceptBid(String bidId, String dmcUserId);
    
    /**
     * Reject a bid (DMC rejects hotel's bid)
     */
    HotelBidResponse rejectBid(String bidId, String rejectionReason, String dmcUserId);
    
    /**
     * Withdraw a bid (hotel withdraws their bid)
     */
    HotelBidResponse withdrawBid(String bidId, String hotelUserId);
    
    /**
     * Add negotiation notes (DMC negotiates with hotel)
     */
    HotelBidResponse addNegotiationNotes(String bidId, String notes, String dmcUserId);
    
    /**
     * Get bid statistics for hotel dashboard
     */
    HotelBidStatsResponse getBidStats(String hotelUserId);
    
    /**
     * Check if hotel already bid on inquiry
     */
    boolean hasHotelBidOnInquiry(String inquiryId, String hotelUserId);
}
