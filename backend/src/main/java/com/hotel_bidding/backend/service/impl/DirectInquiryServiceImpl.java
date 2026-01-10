package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.dto.request.DirectInquiryRequestDTO;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.entity.DirectInquiry;
import com.hotel_bidding.backend.entity.HotelProfile;
import com.hotel_bidding.backend.entity.DMCProfile;
import com.hotel_bidding.backend.repository.DirectInquiryRepository;
import com.hotel_bidding.backend.repository.HotelRepository;
import com.hotel_bidding.backend.repository.DMCProfileRepository;
import com.hotel_bidding.backend.service.DirectInquiryService;
import com.hotel_bidding.backend.service.NotificationService;
import com.hotel_bidding.backend.constants.NotificationType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class DirectInquiryServiceImpl implements DirectInquiryService {

    private final DirectInquiryRepository directInquiryRepository;
    private final NotificationService notificationService;
    private final HotelRepository hotelRepository;
    private final DMCProfileRepository dmcProfileRepository;

    @Override
    public ApiResponse createDirectInquiry(DirectInquiryRequestDTO request, String dmcId) {
        log.info("Creating direct inquiry for DMC: {}", dmcId);

        DirectInquiry inquiry = DirectInquiry.builder()
                .dmcId(dmcId)
                .title(request.getTitle())
                .description(request.getDescription())
                .destinationCities(request.getDestinationCities())
                .country(request.getCountry())
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .numberOfRooms(request.getNumberOfRooms())
                .numberOfAdults(request.getNumberOfAdults())
                .numberOfChildren(request.getNumberOfChildren())
                .preferredRoomTypes(request.getPreferredRoomTypes())
                .preferredMealPlans(request.getPreferredMealPlans())
                .budgetMin(request.getBudgetMin())
                .budgetMax(request.getBudgetMax())
                .currency(request.getCurrency())
                .specialRequirements(request.getSpecialRequirements())
                .specialNotes(request.getSpecialNotes())
                .hotelIds(request.getHotelIds())
                .status("SENT")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        DirectInquiry saved = directInquiryRepository.save(inquiry);

        log.info("Direct inquiry created successfully with ID: {}", saved.getId());

        // Get DMC name for notification
        String dmcName = "DMC";
        try {
            DMCProfile dmcProfile = dmcProfileRepository.findByUserId(dmcId).orElse(null);
            if (dmcProfile != null) {
                dmcName = dmcProfile.getCompanyName();
            }
        } catch (Exception e) {
            log.warn("Could not fetch DMC profile for user {}: {}", dmcId, e.getMessage());
        }

        // Notify each hotel about the direct inquiry
        if (request.getHotelIds() != null && !request.getHotelIds().isEmpty()) {
            for (String hotelId : request.getHotelIds()) {
                try {
                    HotelProfile hotel = hotelRepository.findById(hotelId).orElse(null);
                    if (hotel != null && hotel.getUserId() != null) {
                        notificationService.createNotification(
                            hotel.getUserId(),
                            NotificationType.PROPOSAL_RECEIVED,
                            "New Direct Inquiry from " + dmcName,
                            String.format("You have received a direct inquiry '%s' from %s for %s. Check-in: %s, Rooms: %d",
                                saved.getTitle(),
                                dmcName,
                                String.join(", ", saved.getDestinationCities()),
                                saved.getCheckInDate(),
                                saved.getNumberOfRooms()),
                            saved.getId(),
                            null,
                            "/hotel/direct-inquiries",
                            1 // High priority
                        );
                        log.info("Notified hotel {} about direct inquiry {}", hotelId, saved.getId());
                    }
                } catch (Exception e) {
                    log.error("Failed to notify hotel {} about direct inquiry: {}", hotelId, e.getMessage());
                }
            }
        }

        return ApiResponse.builder()
                .success(true)
                .message("Direct inquiry sent to " + request.getHotelIds().size() + " hotel(s) successfully")
                .data(saved)
                .build();
    }

    @Override
    public ApiResponse getInquiriesByDmcId(String dmcId) {
        log.info("Fetching direct inquiries for DMC: {}", dmcId);
        List<DirectInquiry> inquiries = directInquiryRepository.findByDmcId(dmcId);

        return ApiResponse.builder()
                .success(true)
                .message("Direct inquiries retrieved successfully")
                .data(inquiries)
                .build();
    }

    @Override
    public ApiResponse getInquiryById(String inquiryId, String dmcId) {
        log.info("Fetching direct inquiry {} for DMC: {}", inquiryId, dmcId);

        DirectInquiry inquiry = directInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new RuntimeException("Direct inquiry not found"));

        // Verify that the inquiry belongs to the DMC
        if (!inquiry.getDmcId().equals(dmcId)) {
            throw new RuntimeException("Unauthorized access to inquiry");
        }

        return ApiResponse.builder()
                .success(true)
                .message("Direct inquiry retrieved successfully")
                .data(inquiry)
                .build();
    }

    @Override
    public ApiResponse deleteInquiry(String inquiryId, String dmcId) {
        log.info("Deleting direct inquiry {} for DMC: {}", inquiryId, dmcId);

        DirectInquiry inquiry = directInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new RuntimeException("Direct inquiry not found"));

        // Verify that the inquiry belongs to the DMC
        if (!inquiry.getDmcId().equals(dmcId)) {
            throw new RuntimeException("Unauthorized access to inquiry");
        }

        directInquiryRepository.delete(inquiry);

        return ApiResponse.builder()
                .success(true)
                .message("Direct inquiry deleted successfully")
                .build();
    }

    @Override
    public ApiResponse getInquiriesForHotel(String hotelId) {
        log.info("Fetching direct inquiries for hotel: {}", hotelId);
        List<DirectInquiry> inquiries = directInquiryRepository.findByHotelIdsContaining(hotelId);

        return ApiResponse.builder()
                .success(true)
                .message("Direct inquiries retrieved successfully")
                .data(inquiries)
                .build();
    }

    @Override
    public ApiResponse confirmInquiry(String inquiryId, String hotelId) {
        log.info("Confirming direct inquiry {} for hotel: {}", inquiryId, hotelId);

        DirectInquiry inquiry = directInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new RuntimeException("Direct inquiry not found"));

        // Verify that the inquiry was sent to this hotel
        if (!inquiry.getHotelIds().contains(hotelId)) {
            throw new RuntimeException("This inquiry was not sent to your hotel");
        }

        // Update inquiry status
        inquiry.setStatus("CONFIRMED");
        inquiry.setUpdatedAt(java.time.LocalDateTime.now());
        DirectInquiry updated = directInquiryRepository.save(inquiry);

        log.info("Direct inquiry {} confirmed successfully", inquiryId);

        return ApiResponse.builder()
                .success(true)
                .message("Inquiry confirmed successfully")
                .data(updated)
                .build();
    }

    @Override
    public ApiResponse rejectInquiry(String inquiryId, String hotelId) {
        log.info("Rejecting direct inquiry {} for hotel: {}", inquiryId, hotelId);

        DirectInquiry inquiry = directInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new RuntimeException("Direct inquiry not found"));

        // Verify that the inquiry was sent to this hotel
        if (!inquiry.getHotelIds().contains(hotelId)) {
            throw new RuntimeException("This inquiry was not sent to your hotel");
        }

        // Update inquiry status
        inquiry.setStatus("REJECTED");
        inquiry.setUpdatedAt(java.time.LocalDateTime.now());
        DirectInquiry updated = directInquiryRepository.save(inquiry);

        log.info("Direct inquiry {} rejected successfully", inquiryId);

        return ApiResponse.builder()
                .success(true)
                .message("Inquiry rejected successfully")
                .data(updated)
                .build();
    }
}
