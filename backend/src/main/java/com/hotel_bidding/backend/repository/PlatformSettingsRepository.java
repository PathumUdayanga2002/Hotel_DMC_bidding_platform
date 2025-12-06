package com.hotel_bidding.backend.repository;

import com.hotel_bidding.backend.entity.PlatformSettings;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlatformSettingsRepository extends MongoRepository<PlatformSettings, String> {
    
    // Get the latest settings (there should only be one document)
    Optional<PlatformSettings> findFirstByOrderByUpdatedAtDesc();
    
    // Check if settings exist
    boolean existsByIdIsNotNull();
}
