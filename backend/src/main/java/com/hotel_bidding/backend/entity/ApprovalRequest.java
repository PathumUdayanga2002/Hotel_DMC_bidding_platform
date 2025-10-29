package com.hotel_bidding.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Document(collection = "approval_requests")
@Data
public class ApprovalRequest {
    @Id
    private String id;

    private String name;
    private String type; // "HOTEL" or "DMC"
    private String photoUrl;
    private String contactEmail;
    private String location;
    private LocalDateTime appliedDate;
    private boolean documentsVerified;

    private ApprovalStatus status;

    // Additional fields for document tracking
    private boolean businessLicenseVerified;
    private boolean identificationVerified;
    private boolean addressProofVerified;
}