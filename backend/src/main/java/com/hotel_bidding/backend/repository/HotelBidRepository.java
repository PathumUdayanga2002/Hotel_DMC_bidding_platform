package com.hotel_bidding.backend.repository;

import com.hotel_bidding.backend.constants.BidStatus;
import com.hotel_bidding.backend.entity.HotelBid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for HotelBid entity
 */
@Repository
public interface HotelBidRepository extends MongoRepository<HotelBid, String> {
    
    // Find by inquiry ID (all bids for a specific inquiry)
    List<HotelBid> findByInquiryIdOrderBySubmittedAtDesc(String inquiryId);
    
    Page<HotelBid> findByInquiryIdOrderBySubmittedAtDesc(String inquiryId, Pageable pageable);
    
    // Find by hotel user ID (all bids by a hotel)
    Page<HotelBid> findByHotelUserIdOrderBySubmittedAtDesc(String hotelUserId, Pageable pageable);
    
    // Find by hotel and status
    Page<HotelBid> findByHotelUserIdAndStatusOrderBySubmittedAtDesc(String hotelUserId, BidStatus status, Pageable pageable);
    
    // Find by inquiry and hotel (check if hotel already bid)
    Optional<HotelBid> findByInquiryIdAndHotelUserId(String inquiryId, String hotelUserId);
    
    // Find all bids by hotel for inquiry (multiple bids support)
    List<HotelBid> findByInquiryIdAndHotelUserIdOrderBySubmittedAtDesc(String inquiryId, String hotelUserId);
    
    // Find by DMC user (all bids on DMC's inquiries)
    Page<HotelBid> findByDmcUserIdOrderBySubmittedAtDesc(String dmcUserId, Pageable pageable);
    
    // Find by inquiry and status (multiple results)
    List<HotelBid> findAllByInquiryIdAndStatus(String inquiryId, BidStatus status);
    
    // Count bids by inquiry
    long countByInquiryId(String inquiryId);
    
    // Count bids by hotel user
    long countByHotelUserId(String hotelUserId);
    
    // Count by hotel and status
    long countByHotelUserIdAndStatus(String hotelUserId, BidStatus status);
    
    // Count by DMC user
    long countByDmcUserId(String dmcUserId);
    
    // Find accepted bid for inquiry (should be only one)
    Optional<HotelBid> findFirstByInquiryIdAndStatusOrderByAcceptedAtDesc(String inquiryId, BidStatus status);
    
    // Search bids by hotel with keyword
    @Query("{ 'hotelUserId': ?0, $or: [ { 'bidTitle': { $regex: ?1, $options: 'i' } }, { 'inquiryTitle': { $regex: ?1, $options: 'i' } } ] }")
    Page<HotelBid> searchBidsByHotel(String hotelUserId, String keyword, Pageable pageable);
    
    // Delete all bids for an inquiry (when inquiry is deleted)
    void deleteByInquiryId(String inquiryId);
}
