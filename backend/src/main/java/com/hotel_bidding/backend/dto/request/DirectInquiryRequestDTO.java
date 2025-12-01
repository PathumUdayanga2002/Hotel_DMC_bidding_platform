package com.hotel_bidding.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DirectInquiryRequestDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private List<String> destinationCities;

    private String country;

    @NotBlank(message = "Check-in date is required")
    private String checkInDate;

    @NotBlank(message = "Check-out date is required")
    private String checkOutDate;

    @NotNull(message = "Number of rooms is required")
    private Integer numberOfRooms;

    @NotNull(message = "Number of adults is required")
    private Integer numberOfAdults;

    private Integer numberOfChildren;

    private List<String> preferredRoomTypes;

    private List<String> preferredMealPlans;

    private String budgetMin;

    private String budgetMax;

    private String currency;

    private String specialRequirements;

    private String specialNotes;

    @NotEmpty(message = "At least one hotel must be selected")
    private List<String> hotelIds;
}
