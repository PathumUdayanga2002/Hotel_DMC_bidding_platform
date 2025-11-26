package com.hotel_bidding.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for hotel profile summary in admin list view
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelProfileSummary {
    private String id;
    private String name;
    private String contactEmail;
    private String city;
    private String country;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
    private String approvedByUsername;
}
