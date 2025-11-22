package com.hotel_bidding.backend.repository;

import com.hotel_bidding.backend.entity.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for ActivityLog entity
 */
@Repository
public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {
    
    // Find all logs for a specific company (super admin + all staff)
    Page<ActivityLog> findByCompanyIdOrderByTimestampDesc(String companyId, Pageable pageable);
    
    // Find logs by performer
    Page<ActivityLog> findByPerformedByOrderByTimestampDesc(String performedBy, Pageable pageable);
    
    // Find logs by date range
    Page<ActivityLog> findByCompanyIdAndTimestampBetweenOrderByTimestampDesc(
            String companyId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    // Count actions by user
    Long countByPerformedBy(String performedBy);
    
    // Find recent activities
    List<ActivityLog> findTop10ByCompanyIdOrderByTimestampDesc(String companyId);
}
