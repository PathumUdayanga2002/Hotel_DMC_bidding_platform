package com.hotel_bidding.backend.repository;

import com.hotel_bidding.backend.entity.ApprovalRequest;
import com.hotel_bidding.backend.entity.ApprovalStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApprovalRequestRepository extends MongoRepository<ApprovalRequest, String> {
    List<ApprovalRequest> findByStatus(ApprovalStatus status);
    long countByTypeAndStatus(String type, ApprovalStatus status);
    List<ApprovalRequest> findByStatusOrderByAppliedDateDesc(ApprovalStatus status);
}