package com.hotel_bidding.backend.repository;

import com.hotel_bidding.backend.constants.DMCProfileStatus;
import com.hotel_bidding.backend.entity.DMCProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    
    Page<DMCProfile> findByStatus(DMCProfileStatus status, Pageable pageable);
    
    long countByStatus(DMCProfileStatus status);
    
    // Search methods
    Page<DMCProfile> findByCompanyNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
        String companyName, String email, Pageable pageable);
    
    Page<DMCProfile> findByStatusAndCompanyNameContainingIgnoreCaseOrStatusAndEmailContainingIgnoreCase(
        DMCProfileStatus status1, String companyName, 
        DMCProfileStatus status2, String email, 
        Pageable pageable);
    // Find approved DMCs by partial company name (case-insensitive)
    List<DMCProfile> findByStatusAndCompanyNameContainingIgnoreCase(DMCProfileStatus status, String companyName);

}
