package com.hotel_bidding.backend.repository;

import com.hotel_bidding.backend.entity.DirectInquiry;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DirectInquiryRepository extends MongoRepository<DirectInquiry, String> {
    
    List<DirectInquiry> findByDmcId(String dmcId);
    
    List<DirectInquiry> findByHotelIdsContaining(String hotelId);
    
    List<DirectInquiry> findByDmcIdAndStatus(String dmcId, String status);
}
