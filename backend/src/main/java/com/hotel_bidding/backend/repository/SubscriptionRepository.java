package com.hotel_bidding.backend.repository;

import com.hotel_bidding.backend.constants.SubscriptionStatus;
import com.hotel_bidding.backend.entity.Subscription;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends MongoRepository<Subscription, String> {
    
    Optional<Subscription> findByUserId(String userId);
    
    List<Subscription> findByStatus(SubscriptionStatus status);
    
    List<Subscription> findByEndDateBeforeAndStatus(LocalDateTime endDate, SubscriptionStatus status);
    
    Optional<Subscription> findByPaymentId(String paymentId);
    
    boolean existsByUserId(String userId);
}
