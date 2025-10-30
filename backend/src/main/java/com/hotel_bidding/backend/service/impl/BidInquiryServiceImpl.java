package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.constants.BidInquiryStatus;
import com.hotel_bidding.backend.constants.DMCProfileStatus;
import com.hotel_bidding.backend.dto.request.CreateBidInquiryRequest;
import com.hotel_bidding.backend.dto.request.UpdateBidInquiryRequest;
import com.hotel_bidding.backend.dto.response.BidInquiryResponse;
import com.hotel_bidding.backend.dto.response.BidInquiryStatsResponse;
import com.hotel_bidding.backend.entity.BidInquiry;
import com.hotel_bidding.backend.entity.DMCProfile;
import com.hotel_bidding.backend.entity.HotelBid;
import com.hotel_bidding.backend.exception.ResourceNotFoundException;
import com.hotel_bidding.backend.exception.UnauthorizedException;
import com.hotel_bidding.backend.repository.BidInquiryRepository;
import com.hotel_bidding.backend.repository.DMCProfileRepository;
import com.hotel_bidding.backend.repository.HotelBidRepository;
import com.hotel_bidding.backend.repository.UserRepository;
import com.hotel_bidding.backend.entity.User;
import com.hotel_bidding.backend.service.BidInquiryService;
import com.hotel_bidding.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Implementation of BidInquiryService
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BidInquiryServiceImpl implements BidInquiryService {
    
    private final BidInquiryRepository bidInquiryRepository;
    private final DMCProfileRepository dmcProfileRepository;
    private final HotelBidRepository hotelBidRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    
    @Override
    @Transactional
    public BidInquiryResponse createInquiry(CreateBidInquiryRequest request, String dmcUserId) {
        log.info("Creating bid inquiry for DMC user: {}", dmcUserId);
        
        // Get DMC user by username (dmcUserId is actually the username from authentication)
        User dmcUser = userRepository.findByUsername(dmcUserId)
                .orElseThrow(() -> new ResourceNotFoundException("DMC user not found"));
        
        // Check if DMC profile exists (optional - use username as fallback)
        String dmcCompanyName = dmcUser.getUsername();
        DMCProfile dmcProfile = dmcProfileRepository.findByUserId(dmcUser.getId()).orElse(null);
        
        if (dmcProfile != null) {
            // Only check approval if profile exists
            if (dmcProfile.getStatus() != DMCProfileStatus.APPROVED) {
                throw new UnauthorizedException("Only approved DMCs can post inquiries");
            }
            dmcCompanyName = dmcProfile.getCompanyName();
        }
        
        // Validate dates
        if (request.getCheckOutDate().isBefore(request.getCheckInDate())) {
            throw new IllegalArgumentException("Check-out date must be after check-in date");
        }
        
        if (request.getBudgetMax() < request.getBudgetMin()) {
            throw new IllegalArgumentException("Maximum budget must be greater than minimum budget");
        }
        
        // Calculate number of nights
        int numberOfNights = (int) ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        
        // Create inquiry
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime deadline = now.plusHours(48); // 48 hours deadline
        
        BidInquiry inquiry = BidInquiry.builder()
                .dmcUserId(dmcUser.getId())
                .dmcUsername(dmcUser.getUsername())
                .dmcCompanyName(dmcCompanyName)
                .title(request.getTitle())
                .description(request.getDescription())
                .destinationCities(request.getDestinationCities())
                .country(request.getCountry())
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .numberOfNights(numberOfNights)
                .numberOfRooms(request.getNumberOfRooms())
                .numberOfAdults(request.getNumberOfAdults())
                .numberOfChildren(request.getNumberOfChildren() != null ? request.getNumberOfChildren() : 0)
                .preferredRoomTypes(request.getPreferredRoomTypes())
                .preferredMealPlans(request.getPreferredMealPlans())
                .budgetMin(request.getBudgetMin())
                .budgetMax(request.getBudgetMax())
                .currency(request.getCurrency())
                .specialRequirements(request.getSpecialRequirements())
                .specialNotes(request.getSpecialNotes())
                .status(BidInquiryStatus.OPEN)
                .postedAt(now)
                .deadline(deadline)
                .viewCount(0)
                .bidCount(0)
                .createdAt(now)
                .updatedAt(now)
                .build();
        
        BidInquiry savedInquiry = bidInquiryRepository.save(inquiry);
        log.info("Bid inquiry created with ID: {}", savedInquiry.getId());
        
        // Send notifications to hotels in matching cities
        notificationService.notifyHotelsAboutNewInquiry(savedInquiry.getId(), request.getDestinationCities());
        
        return mapToResponse(savedInquiry);
    }
    
    @Override
    @Transactional
    public BidInquiryResponse updateInquiry(String inquiryId, UpdateBidInquiryRequest request, String dmcUserId) {
        log.info("Updating inquiry: {} by DMC user: {}", inquiryId, dmcUserId);
        
        BidInquiry inquiry = bidInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found"));
        
        // Check ownership
        if (!inquiry.getDmcUserId().equals(dmcUserId)) {
            throw new UnauthorizedException("You can only update your own inquiries");
        }
        
        // Can only update if status is OPEN
        if (inquiry.getStatus() != BidInquiryStatus.OPEN) {
            throw new IllegalStateException("Can only update OPEN inquiries");
        }
        
        // Update fields if provided
        if (request.getTitle() != null) inquiry.setTitle(request.getTitle());
        if (request.getDescription() != null) inquiry.setDescription(request.getDescription());
        if (request.getDestinationCities() != null) inquiry.setDestinationCities(request.getDestinationCities());
        if (request.getCountry() != null) inquiry.setCountry(request.getCountry());
        
        if (request.getCheckInDate() != null) inquiry.setCheckInDate(request.getCheckInDate());
        if (request.getCheckOutDate() != null) inquiry.setCheckOutDate(request.getCheckOutDate());
        
        if (inquiry.getCheckInDate() != null && inquiry.getCheckOutDate() != null) {
            inquiry.setNumberOfNights((int) ChronoUnit.DAYS.between(inquiry.getCheckInDate(), inquiry.getCheckOutDate()));
        }
        
        if (request.getNumberOfRooms() != null) inquiry.setNumberOfRooms(request.getNumberOfRooms());
        if (request.getNumberOfAdults() != null) inquiry.setNumberOfAdults(request.getNumberOfAdults());
        if (request.getNumberOfChildren() != null) inquiry.setNumberOfChildren(request.getNumberOfChildren());
        if (request.getPreferredRoomTypes() != null) inquiry.setPreferredRoomTypes(request.getPreferredRoomTypes());
        if (request.getPreferredMealPlans() != null) inquiry.setPreferredMealPlans(request.getPreferredMealPlans());
        if (request.getBudgetMin() != null) inquiry.setBudgetMin(request.getBudgetMin());
        if (request.getBudgetMax() != null) inquiry.setBudgetMax(request.getBudgetMax());
        if (request.getCurrency() != null) inquiry.setCurrency(request.getCurrency());
        if (request.getSpecialRequirements() != null) inquiry.setSpecialRequirements(request.getSpecialRequirements());
        if (request.getSpecialNotes() != null) inquiry.setSpecialNotes(request.getSpecialNotes());
        
        inquiry.setUpdatedAt(LocalDateTime.now());
        inquiry.addEditHistory(dmcUserId, request.getChangeDescription());
        
        BidInquiry updatedInquiry = bidInquiryRepository.save(inquiry);
        log.info("Inquiry updated: {}", inquiryId);
        
        return mapToResponse(updatedInquiry);
    }
    
    @Override
    public BidInquiryResponse getInquiryById(String inquiryId) {
        BidInquiry inquiry = bidInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found"));
        return mapToResponse(inquiry);
    }
    
    @Override
    @Transactional
    public BidInquiryResponse getInquiryByIdAndIncrementView(String inquiryId) {
        BidInquiry inquiry = bidInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found"));
        
        inquiry.incrementViewCount();
        bidInquiryRepository.save(inquiry);
        
        return mapToResponse(inquiry);
    }
    
    @Override
    public Page<BidInquiryResponse> getInquiriesByDmcUser(String dmcUserId, Pageable pageable) {
        Page<BidInquiry> inquiries = bidInquiryRepository.findByDmcUserIdOrderByPostedAtDesc(dmcUserId, pageable);
        return inquiries.map(this::mapToResponse);
    }
    
    @Override
    public Page<BidInquiryResponse> getInquiriesByDmcUserAndStatus(String dmcUserId, BidInquiryStatus status, Pageable pageable) {
        Page<BidInquiry> inquiries = bidInquiryRepository.findByDmcUserIdAndStatusOrderByPostedAtDesc(dmcUserId, status, pageable);
        return inquiries.map(this::mapToResponse);
    }
    
    @Override
    public Page<BidInquiryResponse> searchInquiriesByDmcUser(String dmcUserId, String keyword, Pageable pageable) {
        Page<BidInquiry> inquiries = bidInquiryRepository.searchInquiriesByDmcUser(dmcUserId, keyword, pageable);
        return inquiries.map(this::mapToResponse);
    }
    
    @Override
    public Page<BidInquiryResponse> getAvailableInquiriesForHotel(String hotelCity, Pageable pageable) {
        // Get inquiries where city matches and status is OPEN
        List<String> cities = List.of(hotelCity);
        Page<BidInquiry> inquiries = bidInquiryRepository.findOpenInquiriesByCities(cities, LocalDateTime.now(), pageable);
        return inquiries.map(this::mapToResponse);
    }
    
    @Override
    @Transactional
    public BidInquiryResponse closeInquiry(String inquiryId, String dmcUserId) {
        BidInquiry inquiry = bidInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found"));
        
        if (!inquiry.getDmcUserId().equals(dmcUserId)) {
            throw new UnauthorizedException("You can only close your own inquiries");
        }
        
        if (inquiry.getStatus() != BidInquiryStatus.OPEN) {
            throw new IllegalStateException("Can only close OPEN inquiries");
        }
        
        inquiry.setStatus(BidInquiryStatus.CLOSED);
        inquiry.setClosedAt(LocalDateTime.now());
        inquiry.setUpdatedAt(LocalDateTime.now());
        
        BidInquiry closedInquiry = bidInquiryRepository.save(inquiry);
        log.info("Inquiry closed: {}", inquiryId);
        
        // Notify hotels that bid on this inquiry
        notificationService.notifyHotelsAboutInquiryClosed(inquiryId);
        
        return mapToResponse(closedInquiry);
    }
    
    @Override
    @Transactional
    public BidInquiryResponse cancelInquiry(String inquiryId, String dmcUserId) {
        BidInquiry inquiry = bidInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found"));
        
        if (!inquiry.getDmcUserId().equals(dmcUserId)) {
            throw new UnauthorizedException("You can only cancel your own inquiries");
        }
        
        if (inquiry.getStatus() == BidInquiryStatus.AWARDED) {
            throw new IllegalStateException("Cannot cancel an awarded inquiry");
        }
        
        inquiry.setStatus(BidInquiryStatus.CANCELLED);
        inquiry.setUpdatedAt(LocalDateTime.now());
        
        BidInquiry cancelledInquiry = bidInquiryRepository.save(inquiry);
        log.info("Inquiry cancelled: {}", inquiryId);
        
        return mapToResponse(cancelledInquiry);
    }
    
    @Override
    @Transactional
    public BidInquiryResponse awardInquiry(String inquiryId, String bidId, String dmcUserId) {
        BidInquiry inquiry = bidInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found"));
        
        if (!inquiry.getDmcUserId().equals(dmcUserId)) {
            throw new UnauthorizedException("You can only award your own inquiries");
        }
        
        HotelBid winningBid = hotelBidRepository.findById(bidId)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found"));
        
        if (!winningBid.getInquiryId().equals(inquiryId)) {
            throw new IllegalArgumentException("Bid does not belong to this inquiry");
        }
        
        inquiry.setStatus(BidInquiryStatus.AWARDED);
        inquiry.setAwardedBidId(bidId);
        inquiry.setAwardedHotelId(winningBid.getHotelId());
        inquiry.setAwardedHotelName(winningBid.getHotelName());
        inquiry.setAwardedAt(LocalDateTime.now());
        inquiry.setUpdatedAt(LocalDateTime.now());
        
        BidInquiry awardedInquiry = bidInquiryRepository.save(inquiry);
        log.info("Inquiry awarded: {} to hotel: {}", inquiryId, winningBid.getHotelName());
        
        return mapToResponse(awardedInquiry);
    }
    
    @Override
    public BidInquiryStatsResponse getInquiryStats(String dmcUserId) {
        long totalInquiries = bidInquiryRepository.countByDmcUserId(dmcUserId);
        long openInquiries = bidInquiryRepository.countByDmcUserIdAndStatus(dmcUserId, BidInquiryStatus.OPEN);
        long closedInquiries = bidInquiryRepository.countByDmcUserIdAndStatus(dmcUserId, BidInquiryStatus.CLOSED);
        long awardedInquiries = bidInquiryRepository.countByDmcUserIdAndStatus(dmcUserId, BidInquiryStatus.AWARDED);
        long cancelledInquiries = bidInquiryRepository.countByDmcUserIdAndStatus(dmcUserId, BidInquiryStatus.CANCELLED);
        
        long totalBidsReceived = hotelBidRepository.countByDmcUserId(dmcUserId);
        
        // Note: These counts would need custom queries for exact precision
        long pendingBids = 0;
        long acceptedBids = 0;
        
        Double averageBids = totalInquiries > 0 ? (double) totalBidsReceived / totalInquiries : 0.0;
        
        return BidInquiryStatsResponse.builder()
                .totalInquiries(totalInquiries)
                .openInquiries(openInquiries)
                .closedInquiries(closedInquiries)
                .awardedInquiries(awardedInquiries)
                .cancelledInquiries(cancelledInquiries)
                .totalBidsReceived(totalBidsReceived)
                .pendingBids(pendingBids)
                .acceptedBids(acceptedBids)
                .averageBidsPerInquiry(averageBids)
                .build();
    }
    
    @Override
    @Transactional
    public void autoCloseExpiredInquiries() {
        List<BidInquiry> expiredInquiries = bidInquiryRepository.findExpiredOpenInquiries(LocalDateTime.now());
        
        for (BidInquiry inquiry : expiredInquiries) {
            inquiry.setStatus(BidInquiryStatus.CLOSED);
            inquiry.setClosedAt(LocalDateTime.now());
            inquiry.setUpdatedAt(LocalDateTime.now());
            bidInquiryRepository.save(inquiry);
            
            log.info("Auto-closed expired inquiry: {}", inquiry.getId());
            notificationService.notifyHotelsAboutInquiryClosed(inquiry.getId());
        }
        
        log.info("Auto-closed {} expired inquiries", expiredInquiries.size());
    }
    
    /**
     * Map entity to response DTO
     */
    private BidInquiryResponse mapToResponse(BidInquiry inquiry) {
        long hoursUntilDeadline = ChronoUnit.HOURS.between(LocalDateTime.now(), inquiry.getDeadline());
        
        return BidInquiryResponse.builder()
                .id(inquiry.getId())
                .dmcUserId(inquiry.getDmcUserId())
                .dmcUsername(inquiry.getDmcUsername())
                .dmcCompanyName(inquiry.getDmcCompanyName())
                .title(inquiry.getTitle())
                .description(inquiry.getDescription())
                .destinationCities(inquiry.getDestinationCities())
                .country(inquiry.getCountry())
                .checkInDate(inquiry.getCheckInDate())
                .checkOutDate(inquiry.getCheckOutDate())
                .numberOfNights(inquiry.getNumberOfNights())
                .numberOfRooms(inquiry.getNumberOfRooms())
                .numberOfAdults(inquiry.getNumberOfAdults())
                .numberOfChildren(inquiry.getNumberOfChildren())
                .preferredRoomTypes(inquiry.getPreferredRoomTypes())
                .preferredMealPlans(inquiry.getPreferredMealPlans())
                .budgetMin(inquiry.getBudgetMin())
                .budgetMax(inquiry.getBudgetMax())
                .currency(inquiry.getCurrency())
                .specialRequirements(inquiry.getSpecialRequirements())
                .specialNotes(inquiry.getSpecialNotes())
                .status(inquiry.getStatus())
                .postedAt(inquiry.getPostedAt())
                .deadline(inquiry.getDeadline())
                .closedAt(inquiry.getClosedAt())
                .awardedAt(inquiry.getAwardedAt())
                .viewCount(inquiry.getViewCount())
                .bidCount(inquiry.getBidCount())
                .awardedBidId(inquiry.getAwardedBidId())
                .awardedHotelName(inquiry.getAwardedHotelName())
                .createdAt(inquiry.getCreatedAt())
                .updatedAt(inquiry.getUpdatedAt())
                .isOpenForBidding(inquiry.isOpenForBidding())
                .isDeadlinePassed(inquiry.isDeadlinePassed())
                .hoursUntilDeadline(hoursUntilDeadline)
                .isEdited(inquiry.getEditHistory() != null && !inquiry.getEditHistory().isEmpty())
                .build();
    }
}
