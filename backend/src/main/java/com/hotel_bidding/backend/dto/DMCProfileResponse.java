package com.hotel_bidding.backend.dto;

import com.hotel_bidding.backend.constants.DMCProfileStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DMCProfileResponse {
    private String id;
    private String userId;
    private String companyName;
    private String address;
    private String businessRegistrationNumber;
    private String contactNumber;
    private String email;
    private String sltdaCertificationUrl;
    private String sltdaCertificationFileName;
    private DMCProfileStatus status;
    private String currentRejectionReason;
    private List<RejectionHistoryDTO> rejectionHistory;
    private List<AdminNoteDTO> adminNotes;
    private String approvedBy;
    private String approvedByUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime submittedAt;
    private LocalDateTime approvedAt;
}
