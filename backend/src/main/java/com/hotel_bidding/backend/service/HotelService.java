package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.dto.request.HotelProfileRequestDTO;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.entity.HotelProfile;
import com.hotel_bidding.backend.security.UserDetailsImpl;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface HotelService {

    // Updated to include galleryImages alongside certifications
    ApiResponse createProfile(
            HotelProfileRequestDTO request,
            List<MultipartFile> certifications,
            List<MultipartFile> galleryImages,
            UserDetailsImpl userDetails
    ) throws IOException;

    ApiResponse getProfile(UserDetailsImpl userDetails);

    Map<String, Object> getDashboardData(HotelProfile hotel);

    ApiResponse getApprovedHotels();
}
