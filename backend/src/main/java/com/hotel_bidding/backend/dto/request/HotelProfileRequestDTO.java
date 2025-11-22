package com.hotel_bidding.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;

import java.util.List;

/**
 * DTO for creating/updating hotel profile
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelProfileRequestDTO {

    @NotBlank(message = "Hotel name is required")
    private String name;

    private String description;

    @NotBlank(message = "Address is required")
    private String address;

    private String city;
    private String country;

    @Email(message = "Invalid email")
    private String contactEmail;

    private String contactNumber;
    private String website;

    private List<String> amenities;

    private Integer totalRooms;  // Added to match service usage

    // ==================== NEW FIELDS ====================
    private String roomEnvironment;             // e.g., AC / Non-AC / Mixed

    @Min(1)
    @Max(5)
    private Integer hotelStars;                 // 1-5 rating

    private List<String> termsAndConditions;   // Terms & conditions
    // =====================================================
}
