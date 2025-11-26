package com.hotel_bidding.backend.dto.request;

import com.hotel_bidding.backend.constants.MealPlan;
import com.hotel_bidding.backend.constants.RoomType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * Request DTO for updating an existing bid inquiry
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBidInquiryRequest {
    
    @Size(min = 10, max = 200, message = "Title must be between 10 and 200 characters")
    private String title;
    
    @Size(min = 20, max = 2000, message = "Description must be between 20 and 2000 characters")
    private String description;
    
    @Size(min = 1, max = 10, message = "You can select up to 10 cities")
    private List<String> destinationCities;
    
    private String country;
    
    @Future(message = "Check-in date must be in the future")
    private LocalDate checkInDate;
    
    @Future(message = "Check-out date must be in the future")
    private LocalDate checkOutDate;
    
    @Min(value = 1, message = "At least 1 room is required")
    @Max(value = 50, message = "Maximum 50 rooms allowed")
    private Integer numberOfRooms;
    
    @Min(value = 1, message = "At least 1 adult is required")
    @Max(value = 200, message = "Maximum 200 adults allowed")
    private Integer numberOfAdults;
    
    @Min(value = 0, message = "Number of children cannot be negative")
    @Max(value = 100, message = "Maximum 100 children allowed")
    private Integer numberOfChildren;
    
    private List<RoomType> preferredRoomTypes;
    private List<MealPlan> preferredMealPlans;
    
    @Min(value = 0, message = "Budget cannot be negative")
    private Double budgetMin;
    
    @Min(value = 0, message = "Budget cannot be negative")
    private Double budgetMax;
    
    @Pattern(regexp = "USD|EUR|GBP|LKR|INR|AED", message = "Invalid currency code")
    private String currency;
    
    private List<String> specialRequirements;
    
    @Size(max = 1000, message = "Special notes cannot exceed 1000 characters")
    private String specialNotes;
    
    // Change description (for edit history)
    @NotBlank(message = "Please describe what you changed")
    @Size(max = 500, message = "Change description cannot exceed 500 characters")
    private String changeDescription;
}
