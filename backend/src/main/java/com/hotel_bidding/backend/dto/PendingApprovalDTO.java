package com.hotel_bidding.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PendingApprovalDTO {
    private String id;
    private String type; // "HOTEL" or "DMC"
    private String name;
    private String location;
    private String contactEmail;
    private String contactNumber;
    private LocalDateTime appliedDate;
    private boolean documentsVerified;
    private String status;
    
    // Hotel specific
    private String city;
    private String country;
    private String address;
    private Integer totalRooms;
    
    // DMC specific
    private String companyName;
    private String businessRegistrationNumber;
    private String sltdaCertificationUrl;
}
