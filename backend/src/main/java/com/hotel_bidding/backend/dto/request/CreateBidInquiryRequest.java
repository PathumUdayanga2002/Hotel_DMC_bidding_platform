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
 * Request DTO for creating a new bid inquiry (DMC posts inquiry)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBidInquiryRequest {
    
    @NotBlank(message = "Title is required")
    @Size(min = 10, max = 200, message = "Title must be between 10 and 200 characters")
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(min = 20, max = 2000, message = "Description must be between 20 and 2000 characters")
    private String description;
    
    // Destination (Multiple cities)
    @NotEmpty(message = "At least one destination city is required")
    @Size(min = 1, max = 10, message = "You can select up to 10 cities")
    private List<String> destinationCities;
    
    @NotBlank(message = "Country is required")
    private String country;
    
    // Dates
    @NotNull(message = "Check-in date is required")
    @Future(message = "Check-in date must be in the future")
    private LocalDate checkInDate;
    
    @NotNull(message = "Check-out date is required")
    @Future(message = "Check-out date must be in the future")
    private LocalDate checkOutDate;
    
    // Guest Information
    @NotNull(message = "Number of rooms is required")
    @Min(value = 1, message = "At least 1 room is required")
    @Max(value = 50, message = "Maximum 50 rooms allowed")
    private Integer numberOfRooms;
    
    @NotNull(message = "Number of adults is required")
    @Min(value = 1, message = "At least 1 adult is required")
    @Max(value = 200, message = "Maximum 200 adults allowed")
    private Integer numberOfAdults;
    
    @Min(value = 0, message = "Number of children cannot be negative")
    @Max(value = 100, message = "Maximum 100 children allowed")
    private Integer numberOfChildren;
    
    // Room & Meal Preferences
    @NotEmpty(message = "At least one room type preference is required")
    private List<RoomType> preferredRoomTypes;
    
    @NotEmpty(message = "At least one meal plan preference is required")
    private List<MealPlan> preferredMealPlans;
    
    // Budget
    @NotNull(message = "Minimum budget is required")
    @Min(value = 0, message = "Budget cannot be negative")
    private Double budgetMin;
    
    @NotNull(message = "Maximum budget is required")
    @Min(value = 0, message = "Budget cannot be negative")
    private Double budgetMax;
    
    @NotBlank(message = "Currency is required")
    @Pattern(regexp = "USD|EUR|GBP|LKR|INR|AED", message = "Invalid currency code")
    private String currency;
    
    // Special Requirements
    private List<String> specialRequirements;
    
    @Size(max = 1000, message = "Special notes cannot exceed 1000 characters")
    private String specialNotes;
}
