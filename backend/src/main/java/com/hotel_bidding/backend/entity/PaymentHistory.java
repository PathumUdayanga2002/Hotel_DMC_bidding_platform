package com.hotel_bidding.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "payment_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentHistory {
    
    @Id
    private String id;
    
    private String userId;
    
    private String subscriptionId;
    
    private String orderId;
    
    private String payherePaymentId;
    
    private String plan; // MONTHLY or YEARLY
    
    private Double amount;
    
    private String currency;
    
    private String status; // SUCCESS, FAILED, PENDING
    
    private String paymentMethod;
    
    private LocalDateTime paymentDate;
    
    private String transactionReference;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
