package com.hotel_bidding.backend.repository;

import com.hotel_bidding.backend.entity.PaymentHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentHistoryRepository extends MongoRepository<PaymentHistory, String> {
    
    List<PaymentHistory> findByUserIdOrderByPaymentDateDesc(String userId);
    
    Optional<PaymentHistory> findByOrderId(String orderId);
    
    List<PaymentHistory> findBySubscriptionId(String subscriptionId);
    
    List<PaymentHistory> findByStatus(String status);
}
