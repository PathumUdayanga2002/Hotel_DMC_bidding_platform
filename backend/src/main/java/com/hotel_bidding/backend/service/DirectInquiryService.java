package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.dto.request.DirectInquiryRequestDTO;
import com.hotel_bidding.backend.dto.response.ApiResponse;

public interface DirectInquiryService {

    ApiResponse createDirectInquiry(DirectInquiryRequestDTO request, String dmcId);

    ApiResponse getInquiriesByDmcId(String dmcId);

    ApiResponse getInquiryById(String inquiryId, String dmcId);

    ApiResponse deleteInquiry(String inquiryId, String dmcId);

    ApiResponse getInquiriesForHotel(String hotelId);

    ApiResponse confirmInquiry(String inquiryId, String hotelId);

    ApiResponse rejectInquiry(String inquiryId, String hotelId);
}
