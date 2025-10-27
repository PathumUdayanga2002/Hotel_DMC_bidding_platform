package com.hotel_bidding.backend.repository;

import com.hotel_bidding.backend.constants.DMCProfileStatus;
import com.hotel_bidding.backend.entity.DMCProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DMCProfileRepository extends MongoRepository<DMCProfile, String> {
    
    Optional<DMCProfile> findByUserId(String userId);
    
    boolean existsByUserId(String userId);
    
    boolean existsByBusinessRegistrationNumber(String businessRegistrationNumber);
    
    Optional<DMCProfile> findByBusinessRegistrationNumber(String businessRegistrationNumber);
    
    List<DMCProfile> findByStatus(DMCProfileStatus status);
    
    long countByStatus(DMCProfileStatus status);
}
