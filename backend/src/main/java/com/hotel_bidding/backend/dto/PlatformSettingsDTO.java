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
public class PlatformSettingsDTO {
    private String id;
    private CommissionSettingsDTO commissionSettings;
    private SystemSettingsDTO systemSettings;
    private LocalDateTime updatedAt;
    private String updatedBy; // Admin username who last updated
}
