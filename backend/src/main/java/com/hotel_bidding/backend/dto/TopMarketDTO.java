package com.hotel_bidding.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopMarketDTO {
    private String countryName;
    private String countryCode; // ISO country code
    private Integer bookingCount;
    private BigDecimal revenueValue;
    private Double marketShare; // Percentage
    private Integer rank;
}
