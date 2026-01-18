package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.constants.ActivityType;
import com.hotel_bidding.backend.constants.BidInquiryStatus;
import com.hotel_bidding.backend.dto.request.CreateBidInquiryRequest;
import com.hotel_bidding.backend.dto.request.UpdateBidInquiryRequest;
import com.hotel_bidding.backend.dto.response.AwardBidResponse;
import com.hotel_bidding.backend.dto.response.BidInquiryResponse;
import com.hotel_bidding.backend.dto.response.BidInquiryStatsResponse;
import com.hotel_bidding.backend.dto.response.HotelBidResponse;
import com.hotel_bidding.backend.entity.User;
import com.hotel_bidding.backend.exception.ResourceNotFoundException;
import com.hotel_bidding.backend.repository.UserRepository;
import com.hotel_bidding.backend.service.ActivityLogService;
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

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST Controller for DMC Bid Inquiry Management
 * Handles inquiry creation, updates, closing, canceling, and awarding bids
 */
@RestController
@RequestMapping("/dmc/inquiries")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('DMC_USER', 'DMC_SUPER_ADMIN', 'DMC_STAFF_ADMIN')")
public class DMCBidInquiryController {

    private final BidInquiryService bidInquiryService;
    private final HotelBidService hotelBidService;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;

    /**
     * Helper method to get user ID from authentication
     */
    private String getUserId(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getId();
    }

