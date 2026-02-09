package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.constants.BidStatus;
import com.hotel_bidding.backend.dto.request.CreateHotelBidRequest;
import com.hotel_bidding.backend.dto.request.UpdateHotelBidRequest;
import com.hotel_bidding.backend.dto.response.HotelBidResponse;
import com.hotel_bidding.backend.dto.response.HotelBidStatsResponse;
import com.hotel_bidding.backend.entity.BidInquiry;
import com.hotel_bidding.backend.entity.HotelBid;
import com.hotel_bidding.backend.entity.HotelProfile;
import com.hotel_bidding.backend.entity.User;
import com.hotel_bidding.backend.exception.ResourceNotFoundException;
import com.hotel_bidding.backend.exception.UnauthorizedException;
import com.hotel_bidding.backend.repository.BidInquiryRepository;
import com.hotel_bidding.backend.repository.HotelBidRepository;
import com.hotel_bidding.backend.repository.HotelRepository;
import com.hotel_bidding.backend.repository.UserRepository;
import com.hotel_bidding.backend.service.HotelBidService;
import com.hotel_bidding.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of HotelBidService
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class HotelBidServiceImpl implements HotelBidService {
    
    private final HotelBidRepository hotelBidRepository;
    private final BidInquiryRepository bidInquiryRepository;
    private final HotelRepository hotelRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    
    @Override
    @Transactional
    public HotelBidResponse createBid(CreateHotelBidRequest request, String hotelUserId) {
        log.info("Creating bid for inquiry: {} by hotel user: {}", request.getInquiryId(), hotelUserId);
        
        // Get effective user ID (if staff, use parent's ID)
        String effectiveUserId = getEffectiveUserId(hotelUserId);
        
        // Check if hotel is approved
        HotelProfile hotelProfile = hotelRepository.findByUserId(effectiveUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel profile not found"));
        
        if (!"APPROVED".equals(hotelProfile.getStatus())) {
            throw new UnauthorizedException("Only approved hotels can submit bids");
        }
        
        // Get inquiry
        BidInquiry inquiry = bidInquiryRepository.findById(request.getInquiryId())
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found"));
        
        // Check if inquiry is still open
        if (!inquiry.isOpenForBidding()) {
            throw new IllegalStateException("Inquiry is no longer accepting bids");
        }
        
        // Validate price is within budget (only if DMC specified budget range)
        if (inquiry.getBudgetMin() != null && inquiry.getBudgetMax() != null) {
            if (request.getPricePerRoomPerNight() < inquiry.getBudgetMin() || 
                request.getPricePerRoomPerNight() > inquiry.getBudgetMax()) {
                log.warn("Hotel bid price {} is outside budget range: {} - {}", 
                        request.getPricePerRoomPerNight(), inquiry.getBudgetMin(), inquiry.getBudgetMax());
            }
        }
        
        // Create bid
        LocalDateTime now = LocalDateTime.now();
        
        HotelBid bid = HotelBid.builder()
                .inquiryId(request.getInquiryId())
                .inquiryTitle(inquiry.getTitle())
                .hotelUserId(hotelUserId)
                .hotelId(hotelProfile.getId())
                .hotelName(hotelProfile.getName())
                .hotelCity(hotelProfile.getCity())
                .hotelAddress(hotelProfile.getAddress())
                .hotelContactEmail(hotelProfile.getContactEmail())
                .hotelContactPhone(hotelProfile.getContactNumber())
                .dmcUserId(inquiry.getDmcUserId())
                .dmcCompanyName(inquiry.getDmcCompanyName())
                .bidTitle(request.getBidTitle())
                .bidDescription(request.getBidDescription())
                .roomType(request.getRoomType())
                .mealPlan(request.getMealPlan())
                .pricePerRoomPerNight(request.getPricePerRoomPerNight())
                .totalPrice(request.getTotalPrice())
                .currency(request.getCurrency())
                .availableRooms(request.getAvailableRooms())
                .specialOffer(request.getSpecialOffer())
                .discountPercentage(request.getDiscountPercentage())
                .discountAmount(request.getDiscountAmount())
                .termsAndConditions(request.getTermsAndConditions())
                .validityDate(request.getValidityDate())
                .includedAmenities(request.getIncludedAmenities())
                .additionalNotes(request.getAdditionalNotes())
                .openToNegotiation(request.getOpenToNegotiation())
                .status(BidStatus.PENDING)
                .submittedAt(now)
                .updatedAt(now)
                .build();
        
        HotelBid savedBid = hotelBidRepository.save(bid);
        log.info("Bid created with ID: {}", savedBid.getId());
        
        // Increment bid count in inquiry
        inquiry.incrementBidCount();
        bidInquiryRepository.save(inquiry);
        
        // Notify DMC about new bid
        notificationService.notifyDmcAboutNewBid(savedBid.getId(), inquiry.getDmcUserId());
        
        return mapToResponse(savedBid);
    }
    
    @Override
    @Transactional
    public HotelBidResponse updateBid(String bidId, UpdateHotelBidRequest request, String hotelUserId) {
        log.info("Updating bid: {} by hotel user: {}", bidId, hotelUserId);
        
        HotelBid bid = hotelBidRepository.findById(bidId)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found"));
        
        // Check ownership
        if (!bid.getHotelUserId().equals(hotelUserId)) {
            throw new UnauthorizedException("You can only update your own bids");
        }
        
        // Can only update PENDING bids
        if (bid.getStatus() != BidStatus.PENDING) {
            throw new IllegalStateException("Can only update PENDING bids");
        }
        
        // Store old price for history
        Double oldPrice = bid.getPricePerRoomPerNight();
        
        // Update fields if provided
        if (request.getBidTitle() != null) bid.setBidTitle(request.getBidTitle());
        if (request.getBidDescription() != null) bid.setBidDescription(request.getBidDescription());
        if (request.getRoomType() != null) bid.setRoomType(request.getRoomType());
        if (request.getMealPlan() != null) bid.setMealPlan(request.getMealPlan());
        if (request.getPricePerRoomPerNight() != null) bid.setPricePerRoomPerNight(request.getPricePerRoomPerNight());
        if (request.getTotalPrice() != null) bid.setTotalPrice(request.getTotalPrice());
        if (request.getCurrency() != null) bid.setCurrency(request.getCurrency());
        if (request.getAvailableRooms() != null) bid.setAvailableRooms(request.getAvailableRooms());
        if (request.getSpecialOffer() != null) bid.setSpecialOffer(request.getSpecialOffer());
        if (request.getDiscountPercentage() != null) bid.setDiscountPercentage(request.getDiscountPercentage());
        if (request.getDiscountAmount() != null) bid.setDiscountAmount(request.getDiscountAmount());
        if (request.getTermsAndConditions() != null) bid.setTermsAndConditions(request.getTermsAndConditions());
        if (request.getValidityDate() != null) bid.setValidityDate(request.getValidityDate());
        if (request.getIncludedAmenities() != null) bid.setIncludedAmenities(request.getIncludedAmenities());
        if (request.getAdditionalNotes() != null) bid.setAdditionalNotes(request.getAdditionalNotes());
        if (request.getOpenToNegotiation() != null) bid.setOpenToNegotiation(request.getOpenToNegotiation());
        
        bid.setUpdatedAt(LocalDateTime.now());
        bid.addEditHistory(request.getChangeDescription(), oldPrice, bid.getPricePerRoomPerNight());
        
        HotelBid updatedBid = hotelBidRepository.save(bid);
        log.info("Bid updated: {}", bidId);
        
        return mapToResponse(updatedBid);
    }
    
    @Override
    public HotelBidResponse getBidById(String bidId) {
        HotelBid bid = hotelBidRepository.findById(bidId)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found"));
        return mapToResponse(bid);
    }
    
    @Override
    public List<HotelBidResponse> getBidsByInquiryId(String inquiryId) {
        List<HotelBid> bids = hotelBidRepository.findByInquiryIdOrderBySubmittedAtDesc(inquiryId);
        return bids.stream().map(this::mapToResponse).collect(Collectors.toList());
    }
    
    @Override
    public Page<HotelBidResponse> getBidsByInquiryId(String inquiryId, Pageable pageable) {
        Page<HotelBid> bids = hotelBidRepository.findByInquiryIdOrderBySubmittedAtDesc(inquiryId, pageable);
        return bids.map(this::mapToResponse);
    }
    
    @Override
    public Page<HotelBidResponse> getBidsByHotelUser(String hotelUserId, Pageable pageable) {
        Page<HotelBid> bids = hotelBidRepository.findByHotelUserIdOrderBySubmittedAtDesc(hotelUserId, pageable);
        return bids.map(this::mapToResponse);
    }
    
    @Override
    public Page<HotelBidResponse> getBidsByHotelUserAndStatus(String hotelUserId, BidStatus status, Pageable pageable) {
        Page<HotelBid> bids = hotelBidRepository.findByHotelUserIdAndStatusOrderBySubmittedAtDesc(hotelUserId, status, pageable);
        return bids.map(this::mapToResponse);
    }
    
    @Override
    public Page<HotelBidResponse> searchBidsByHotel(String hotelUserId, String keyword, Pageable pageable) {
        Page<HotelBid> bids = hotelBidRepository.searchBidsByHotel(hotelUserId, keyword, pageable);
        return bids.map(this::mapToResponse);
    }
    
    @Override
    @Transactional
    public HotelBidResponse acceptBid(String bidId, String dmcUserId) {
        HotelBid bid = hotelBidRepository.findById(bidId)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found"));
        
        // Check if DMC owns the inquiry
        if (!bid.getDmcUserId().equals(dmcUserId)) {
            throw new UnauthorizedException("You can only accept bids on your own inquiries");
        }
        
        // Check bid status
        if (bid.getStatus() != BidStatus.PENDING) {
            throw new IllegalStateException("Can only accept PENDING bids");
        }
        
        bid.setStatus(BidStatus.ACCEPTED);
        bid.setAcceptedAt(LocalDateTime.now());
        bid.setUpdatedAt(LocalDateTime.now());
        
        HotelBid acceptedBid = hotelBidRepository.save(bid);
        log.info("Bid accepted: {}", bidId);
        
        // Notify hotel about acceptance
        notificationService.notifyHotelAboutBidAcceptance(bidId, bid.getHotelUserId());
        
        return mapToResponse(acceptedBid);
    }
    
    @Override
    @Transactional
    public HotelBidResponse rejectBid(String bidId, String rejectionReason, String dmcUserId) {
        HotelBid bid = hotelBidRepository.findById(bidId)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found"));
        
        if (!bid.getDmcUserId().equals(dmcUserId)) {
            throw new UnauthorizedException("You can only reject bids on your own inquiries");
        }
        
        if (bid.getStatus() != BidStatus.PENDING) {
            throw new IllegalStateException("Can only reject PENDING bids");
        }
        
        bid.setStatus(BidStatus.REJECTED);
        bid.setRejectionReason(rejectionReason);
        bid.setRejectedAt(LocalDateTime.now());
        bid.setUpdatedAt(LocalDateTime.now());
        
        HotelBid rejectedBid = hotelBidRepository.save(bid);
        log.info("Bid rejected: {}", bidId);
        
        // Notify hotel about rejection
        notificationService.notifyHotelAboutBidRejection(bidId, bid.getHotelUserId());
        
        return mapToResponse(rejectedBid);
    }
    
    @Override
    @Transactional
    public HotelBidResponse withdrawBid(String bidId, String hotelUserId) {
        HotelBid bid = hotelBidRepository.findById(bidId)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found"));
        
        if (!bid.getHotelUserId().equals(hotelUserId)) {
            throw new UnauthorizedException("You can only withdraw your own bids");
        }
        
        if (bid.getStatus() != BidStatus.PENDING) {
            throw new IllegalStateException("Can only withdraw PENDING bids");
        }
        
        bid.setStatus(BidStatus.WITHDRAWN);
        bid.setUpdatedAt(LocalDateTime.now());
        
        HotelBid withdrawnBid = hotelBidRepository.save(bid);
        log.info("Bid withdrawn: {}", bidId);
        
        return mapToResponse(withdrawnBid);
    }
    
    @Override
    @Transactional
    public HotelBidResponse addNegotiationNotes(String bidId, String notes, String dmcUserId) {
        HotelBid bid = hotelBidRepository.findById(bidId)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found"));
        
        if (!bid.getDmcUserId().equals(dmcUserId)) {
            throw new UnauthorizedException("You can only negotiate on your own inquiries");
        }
        
        bid.setNegotiationNotes(notes);
        bid.setUpdatedAt(LocalDateTime.now());
        
        HotelBid updatedBid = hotelBidRepository.save(bid);
        log.info("Negotiation notes added to bid: {}", bidId);
        
        return mapToResponse(updatedBid);
    }
    
    @Override
    public HotelBidStatsResponse getBidStats(String hotelUserId) {
        // Get effective user ID (if staff, use parent's ID)
        String effectiveUserId = getEffectiveUserId(hotelUserId);
        
        long totalBidsSubmitted = hotelBidRepository.countByHotelUserId(effectiveUserId);
        long pendingBids = hotelBidRepository.countByHotelUserIdAndStatus(effectiveUserId, BidStatus.PENDING);
        long acceptedBids = hotelBidRepository.countByHotelUserIdAndStatus(effectiveUserId, BidStatus.ACCEPTED);
        long rejectedBids = hotelBidRepository.countByHotelUserIdAndStatus(effectiveUserId, BidStatus.REJECTED);
        long withdrawnBids = hotelBidRepository.countByHotelUserIdAndStatus(effectiveUserId, BidStatus.WITHDRAWN);
        
        // Calculate win rate
        Double winRate = totalBidsSubmitted > 0 ? (double) acceptedBids / totalBidsSubmitted * 100 : 0.0;
        
        // Get city from hotel profile to find available inquiries
        HotelProfile hotelProfile = hotelRepository.findByUserId(effectiveUserId).orElse(null);
        long totalAvailableInquiries = 0;
        if (hotelProfile != null) {
            List<String> cities = List.of(hotelProfile.getCity());
            totalAvailableInquiries = bidInquiryRepository.findOpenInquiriesByCities(cities, LocalDateTime.now(), Pageable.unpaged()).getTotalElements();
        }
        
        return HotelBidStatsResponse.builder()
                .totalAvailableInquiries(totalAvailableInquiries)
                .totalBidsSubmitted(totalBidsSubmitted)
                .pendingBids(pendingBids)
                .acceptedBids(acceptedBids)
                .rejectedBids(rejectedBids)
                .withdrawnBids(withdrawnBids)
                .winRate(winRate)
                .build();
    }
    
    @Override
    public boolean hasHotelBidOnInquiry(String inquiryId, String hotelUserId) {
        return hotelBidRepository.findByInquiryIdAndHotelUserId(inquiryId, hotelUserId).isPresent();
    }
    
    /**
     * Map entity to response DTO
     */
    private HotelBidResponse mapToResponse(HotelBid bid) {
        return HotelBidResponse.builder()
                .id(bid.getId())
                .inquiryId(bid.getInquiryId())
                .inquiryTitle(bid.getInquiryTitle())
                .hotelUserId(bid.getHotelUserId())
                .hotelId(bid.getHotelId())
                .hotelName(bid.getHotelName())
                .hotelCity(bid.getHotelCity())
                .hotelAddress(bid.getHotelAddress())
                .hotelContactEmail(bid.getHotelContactEmail())
                .hotelContactPhone(bid.getHotelContactPhone())
                .dmcUserId(bid.getDmcUserId())
                .dmcCompanyName(bid.getDmcCompanyName())
                .bidTitle(bid.getBidTitle())
                .bidDescription(bid.getBidDescription())
                .roomType(bid.getRoomType())
                .mealPlan(bid.getMealPlan())
                .pricePerRoomPerNight(bid.getPricePerRoomPerNight())
                .totalPrice(bid.getTotalPrice())
                .currency(bid.getCurrency())
                .availableRooms(bid.getAvailableRooms())
                .specialOffer(bid.getSpecialOffer())
                .discountPercentage(bid.getDiscountPercentage())
                .discountAmount(bid.getDiscountAmount())
                .termsAndConditions(bid.getTermsAndConditions())
                .validityDate(bid.getValidityDate())
                .includedAmenities(bid.getIncludedAmenities())
                .additionalNotes(bid.getAdditionalNotes())
                .status(bid.getStatus())
                .openToNegotiation(bid.isOpenToNegotiation())
                .negotiationNotes(bid.getNegotiationNotes())
                .submittedAt(bid.getSubmittedAt())
                .updatedAt(bid.getUpdatedAt())
                .acceptedAt(bid.getAcceptedAt())
                .rejectedAt(bid.getRejectedAt())
                .rejectionReason(bid.getRejectionReason())
                .isActive(bid.isActive())
                .isAccepted(bid.isAccepted())
                .isValidityExpired(bid.isValidityExpired())
                .isEdited(bid.getEditHistory() != null && !bid.getEditHistory().isEmpty())
                .build();
    }
    
    /**
     * Get effective user ID - if user is staff, return parent's ID, otherwise return own ID
     */
    private String getEffectiveUserId(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // If staff, return parent user ID (super admin's ID)
        if (user.getAccountType() == com.hotel_bidding.backend.constants.AccountType.STAFF && user.getParentUserId() != null) {
            log.debug("Staff user {} accessing parent hotel profile {}", userId, user.getParentUserId());
            return user.getParentUserId();
        }
        
        // For super admins, return their own ID
        return userId;
    }
}
