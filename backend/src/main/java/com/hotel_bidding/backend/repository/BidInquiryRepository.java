package com.hotel_bidding.backend.repository;

import com.hotel_bidding.backend.constants.BidInquiryStatus;
import com.hotel_bidding.backend.entity.BidInquiry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for BidInquiry entity
 */
@Repository
public interface BidInquiryRepository extends MongoRepository<BidInquiry, String> {
    
    // Find by DMC user
    Page<BidInquiry> findByDmcUserIdOrderByPostedAtDesc(String dmcUserId, Pageable pageable);
    
    // Find by status
    Page<BidInquiry> findByStatusOrderByPostedAtDesc(BidInquiryStatus status, Pageable pageable);
    
    // Find by DMC and status
    Page<BidInquiry> findByDmcUserIdAndStatusOrderByPostedAtDesc(String dmcUserId, BidInquiryStatus status, Pageable pageable);
    
    // Find by cities (hotels can see inquiries for their city)
    @Query("{ 'destinationCities': { $in: ?0 }, 'status': 'OPEN', 'deadline': { $gt: ?1 } }")
    Page<BidInquiry> findOpenInquiriesByCities(List<String> cities, LocalDateTime now, Pageable pageable);
    
    // Find all open inquiries (not yet expired)
    @Query("{ 'status': 'OPEN', 'deadline': { $gt: ?0 } }")
    Page<BidInquiry> findAllOpenInquiries(LocalDateTime now, Pageable pageable);
    
    // Search by title or description
    @Query("{ $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } } ] }")
    Page<BidInquiry> searchInquiries(String keyword, Pageable pageable);
    
    // Search by DMC user with keyword
    @Query("{ 'dmcUserId': ?0, $or: [ { 'title': { $regex: ?1, $options: 'i' } }, { 'description': { $regex: ?1, $options: 'i' } } ] }")
    Page<BidInquiry> searchInquiriesByDmcUser(String dmcUserId, String keyword, Pageable pageable);
    
    // Find expired inquiries that are still OPEN (for auto-closing)
    @Query("{ 'status': 'OPEN', 'deadline': { $lt: ?0 } }")
    List<BidInquiry> findExpiredOpenInquiries(LocalDateTime now);
    
    // Count by DMC user
    long countByDmcUserId(String dmcUserId);
    
    // Count by status
    long countByStatus(BidInquiryStatus status);
    
    // Count by DMC and status
    long countByDmcUserIdAndStatus(String dmcUserId, BidInquiryStatus status);
    
    // Find inquiries approaching deadline (for notifications)
    @Query("{ 'status': 'OPEN', 'deadline': { $gt: ?0, $lt: ?1 } }")
    List<BidInquiry> findInquiriesApproachingDeadline(LocalDateTime now, LocalDateTime deadlineThreshold);
}
