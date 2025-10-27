package com.hotel_bidding.backend.repository;

import com.hotel_bidding.backend.entity.HotelProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface HotelRepository extends MongoRepository<HotelProfile, String> {
    Optional<HotelProfile> findByUserId(String userId);
    boolean existsByUserId(String userId);
}
