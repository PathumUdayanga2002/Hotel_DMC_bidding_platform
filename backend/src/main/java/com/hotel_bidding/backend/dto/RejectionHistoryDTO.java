package com.hotel_bidding.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RejectionHistoryDTO {
    private String reason;
    private LocalDateTime rejectedAt;
    private String rejectedBy;
}
