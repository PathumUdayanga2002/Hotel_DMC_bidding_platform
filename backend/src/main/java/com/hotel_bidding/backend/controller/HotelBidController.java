package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.dto.request.CreateHotelBidRequest;
import com.hotel_bidding.backend.dto.request.UpdateHotelBidRequest;
import com.hotel_bidding.backend.dto.response.BidInquiryResponse;
import com.hotel_bidding.backend.dto.response.HotelBidResponse;
import com.hotel_bidding.backend.dto.response.HotelBidStatsResponse;
import com.hotel_bidding.backend.service.BidInquiryService;
import com.hotel_bidding.backend.service.HotelBidService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Hotel Bidding
 * Handles viewing available inquiries, submitting bids, and managing existing bids
 */
@RestController
@RequestMapping("/hotel")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('HOTEL_USER')")
public class HotelBidController {

    private final BidInquiryService bidInquiryService;
    private final HotelBidService hotelBidService;

    /**
     * Get available inquiries for hotel (filtered by hotel's city and open status)
     */
    @GetMapping("/inquiries/available")
    public ResponseEntity<Page<BidInquiryResponse>> getAvailableInquiries(
            @RequestParam(required = false) String hotelCity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        log.info("Fetching available inquiries for hotel: {}", authentication.getName());
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "postedAt"));
        
        // If hotelCity is not provided, we need to get it from hotel profile
        // For now, it's required as a parameter
        Page<BidInquiryResponse> inquiries = bidInquiryService.getAvailableInquiriesForHotel(hotelCity, pageable);
        
        return ResponseEntity.ok(inquiries);
    }

    /**
     * Get inquiry details (with view count increment)
     */
    @GetMapping("/inquiries/{inquiryId}")
    public ResponseEntity<BidInquiryResponse> getInquiryDetails(@PathVariable String inquiryId) {
        BidInquiryResponse inquiry = bidInquiryService.getInquiryByIdAndIncrementView(inquiryId);
        return ResponseEntity.ok(inquiry);
    }

    /**
     * Submit a bid for an inquiry
     */
    @PostMapping("/bids")
    public ResponseEntity<HotelBidResponse> submitBid(
            @Valid @RequestBody CreateHotelBidRequest request,
            Authentication authentication) {
        
        log.info("Submitting bid by hotel: {}", authentication.getName());
        
        HotelBidResponse bid = hotelBidService.createBid(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(bid);
    }

    /**
     * Get all bids submitted by the authenticated hotel
     */
    @GetMapping("/bids/my-bids")
    public ResponseEntity<Page<HotelBidResponse>> getMyBids(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        String hotelUserId = authentication.getName();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "submittedAt"));
        
        Page<HotelBidResponse> bids = hotelBidService.getBidsByHotelUser(hotelUserId, pageable);
        return ResponseEntity.ok(bids);
    }

    /**
     * Get a specific bid by ID
     */
    @GetMapping("/bids/{bidId}")
    public ResponseEntity<HotelBidResponse> getBidById(@PathVariable String bidId) {
        HotelBidResponse bid = hotelBidService.getBidById(bidId);
        return ResponseEntity.ok(bid);
    }

    /**
     * Update an existing bid
     */
    @PutMapping("/bids/{bidId}")
    public ResponseEntity<HotelBidResponse> updateBid(
            @PathVariable String bidId,
            @Valid @RequestBody UpdateHotelBidRequest request,
            Authentication authentication) {
        
        log.info("Updating bid {} by hotel: {}", bidId, authentication.getName());
        
        HotelBidResponse updatedBid = hotelBidService.updateBid(bidId, request, authentication.getName());
        return ResponseEntity.ok(updatedBid);
    }

    /**
     * Withdraw a bid
     */
    @PutMapping("/bids/{bidId}/withdraw")
    public ResponseEntity<HotelBidResponse> withdrawBid(
            @PathVariable String bidId,
            Authentication authentication) {
        
        log.info("Withdrawing bid {} by hotel: {}", bidId, authentication.getName());
        
        HotelBidResponse withdrawnBid = hotelBidService.withdrawBid(bidId, authentication.getName());
        return ResponseEntity.ok(withdrawnBid);
    }

    /**
     * Add negotiation notes to a bid
     */
    @PostMapping("/bids/{bidId}/negotiate")
    public ResponseEntity<HotelBidResponse> addNegotiationNotes(
            @PathVariable String bidId,
            @RequestParam String note,
            Authentication authentication) {
        
        log.info("Adding negotiation note to bid {} by hotel: {}", bidId, authentication.getName());
        
        HotelBidResponse bid = hotelBidService.addNegotiationNotes(bidId, note, authentication.getName());
        return ResponseEntity.ok(bid);
    }

    /**
     * Get hotel bid statistics
     */
    @GetMapping("/bids/stats")
    public ResponseEntity<HotelBidStatsResponse> getStats(Authentication authentication) {
        String hotelUserId = authentication.getName();
        HotelBidStatsResponse stats = hotelBidService.getBidStats(hotelUserId);
        return ResponseEntity.ok(stats);
    }

    /**
     * Search hotel's own bids
     */
    @GetMapping("/bids/search")
    public ResponseEntity<Page<HotelBidResponse>> searchMyBids(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        String hotelUserId = authentication.getName();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "submittedAt"));
        
        Page<HotelBidResponse> results = hotelBidService.searchBidsByHotel(hotelUserId, keyword, pageable);
        return ResponseEntity.ok(results);
    }
}
