package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.entity.HotelContract;

import java.util.List;
import java.util.Optional;

public interface HotelContractService {
    HotelContract saveContract(HotelContract contract);
    List<HotelContract> getContractsByHotel(String hotelId);
    Optional<HotelContract> getContractByIdAndHotel(String id, String hotelId);
    void deleteContract(String id, String hotelId);
}
