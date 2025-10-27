package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.dto.request.HotelProfileRequestDTO;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.entity.HotelProfile;
import com.hotel_bidding.backend.security.UserDetailsImpl;

import java.util.Map;

public interface HotelService {

    ApiResponse createProfile(HotelProfileRequestDTO request, UserDetailsImpl userDetails);

    ApiResponse getProfile(UserDetailsImpl userDetails);
    Map<String, Object> getDashboardData(HotelProfile hotelProfile);
}
