package com.hotel_bidding.backend.repository;

import com.hotel_bidding.backend.entity.HotelBankDetails;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HotelBankDetailsRepository extends MongoRepository<HotelBankDetails, String> {
    
    Optional<HotelBankDetails> findByHotelUserId(String hotelUserId);
    Boolean existsByHotelUserId(String hotelUserId);
}
