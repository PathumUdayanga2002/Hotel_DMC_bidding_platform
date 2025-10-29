package com.hotel_bidding.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DMCProfileStats {
    private long total;
    private long pending;
    private long underReview;
    private long approved;
    private long rejected;
    private long suspended;
}
