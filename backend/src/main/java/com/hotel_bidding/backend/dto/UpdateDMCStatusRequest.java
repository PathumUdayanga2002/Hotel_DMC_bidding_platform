package com.hotel_bidding.backend.dto;

import com.hotel_bidding.backend.constants.DMCProfileStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDMCStatusRequest {
    
    @NotNull(message = "Status is required")
    private DMCProfileStatus status;
    
    private String rejectionReason; // Required if status is REJECTED
    
    private String adminNote; // Optional admin note
}
