package com.hotel_bidding.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Hotel bank account details for payouts
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "hotel_bank_details")
public class HotelBankDetails {
    
    @Id
    private String id;
    
    private String hotelUserId;
    private String hotelUsername;
    
    // Bank Account Information
    private String accountHolderName;
    private String bankName;
    private String branchName;
    private String accountNumber;
    private String swiftCode;
    private String ifscCode;          // For Indian banks
    private String routingNumber;     // For US banks
    
    // Verification
    private Boolean isVerified;
    private String verifiedByAdminId;
    private LocalDateTime verifiedAt;
    
    // Metadata
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
