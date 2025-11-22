package com.hotel_bidding.backend.repository;

import com.hotel_bidding.backend.constants.PaymentStatus;
import com.hotel_bidding.backend.constants.PayoutStatus;
import com.hotel_bidding.backend.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    
    // Find by references
    Optional<Payment> findByInquiryIdAndBidId(String inquiryId, String bidId);
    Optional<Payment> findByPayHereOrderId(String payHereOrderId);
    Optional<Payment> findByPayHerePaymentId(String payHerePaymentId);
    
    // Find by user
    Page<Payment> findByDmcUserIdOrderByCreatedAtDesc(String dmcUserId, Pageable pageable);
    Page<Payment> findByHotelUserIdOrderByCreatedAtDesc(String hotelUserId, Pageable pageable);
    
    // Find by status
    Page<Payment> findByPaymentStatusOrderByCreatedAtDesc(PaymentStatus status, Pageable pageable);
    Page<Payment> findByPayoutStatusOrderByCreatedAtDesc(PayoutStatus status, Pageable pageable);
    
    // Find by combined status
    Page<Payment> findByPaymentStatusAndPayoutStatusOrderByCreatedAtDesc(
        PaymentStatus paymentStatus, 
        PayoutStatus payoutStatus, 
        Pageable pageable
    );
    
    // Find expired payments
    List<Payment> findByPaymentStatusAndPaymentExpiresAtBefore(
        PaymentStatus status, 
        LocalDateTime expiryTime
    );
    
    // Statistics
    Long countByPaymentStatus(PaymentStatus status);
    Long countByPayoutStatus(PayoutStatus status);
    Long countByDmcUserIdAndPaymentStatus(String dmcUserId, PaymentStatus status);
    Long countByHotelUserIdAndPayoutStatus(String hotelUserId, PayoutStatus status);
}
