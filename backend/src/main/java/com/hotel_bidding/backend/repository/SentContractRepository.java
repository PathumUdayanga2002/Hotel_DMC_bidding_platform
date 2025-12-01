package com.hotel_bidding.backend.repository;

import com.hotel_bidding.backend.entity.SentContract;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SentContractRepository extends MongoRepository<SentContract, String> {

    // Find contracts where the receiver list contains the given DMC id
    List<SentContract> findByReceiverDmcIdsContaining(String dmcId);

    // Find if a specific contract was sent to a particular DMC profile id
    boolean existsByContractIdAndReceiverDmcIdsContaining(String contractId, String dmcId);

    // Find contracts sent by a hotel
    List<SentContract> findBySenderHotelId(String senderHotelId);
}