    /**
     * Create a new bid inquiry
     */
    @PostMapping
    public ResponseEntity<BidInquiryResponse> createInquiry(
            @Valid @RequestBody CreateBidInquiryRequest request,
            Authentication authentication) {
        
        log.info("Creating new inquiry by DMC: {}", authentication.getName());
        
        String dmcUserId = getUserId(authentication);
        User dmcUser = userRepository.findById(dmcUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        BidInquiryResponse inquiry = bidInquiryService.createInquiry(request, authentication.getName());
        
        // Log activity
        String companyName = dmcUser.getFullName() != null ? dmcUser.getFullName() : dmcUser.getUsername();
        activityLogService.logActivity(
                ActivityType.INQUIRY_CREATED,
                dmcUserId,
                dmcUser.getFullName(),
                companyName,
                dmcUserId,
                inquiry.getId(),
                "BidInquiry",
                String.format("Created inquiry: %s", inquiry.getTitle()),
                String.format("Destinations: %s, Adults: %d, Rooms: %d", 
                        String.join(", ", request.getDestinationCities()), 
                        request.getNumberOfAdults(), 
                        request.getNumberOfRooms()),
                null
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(inquiry);
    }

    /**
     * Get all inquiries posted by the authenticated DMC
     */
    @GetMapping("/my-inquiries")
    public ResponseEntity<Page<BidInquiryResponse>> getMyInquiries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) BidInquiryStatus status,
            Authentication authentication) {
        
        // Get user ID from authentication
        String dmcUserId = getUserId(authentication);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "postedAt"));
        
        Page<BidInquiryResponse> inquiries;
        if (status != null) {
            inquiries = bidInquiryService.getInquiriesByDmcUserAndStatus(dmcUserId, status, pageable);
        } else {
            inquiries = bidInquiryService.getInquiriesByDmcUser(dmcUserId, pageable);
        }
        
        return ResponseEntity.ok(inquiries);
    }

    /**
     * Get inquiry details by ID
     */
    @GetMapping("/{inquiryId}")
    public ResponseEntity<BidInquiryResponse> getInquiryById(@PathVariable String inquiryId) {
        BidInquiryResponse inquiry = bidInquiryService.getInquiryById(inquiryId);
        return ResponseEntity.ok(inquiry);
    }

    /**
     * Update an existing inquiry
     */
    @PutMapping("/{inquiryId}")
    public ResponseEntity<BidInquiryResponse> updateInquiry(
            @PathVariable String inquiryId,
            @Valid @RequestBody UpdateBidInquiryRequest request,
            Authentication authentication) {
        
        log.info("Updating inquiry {} by DMC: {}", inquiryId, authentication.getName());
        
        String dmcUserId = getUserId(authentication);
        User dmcUser = userRepository.findById(dmcUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        BidInquiryResponse updatedInquiry = bidInquiryService.updateInquiry(inquiryId, request, dmcUserId);
        
        // Log activity
        String companyName = dmcUser.getFullName() != null ? dmcUser.getFullName() : dmcUser.getUsername();
        activityLogService.logActivity(
                ActivityType.INQUIRY_UPDATED,
                dmcUserId,
                dmcUser.getFullName(),
                companyName,
                dmcUserId,
                inquiryId,
                "BidInquiry",
                String.format("Updated inquiry: %s", updatedInquiry.getTitle()),
                null,
                null
        );
        
        return ResponseEntity.ok(updatedInquiry);
    }

    /**
     * Close an inquiry (no more bids accepted)
     */
    @PutMapping("/{inquiryId}/close")
    public ResponseEntity<BidInquiryResponse> closeInquiry(
            @PathVariable String inquiryId,
            Authentication authentication) {
        
        log.info("Closing inquiry {} by DMC: {}", inquiryId, authentication.getName());
        
        String dmcUserId = getUserId(authentication);
        BidInquiryResponse closedInquiry = bidInquiryService.closeInquiry(inquiryId, dmcUserId);
        return ResponseEntity.ok(closedInquiry);
    }

    /**
     * Cancel an inquiry
     */
    @PutMapping("/{inquiryId}/cancel")
    public ResponseEntity<BidInquiryResponse> cancelInquiry(
            @PathVariable String inquiryId,
            Authentication authentication) {
        
        log.info("Canceling inquiry {} by DMC: {}", inquiryId, authentication.getName());
        
        String dmcUserId = getUserId(authentication);
        BidInquiryResponse canceledInquiry = bidInquiryService.cancelInquiry(inquiryId, dmcUserId);
        return ResponseEntity.ok(canceledInquiry);
    }

    /**
     * Award a bid to a hotel
     * After awarding, DMC needs to initiate payment
     */
    @PutMapping("/{inquiryId}/award/{bidId}")
    public ResponseEntity<AwardBidResponse> awardBid(
            @PathVariable String inquiryId,
            @PathVariable String bidId,
            Authentication authentication) {
        
        log.info("Awarding bid {} for inquiry {} by DMC: {}", bidId, inquiryId, authentication.getName());
        
        String dmcUserId = getUserId(authentication);
        User dmcUser = userRepository.findById(dmcUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        BidInquiryResponse awardedInquiry = bidInquiryService.awardInquiry(inquiryId, bidId, dmcUserId);
        
        // Log activity
        String companyName = dmcUser.getFullName() != null ? dmcUser.getFullName() : dmcUser.getUsername();
        activityLogService.logActivity(
                ActivityType.BID_AWARDED,
                dmcUserId,
                dmcUser.getFullName(),
                companyName,
                dmcUserId,
                inquiryId,
                "BidInquiry",
                String.format("Awarded bid for inquiry: %s", awardedInquiry.getTitle()),
                String.format("Awarded to bid ID: %s", bidId),
                null
        );
        
        AwardBidResponse response = new AwardBidResponse();
        response.setInquiry(awardedInquiry);
        response.setMessage("Bid awarded successfully. Please proceed with payment.");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Reject a bid with a reason
     * Hotel will be notified via email and can submit a new improved bid
     */
    @PutMapping("/{inquiryId}/reject/{bidId}")
    public ResponseEntity<HotelBidResponse> rejectBid(
            @PathVariable String inquiryId,
            @PathVariable String bidId,
            @RequestBody String rejectionReason,
            Authentication authentication) {
        
        log.info("Rejecting bid {} for inquiry {} by DMC: {}", bidId, inquiryId, authentication.getName());
        
        String dmcUserId = getUserId(authentication);
        User dmcUser = userRepository.findById(dmcUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        HotelBidResponse rejectedBid = hotelBidService.rejectBid(bidId, rejectionReason, dmcUserId);
        
        // Log activity
        String companyName = dmcUser.getFullName() != null ? dmcUser.getFullName() : dmcUser.getUsername();
        activityLogService.logActivity(
                ActivityType.BID_REJECTED,
                dmcUserId,
                dmcUser.getFullName(),
                companyName,
                dmcUserId,
                inquiryId,
                "HotelBid",
                String.format("Rejected bid for inquiry: %s", rejectedBid.getInquiryTitle()),
                String.format("Rejected bid ID: %s, Reason: %s", bidId, rejectionReason),
                null
        );
        
        return ResponseEntity.ok(rejectedBid);
    }

    /**
     * Get all bids for a specific inquiry
     */
    @GetMapping("/{inquiryId}/bids")
    public ResponseEntity<Page<HotelBidResponse>> getBidsForInquiry(
            @PathVariable String inquiryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "submittedAt"));
        Page<HotelBidResponse> bids = hotelBidService.getBidsByInquiryId(inquiryId, pageable);
        
        return ResponseEntity.ok(bids);
    }

    /**
     * Get DMC statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<BidInquiryStatsResponse> getStats(Authentication authentication) {
        String dmcUserId = getUserId(authentication);
        BidInquiryStatsResponse stats = bidInquiryService.getInquiryStats(dmcUserId);
        return ResponseEntity.ok(stats);
    }

    /**
     * Get enhanced dashboard statistics with analytics
     */
    @GetMapping("/dashboard-stats")
    public ResponseEntity<com.hotel_bidding.backend.dto.response.DMCDashboardStatsResponse> getDashboardStats(
            @RequestParam(defaultValue = "daily") String period,
            Authentication authentication) {
        String dmcUserId = getUserId(authentication);
        com.hotel_bidding.backend.dto.response.DMCDashboardStatsResponse stats = 
                bidInquiryService.getDashboardStats(dmcUserId, period);
        return ResponseEntity.ok(stats);
    }

    /**
     * Search inquiries with filters
     */
    @GetMapping("/search")
    public ResponseEntity<Page<BidInquiryResponse>> searchInquiries(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        String dmcUserId = getUserId(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "postedAt"));
        
        Page<BidInquiryResponse> results = bidInquiryService.searchInquiriesByDmcUser(dmcUserId, keyword, pageable);
        return ResponseEntity.ok(results);
    }
}

