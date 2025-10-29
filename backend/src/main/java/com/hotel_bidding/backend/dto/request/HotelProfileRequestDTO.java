package com.hotel_bidding.backend.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class HotelProfileRequestDTO {
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
}
