package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.dto.request.HotelProfileRequestDTO;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.entity.HotelProfile;
import com.hotel_bidding.backend.repository.HotelRepository;
import com.hotel_bidding.backend.security.UserDetailsImpl;
import com.hotel_bidding.backend.service.CloudinaryService;
import com.hotel_bidding.backend.service.HotelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    public ApiResponse createProfile(
            HotelProfileRequestDTO request,
            List<MultipartFile> certifications,
            List<MultipartFile> galleryImages,
            UserDetailsImpl userDetails
    ) throws IOException {

        String userId = userDetails.getId();

        // Fetch existing profile or create new
        HotelProfile profile = hotelRepository.findByUserId(userId).orElse(new HotelProfile());
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
        profile.setTotalRooms(request.getTotalRooms());

        // =================== NEW FIELDS ===================
        profile.setRoomEnvironment(request.getRoomEnvironment());
        profile.setHotelStars(request.getHotelStars());
        profile.setTermsAndConditions(request.getTermsAndConditions());
        // ===================================================

        // Upload certifications
        if (certifications != null && !certifications.isEmpty()) {
            List<String> uploadedCerts = certifications.stream().map(file -> {
                try {
                    Map<String, String> result = cloudinaryService.uploadFile(file, "hotel_certifications");
                    return result.get("url");
                } catch (IOException e) {
                    throw new RuntimeException("Certification upload failed: " + file.getOriginalFilename(), e);
                }
            }).collect(Collectors.toList());
            profile.setCertifications(uploadedCerts);
        }

        // Upload gallery images
        if (galleryImages != null && !galleryImages.isEmpty()) {
            List<String> uploadedGallery = galleryImages.stream().map(file -> {
                try {
                    Map<String, String> result = cloudinaryService.uploadFile(file, "hotel_gallery");
                    return result.get("url");
                } catch (IOException e) {
                    throw new RuntimeException("Gallery upload failed: " + file.getOriginalFilename(), e);
                }
            }).collect(Collectors.toList());
            profile.setGalleryImages(uploadedGallery);
        }

        // Reset status for new or updated profile
        profile.setStatus("PENDING");

        HotelProfile saved = hotelRepository.save(profile);

        return ApiResponse.builder()
                .success(true)
                .message("Hotel profile submitted successfully and pending admin approval.")
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
