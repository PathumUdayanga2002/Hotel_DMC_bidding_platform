package com.hotel_bidding.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RejectionHistory {
    private String reason;
    private LocalDateTime rejectedAt;
    private String rejectedBy; // Admin ID who rejected
}
