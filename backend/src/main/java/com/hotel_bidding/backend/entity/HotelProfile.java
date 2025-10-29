package com.hotel_bidding.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "hotel_profiles")
public class HotelProfile {

    @Id
    private String id;

    private String userId; // Linked to User entity (hotel user)

    private String name;
    private String description;
    private String address;
    private String city;
    private String country;

    private String contactEmail;
    private String contactNumber;
    private String website;

    private List<String> amenities;
    private List<String> galleryImages;
    private Integer totalRooms;
    private List<String> certifications;

    private String status; // PENDING, UNDER_REVIEW, APPROVED, REJECTED, SUSPENDED
    
    // Admin approval tracking
    private String approvedBy; // Admin user ID who approved
    private String approvedByUsername; // Admin username who approved
    private LocalDateTime approvedAt;
    
    // Rejection tracking
    private String rejectionReason; // Current rejection reason (if rejected)
    private List<HotelRejectionHistory> rejectionHistory = new ArrayList<>();
    
    // Admin notes (internal only, not visible to hotel users)
    private List<HotelAdminNote> adminNotes = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
