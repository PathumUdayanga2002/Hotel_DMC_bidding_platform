package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.dto.request.HotelProfileRequestDTO;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.entity.HotelProfile;
import com.hotel_bidding.backend.entity.User;
import com.hotel_bidding.backend.repository.HotelRepository;
import com.hotel_bidding.backend.repository.UserRepository;
import com.hotel_bidding.backend.security.UserDetailsImpl;
import com.hotel_bidding.backend.service.CloudinaryService;
import com.hotel_bidding.backend.service.HotelService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;
    private final UserRepository userRepository;
    @Autowired(required = false)
    private CloudinaryService cloudinaryService;

    public HotelServiceImpl(HotelRepository hotelRepository, UserRepository userRepository) {
        this.hotelRepository = hotelRepository;
        this.userRepository = userRepository;
    }

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
        if (certifications != null && !certifications.isEmpty() && cloudinaryService != null) {
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
        if (galleryImages != null && !galleryImages.isEmpty() && cloudinaryService != null) {
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
        
        // Get effective user ID (if staff, use parent's ID)
        String effectiveUserId = getEffectiveUserId(userId);

        Optional<HotelProfile> profileOpt = hotelRepository.findByUserId(effectiveUserId);
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

    /**
     * Get effective user ID - if user is staff, return parent's ID, otherwise return own ID
     */
    private String getEffectiveUserId(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // If staff, return parent user ID (super admin's ID)
        if (user.getAccountType() == com.hotel_bidding.backend.constants.AccountType.STAFF && user.getParentUserId() != null) {
            log.debug("Staff user {} accessing parent hotel profile {}", userId, user.getParentUserId());
            return user.getParentUserId();
        }
        
        // For super admins, return their own ID
        return userId;
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

    @Override
    public ApiResponse getApprovedHotels() {
        log.info("Fetching all approved hotel profiles");
        List<HotelProfile> approvedHotels = hotelRepository.findByStatus("APPROVED");
        
        // Transform to include user details
        List<Map<String, Object>> hotelData = approvedHotels.stream().map(hotel -> {
            Map<String, Object> data = new HashMap<>();
            data.put("id", hotel.getUserId());
            data.put("profile", hotel);
            
            // Optionally fetch user details
            userRepository.findById(hotel.getUserId()).ifPresent(user -> {
                Map<String, String> userInfo = new HashMap<>();
                userInfo.put("username", user.getUsername());
                userInfo.put("email", user.getEmail());
                data.put("user", userInfo);
            });
            
            return data;
        }).collect(Collectors.toList());

        return ApiResponse.builder()
                .success(true)
                .message("Approved hotels fetched successfully")
                .data(hotelData)
                .build();
    }
}
