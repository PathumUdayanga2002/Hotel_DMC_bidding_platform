package com.hotel_bidding.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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
