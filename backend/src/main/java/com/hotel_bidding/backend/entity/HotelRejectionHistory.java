package com.hotel_bidding.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Rejection history record for hotel profiles
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelRejectionHistory {
    private String reason;
    private LocalDateTime rejectedAt;
    private String rejectedBy; // Admin username
}
