package com.hotel_bidding.backend.entity;

import com.hotel_bidding.backend.constants.DMCProfileStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "dmc_profiles")
public class DMCProfile {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId; // Reference to User entity

    @NotBlank(message = "Company name is required")
    @Size(min = 2, max = 200, message = "Company name must be between 2 and 200 characters")
    private String companyName;

    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    @NotBlank(message = "Business registration number is required")
    @Size(max = 100, message = "Business registration number must not exceed 100 characters")
    @Indexed(unique = true)
    private String businessRegistrationNumber;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Contact number must be valid")
    private String contactNumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    // Cloudinary URL for SLTDA certification (optional)
    private String sltdaCertificationUrl;

    // File metadata
    private String sltdaCertificationPublicId; // Cloudinary public ID for deletion
    private String sltdaCertificationFileName;

    private DMCProfileStatus status = DMCProfileStatus.PENDING;

    // Rejection tracking
    private String currentRejectionReason;
    private List<RejectionHistory> rejectionHistory = new ArrayList<>();

    // Approval tracking
    private String approvedBy; // Admin ID who approved
    private LocalDateTime approvedAt;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Timestamps for status changes
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
}
