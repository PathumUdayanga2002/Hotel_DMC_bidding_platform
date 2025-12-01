package com.hotel_bidding.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class HotelProfileResponseDTO {
    private String id;
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
}
