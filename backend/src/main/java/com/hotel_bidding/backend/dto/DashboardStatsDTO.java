package com.hotel_bidding.backend.dto;

import lombok.Data;

@Data
public class DashboardStatsDTO {
    private long totalHotels;
    private long totalDMCs;
    private long pendingApprovals;
}