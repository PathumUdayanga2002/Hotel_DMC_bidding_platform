package com.hotel_bidding.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for hotel profile statistics
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelProfileStats {
    private long total;
    private long pending;
    private long underReview;
    private long approved;
    private long rejected;
    private long suspended;
}
