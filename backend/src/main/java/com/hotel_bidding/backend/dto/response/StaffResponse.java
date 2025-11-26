package com.hotel_bidding.backend.dto.response;

import com.hotel_bidding.backend.constants.AccountType;
import com.hotel_bidding.backend.constants.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for staff member details
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffResponse {
    
    private String id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String position;
    private String profilePhotoUrl;
    private UserRole role;
    private AccountType accountType;
    private Boolean isActive;
    private String parentUserId;
    private String createdBy;
    private Integer actionCount;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
