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
 * Request DTO for updating an existing hotel bid
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateHotelBidRequest {
    
    @Size(min = 10, max = 200, message = "Bid title must be between 10 and 200 characters")
    private String bidTitle;
    
    @Size(min = 20, max = 2000, message = "Bid description must be between 20 and 2000 characters")
    private String bidDescription;
    
    private RoomType roomType;
    private MealPlan mealPlan;
    
    @Min(value = 0, message = "Price cannot be negative")
    private Double pricePerRoomPerNight;
    
    @Min(value = 0, message = "Total price cannot be negative")
    private Double totalPrice;
    
    @Pattern(regexp = "USD|EUR|GBP|LKR|INR|AED", message = "Invalid currency code")
    private String currency;
    
    @Min(value = 1, message = "At least 1 room must be available")
    private Integer availableRooms;
    
    @Size(max = 500, message = "Special offer cannot exceed 500 characters")
    private String specialOffer;
    
    @Min(value = 0, message = "Discount percentage cannot be negative")
    @Max(value = 100, message = "Discount percentage cannot exceed 100")
    private Double discountPercentage;
    
    @Min(value = 0, message = "Discount amount cannot be negative")
    private Double discountAmount;
    
    @Size(min = 50, max = 2000, message = "Terms and conditions must be between 50 and 2000 characters")
    private String termsAndConditions;
    
    @Future(message = "Validity date must be in the future")
    private LocalDate validityDate;
    
    private List<String> includedAmenities;
    
    @Size(max = 1000, message = "Additional notes cannot exceed 1000 characters")
    private String additionalNotes;
    
    private Boolean openToNegotiation;
    
    // Change description (for edit history)
    @NotBlank(message = "Please describe what you changed")
    @Size(max = 500, message = "Change description cannot exceed 500 characters")
    private String changeDescription;
}
