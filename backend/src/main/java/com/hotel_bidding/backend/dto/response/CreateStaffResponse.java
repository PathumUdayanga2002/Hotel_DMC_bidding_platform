package com.hotel_bidding.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO when creating a staff member
 * Includes generated credentials
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateStaffResponse {
    
    private StaffResponse staff;
    private String generatedPassword;
    private String message;
}
