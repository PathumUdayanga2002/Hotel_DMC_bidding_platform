package com.hotel_bidding.backend.dto.response;

import com.hotel_bidding.backend.constants.BidStatus;
import com.hotel_bidding.backend.constants.MealPlan;
import com.hotel_bidding.backend.constants.RoomType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for HotelBid
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HotelBidResponse {
    
    private String id;
    
    // Reference
    private String inquiryId;
    private String inquiryTitle;
    
    // Hotel Information
    private String hotelUserId;
    private String hotelId;
    private String hotelName;
    private String hotelCity;
    private String hotelAddress;
    private String hotelContactEmail;
    private String hotelContactPhone;
    
    // DMC Information
    private String dmcUserId;
    private String dmcCompanyName;
    
    // Bid Details
    private String bidTitle;
    private String bidDescription;
    
    // Room & Pricing
    private RoomType roomType;
    private MealPlan mealPlan;
    private Double pricePerRoomPerNight;
    private Double totalPrice;
    private String currency;
    private int availableRooms;
    
    // Special Offers
    private String specialOffer;
    private Double discountPercentage;
    private Double discountAmount;
    
    // Terms
    private String termsAndConditions;
    private LocalDate validityDate;
    
    // Additional
    private List<String> includedAmenities;
    private String additionalNotes;
    
    // Status
    private BidStatus status;
    private boolean openToNegotiation;
    private String negotiationNotes;
    
    // Timestamps
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime rejectedAt;
    
    // Rejection
    private String rejectionReason;
    
    // Calculated Fields
    private boolean isActive;
    private boolean isAccepted;
    private boolean isValidityExpired;
    private boolean isEdited;
}
