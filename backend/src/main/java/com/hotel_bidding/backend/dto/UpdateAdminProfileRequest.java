package com.hotel_bidding.backend.dto;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAdminProfileRequest {
    
    @Email(message = "Please provide a valid email address")
    private String email;
    
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String department;
    private String position;
    private String profileImageUrl;
}
