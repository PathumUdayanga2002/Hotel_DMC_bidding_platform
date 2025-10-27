package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.dto.request.HotelProfileRequestDTO;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.entity.HotelProfile;
import com.hotel_bidding.backend.repository.HotelRepository;
import com.hotel_bidding.backend.security.UserDetailsImpl;
import com.hotel_bidding.backend.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;

    @Override
    public ApiResponse createProfile(HotelProfileRequestDTO request, UserDetailsImpl userDetails) {
        String userId = userDetails.getId();

        // Check if profile already exists
        if (hotelRepository.existsByUserId(userId)) {
            return ApiResponse.builder()
                    .success(false)
                    .message("Hotel profile already exists. Please edit your profile instead.")
                    .build();
        }


        HotelProfile profile = new HotelProfile();
        profile.setUserId(userId);
        profile.setName(request.getName());
        profile.setDescription(request.getDescription());
        profile.setAddress(request.getAddress());
        profile.setCity(request.getCity());
        profile.setCountry(request.getCountry());
        profile.setContactEmail(request.getContactEmail());
        profile.setContactNumber(request.getContactNumber());
        profile.setWebsite(request.getWebsite());
        profile.setAmenities(request.getAmenities());
        profile.setGalleryImages(request.getGalleryImages());
        profile.setTotalRooms(request.getTotalRooms());
        profile.setCertifications(request.getCertifications());
        profile.setStatus("PENDING_REVIEW");

        HotelProfile saved = hotelRepository.save(profile);

        return ApiResponse.builder()
                .success(true)
                .message("Hotel profile submitted for admin review.")
                .data(saved)
                .build();
    }

    @Override
    public ApiResponse getProfile(UserDetailsImpl userDetails) {
        String userId = userDetails.getId();

        Optional<HotelProfile> profileOpt = hotelRepository.findByUserId(userId);
        if (profileOpt.isEmpty()) {
            return ApiResponse.builder()
                    .success(false)
                    .message("Hotel profile not found for this user.")
                    .build();
        }

        return ApiResponse.builder()
                .success(true)
                .message("Hotel profile fetched successfully.")
                .data(profileOpt.get())
                .build();
    }

    @Override
    public Map<String, Object> getDashboardData(HotelProfile hotel) {
        Map<String, Object> dashboardData = new HashMap<>();

        // Example dashboard data — replace with real data later
        dashboardData.put("hotelName", hotel.getName());
        dashboardData.put("status", hotel.getStatus());
        dashboardData.put("totalRooms", hotel.getTotalRooms());
        dashboardData.put("monthlyRevenue", 128450); // placeholder
        dashboardData.put("winRate", 85);            // placeholder
        dashboardData.put("occupancyRate", 78);      // placeholder
        dashboardData.put("recentActivity", List.of(
                "Bid accepted for Corporate Retreat",
                "New inquiry from Europe DMC",
                "Payment received for Wedding Group"
        ));

        return dashboardData;
    }

}
