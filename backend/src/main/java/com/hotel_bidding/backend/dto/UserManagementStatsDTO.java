package com.hotel_bidding.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserManagementStatsDTO {
    private long totalHotels;
    private long approvedHotels;
    private long pendingHotels;
    private long rejectedHotels;
    
    private long totalDMCs;
    private long approvedDMCs;
    private long pendingDMCs;
    private long rejectedDMCs;
    
    private long totalPendingApprovals;
}
