package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.dto.request.HotelProfileRequestDTO;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.entity.HotelProfile;
import com.hotel_bidding.backend.security.UserDetailsImpl;
import com.hotel_bidding.backend.service.HotelService;
import com.hotel_bidding.backend.service.DirectInquiryService;
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
@PreAuthorize("hasAnyRole('HOTEL_USER', 'HOTEL_SUPER_ADMIN', 'HOTEL_STAFF_ADMIN')")
public class HotelController {

    private final HotelService hotelService;
    private final DirectInquiryService directInquiryService;

    // -------------------- Create or Update Hotel Profile --------------------
    @PostMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('HOTEL_USER', 'HOTEL_SUPER_ADMIN', 'HOTEL_STAFF_ADMIN')")
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
    @PreAuthorize("hasAnyRole('HOTEL_USER', 'HOTEL_SUPER_ADMIN', 'HOTEL_STAFF_ADMIN')")
    public ResponseEntity<ApiResponse> getHotelProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        return ResponseEntity.ok(hotelService.getProfile(userDetails));
    }

    // -------------------- Hotel Dashboard --------------------
    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('HOTEL_USER', 'HOTEL_SUPER_ADMIN', 'HOTEL_STAFF_ADMIN')")
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

    // -------------------- Get All Approved Hotels --------------------
    @GetMapping("/approved-profiles")
    @PreAuthorize("hasAnyRole('DMC_USER', 'DMC_SUPER_ADMIN', 'DMC_STAFF_ADMIN')")
    public ResponseEntity<ApiResponse> getApprovedHotels() {
        log.info("Fetching all approved hotel profiles");
        return ResponseEntity.ok(hotelService.getApprovedHotels());
    }

    // -------------------- Get Direct Inquiries for Hotel --------------------
    @GetMapping("/direct-inquiries")
    @PreAuthorize("hasAnyRole('HOTEL_USER', 'HOTEL_SUPER_ADMIN', 'HOTEL_STAFF_ADMIN')")
    public ResponseEntity<ApiResponse> getDirectInquiries(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.info("Fetching direct inquiries for hotel: {}", userDetails.getUsername());
        return ResponseEntity.ok(directInquiryService.getInquiriesForHotel(userDetails.getId()));
    }

    @PostMapping("/direct-inquiries/{inquiryId}/confirm")
    @PreAuthorize("hasAnyRole('HOTEL_USER', 'HOTEL_SUPER_ADMIN', 'HOTEL_STAFF_ADMIN')")
    public ResponseEntity<ApiResponse> confirmDirectInquiry(
            @PathVariable String inquiryId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.info("Hotel {} confirming direct inquiry: {}", userDetails.getUsername(), inquiryId);
        return ResponseEntity.ok(directInquiryService.confirmInquiry(inquiryId, userDetails.getId()));
    }

    @PostMapping("/direct-inquiries/{inquiryId}/reject")
    @PreAuthorize("hasAnyRole('HOTEL_USER', 'HOTEL_SUPER_ADMIN', 'HOTEL_STAFF_ADMIN')")
    public ResponseEntity<ApiResponse> rejectDirectInquiry(
            @PathVariable String inquiryId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.info("Hotel {} rejecting direct inquiry: {}", userDetails.getUsername(), inquiryId);
        return ResponseEntity.ok(directInquiryService.rejectInquiry(inquiryId, userDetails.getId()));
    }
}
