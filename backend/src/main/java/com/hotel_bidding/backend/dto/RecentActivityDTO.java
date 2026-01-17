package com.hotel_bidding.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for recent admin activity
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentActivityDTO {
    private String action;
    private LocalDateTime timestamp;
    private String status;
    private String companyName;
    private String profileType; // DMC or HOTEL
}
