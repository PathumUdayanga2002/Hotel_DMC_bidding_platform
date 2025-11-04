package com.hotel_bidding.backend.repository;

import com.hotel_bidding.backend.entity.HotelProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface HotelRepository extends MongoRepository<HotelProfile, String> {
    Optional<HotelProfile> findByUserId(String userId);
    boolean existsByUserId(String userId);
    
    // Admin queries for approval management
    Page<HotelProfile> findByStatus(String status, Pageable pageable);
    
    Page<HotelProfile> findByNameContainingIgnoreCaseOrContactEmailContainingIgnoreCase(
            String name, String email, Pageable pageable);
    
    Page<HotelProfile> findByStatusAndNameContainingIgnoreCaseOrStatusAndContactEmailContainingIgnoreCase(
            String status1, String name, String status2, String email, Pageable pageable);
    
    long countByStatus(String status);
    
    // Find hotels by cities (for matching with inquiries)
    List<HotelProfile> findByCityInAndStatus(List<String> cities, String status);
}
