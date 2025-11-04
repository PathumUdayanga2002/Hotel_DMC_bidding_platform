package com.hotel_bidding.backend.dto;

import com.hotel_bidding.backend.constants.HotelProfileStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating hotel profile status
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateHotelStatusRequest {
    @NotNull(message = "Status is required")
    private HotelProfileStatus status;
    
    private String rejectionReason; // Required if status is REJECTED
    
    private String adminNote; // Optional admin note
}
