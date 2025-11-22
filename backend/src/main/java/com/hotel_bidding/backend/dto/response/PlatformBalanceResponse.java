package com.hotel_bidding.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Platform balance and statistics response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlatformBalanceResponse {
    
    private Double totalCommissionsEarned;
    private Double availableBalance;
    private Double pendingCommissions;
    
    private Integer totalTransactions;
    private Integer completedPayments;
    private Integer pendingPayments;
    private Integer failedPayments;
    
    private Integer pendingPayouts;
    private Integer completedPayouts;
    
    private String lastUpdated;
}
