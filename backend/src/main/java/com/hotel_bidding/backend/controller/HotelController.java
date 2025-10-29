package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.dto.request.HotelProfileRequestDTO;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.entity.HotelProfile;
import com.hotel_bidding.backend.security.UserDetailsImpl;
import com.hotel_bidding.backend.service.HotelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/hotel")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    // -------------------- Create or Update Hotel Profile --------------------
    @PostMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('HOTEL_USER')")
    public ResponseEntity<ApiResponse> createOrUpdateProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestPart("profile") HotelProfileRequestDTO request,
            @RequestPart(value = "certifications", required = false) List<MultipartFile> certifications,
            @RequestPart(value = "galleryImages", required = false) List<MultipartFile> galleryImages
    ) throws IOException {
        log.info("Creating/updating hotel profile for user: {}", userDetails.getUsername());
        return ResponseEntity.ok(
                hotelService.createProfile(request, certifications, galleryImages, userDetails)
        );
    }

    // -------------------- Get Hotel Profile --------------------
    @GetMapping("/profile")
    @PreAuthorize("hasRole('HOTEL_USER')")
    public ResponseEntity<ApiResponse> getHotelProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        return ResponseEntity.ok(hotelService.getProfile(userDetails));
    }

    // -------------------- Hotel Dashboard --------------------
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('HOTEL_USER')")
    public ResponseEntity<ApiResponse> getDashboard(@AuthenticationPrincipal UserDetailsImpl userDetails) {

        ApiResponse profileResponse = hotelService.getProfile(userDetails);

        if (!profileResponse.isSuccess()) {
            return ResponseEntity.status(403).body(ApiResponse.builder()
                    .success(false)
                    .message("Hotel profile not found. Please create your profile first.")
                    .build());
        }

        HotelProfile hotel = (HotelProfile) profileResponse.getData();

        // Only approved hotels can access dashboard
        if (!"APPROVED".equals(hotel.getStatus())) {
            return ResponseEntity.status(403).body(ApiResponse.builder()
                    .success(false)
                    .message("Your hotel profile is pending admin approval.")
                    .build());
        }

        // Example dashboard data
        Map<String, Object> dashboardData = hotelService.getDashboardData(hotel);

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Hotel Dashboard")
                .data(dashboardData)
                .build());
    }
}
