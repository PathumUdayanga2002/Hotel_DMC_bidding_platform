package com.hotel_bidding.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "direct_inquiries")
public class DirectInquiry {

    @Id
    private String id;

    private String dmcId;

    private String title;

    private String description;

    private List<String> destinationCities;

    private String country;

    private String checkInDate;

    private String checkOutDate;

    private Integer numberOfRooms;

    private Integer numberOfAdults;

    private Integer numberOfChildren;

    private List<String> preferredRoomTypes;

    private List<String> preferredMealPlans;

    private String budgetMin;

    private String budgetMax;

    private String currency;

    private String specialRequirements;

    private String specialNotes;

    private List<String> hotelIds;

    private String status; // SENT, VIEWED, RESPONDED, ACCEPTED, REJECTED

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
