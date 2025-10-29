package com.hotel_bidding.backend.dto;

import com.hotel_bidding.backend.entity.HotelAdminNote;
import com.hotel_bidding.backend.entity.HotelRejectionHistory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for complete hotel profile response with admin fields
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelProfileResponse {
    private String id;
    private String userId;
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
    private String status;
    private String approvedBy;
    private String approvedByUsername;
    private LocalDateTime approvedAt;
    private String rejectionReason;
    private List<HotelRejectionHistory> rejectionHistory;
    private List<HotelAdminNote> adminNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
