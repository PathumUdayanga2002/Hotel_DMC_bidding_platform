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
 * Request DTO for creating a hotel bid on an inquiry
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateHotelBidRequest {
    
    @NotBlank(message = "Inquiry ID is required")
    private String inquiryId;
    
    @NotBlank(message = "Bid title is required")
    @Size(min = 10, max = 200, message = "Bid title must be between 10 and 200 characters")
    private String bidTitle;
    
    @NotBlank(message = "Bid description is required")
    @Size(min = 20, max = 2000, message = "Bid description must be between 20 and 2000 characters")
    private String bidDescription;
    
    // Room & Pricing
    @NotNull(message = "Room type is required")
    private RoomType roomType;
    
    @NotNull(message = "Meal plan is required")
    private MealPlan mealPlan;
    
    @NotNull(message = "Price per room per night is required")
    @Min(value = 0, message = "Price cannot be negative")
    private Double pricePerRoomPerNight;
    
    @NotNull(message = "Total price is required")
    @Min(value = 0, message = "Total price cannot be negative")
    private Double totalPrice;
    
    @NotBlank(message = "Currency is required")
    @Pattern(regexp = "USD|EUR|GBP|LKR|INR|AED", message = "Invalid currency code")
    private String currency;
    
    @NotNull(message = "Available rooms is required")
    @Min(value = 1, message = "At least 1 room must be available")
    private Integer availableRooms;
    
    // Special Offers
    @Size(max = 500, message = "Special offer cannot exceed 500 characters")
    private String specialOffer;
    
    @Min(value = 0, message = "Discount percentage cannot be negative")
    @Max(value = 100, message = "Discount percentage cannot exceed 100")
    private Double discountPercentage;
    
    @Min(value = 0, message = "Discount amount cannot be negative")
    private Double discountAmount;
    
    // Terms & Conditions
    @NotBlank(message = "Terms and conditions are required")
    @Size(min = 50, max = 2000, message = "Terms and conditions must be between 50 and 2000 characters")
    private String termsAndConditions;
    
    @NotNull(message = "Validity date is required")
    @Future(message = "Validity date must be in the future")
    private LocalDate validityDate;
    
    // Additional Details
    private List<String> includedAmenities;
    
    @Size(max = 1000, message = "Additional notes cannot exceed 1000 characters")
    private String additionalNotes;
    
    // Negotiation
    @NotNull(message = "Please specify if you're open to negotiation")
    private Boolean openToNegotiation;
}
