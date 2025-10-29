package com.hotel_bidding.backend.dto;

import com.hotel_bidding.backend.entity.ApprovalStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ApprovalRequestDTO {
    private String id;
    private String name;
    private String type;
    private String photoUrl;
    private String contactEmail;
    private String location;
    private LocalDateTime appliedDate;
    private boolean documentsVerified;
    private ApprovalStatus status;
    private boolean businessLicenseVerified;
    private boolean identificationVerified;
    private boolean addressProofVerified;
}