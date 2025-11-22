package com.hotel_bidding.backend.repository;

import com.hotel_bidding.backend.entity.HotelContract;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HotelContractRepository extends MongoRepository<HotelContract, String> {
    List<HotelContract> findByHotelId(String hotelId);
    Optional<HotelContract> findByIdAndHotelId(String id, String hotelId);
}
