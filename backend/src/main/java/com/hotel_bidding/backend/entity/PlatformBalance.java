package com.hotel_bidding.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Platform balance tracking (accumulated commissions)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "platform_balance")
public class PlatformBalance {
    
    @Id
    private String id;
    
    private Double totalCommissionsEarned;     // All-time commissions
    private Double availableBalance;           // Current available balance
    private Double pendingCommissions;         // From pending payments
    
    private Integer totalTransactions;
    private Integer completedPayments;
    private Integer pendingPayouts;
    private Integer completedPayouts;
    
    private LocalDateTime lastUpdated;
    private LocalDateTime createdAt;
}
