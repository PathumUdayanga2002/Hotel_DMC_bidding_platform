package com.hotel_bidding.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request to save hotel bank account details
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HotelBankDetailsRequest {
    
    @NotBlank(message = "Account holder name is required")
    private String accountHolderName;
    
    @NotBlank(message = "Bank name is required")
    private String bankName;
    
    @NotBlank(message = "Branch name is required")
    private String branchName;
    
    @NotBlank(message = "Account number is required")
    private String accountNumber;
    
    private String swiftCode;
    private String ifscCode;
    private String routingNumber;
}
