package com.hotel_bidding.backend.repository;

import com.hotel_bidding.backend.entity.PlatformBalance;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlatformBalanceRepository extends MongoRepository<PlatformBalance, String> {
    
    // There should only be one platform balance record
    Optional<PlatformBalance> findFirstByOrderByCreatedAtDesc();
}
