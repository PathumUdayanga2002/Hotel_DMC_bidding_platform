package com.hotel_bidding.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalActionRequest {
    @NotBlank(message = "Action is required")
    private String action; // "APPROVE" or "REJECT"
    
    private String reason; // Required for REJECT action
    private String note; // Optional admin note
}
