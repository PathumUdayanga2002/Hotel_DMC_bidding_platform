package com.hotel_bidding.backend.dto;

import com.hotel_bidding.backend.constants.DMCProfileStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DMCProfileSummary {
    private String id;
    private String companyName;
    private String email;
    private String businessRegistrationNumber;
    private DMCProfileStatus status;
    private LocalDateTime submittedAt;
    private LocalDateTime approvedAt;
    private String approvedByUsername;
}
