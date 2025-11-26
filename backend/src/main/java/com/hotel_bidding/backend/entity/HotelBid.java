package com.hotel_bidding.backend.entity;

import com.hotel_bidding.backend.constants.BidStatus;
import com.hotel_bidding.backend.constants.MealPlan;
import com.hotel_bidding.backend.constants.RoomType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * HotelBid - Hotel's bid response to a BidInquiry
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "hotel_bids")
public class HotelBid {
    
    @Id
    private String id;
    
    // Reference to Inquiry
    private String inquiryId;           // BidInquiry ID
    private String inquiryTitle;        // For quick reference
    
    // Hotel Information
    private String hotelUserId;         // User ID of hotel
    private String hotelId;             // Hotel profile ID
    private String hotelName;
    private String hotelCity;
    private String hotelAddress;
    private String hotelContactEmail;
    private String hotelContactPhone;
    
    // DMC Information (from inquiry)
    private String dmcUserId;
    private String dmcCompanyName;
    
    // Bid Details
    private String bidTitle;            // Brief title for the bid
    private String bidDescription;      // Detailed description
    
    // Room & Pricing
    private RoomType roomType;          // Specific room type offered
    private MealPlan mealPlan;          // Specific meal plan offered
    private Double pricePerRoomPerNight;
    private Double totalPrice;          // For entire stay
    private String currency;            // e.g., "USD", "LKR"
    
    // Number of rooms available for this bid
    private int availableRooms;
    
    // Special Offers
    private String specialOffer;        // e.g., "Free airport pickup", "20% discount"
    private Double discountPercentage;  // If applicable
    private Double discountAmount;      // If applicable
    
    // Terms & Conditions
    private String termsAndConditions;  // Cancellation policy, payment terms, etc.
    private LocalDate validityDate;     // Bid valid until this date
    
    // Additional Details
    private List<String> includedAmenities;  // What's included in the price
    private String additionalNotes;          // Any other information
    
    // Bid Status
    private BidStatus status;
    
    // Negotiation
    private boolean openToNegotiation;
    private String negotiationNotes;    // DMC's negotiation request/comments
    
    // Timestamps
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime rejectedAt;
    
    // Edit History (if hotel edits the bid)
    private List<BidEditHistory> editHistory;
    
    // Rejection Reason (if rejected by DMC)
    private String rejectionReason;
    
    /**
     * Embedded class for tracking bid edits
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BidEditHistory {
        private LocalDateTime editedAt;
        private String changeDescription;
        private Double previousPrice;
        private Double newPrice;
    }
    
    /**
     * Check if bid is still active (pending)
     */
    public boolean isActive() {
        return status == BidStatus.PENDING;
    }
    
    /**
     * Check if bid is accepted
     */
    public boolean isAccepted() {
        return status == BidStatus.ACCEPTED;
    }
    
    /**
     * Check if bid validity has expired
     */
    public boolean isValidityExpired() {
        return validityDate != null && LocalDate.now().isAfter(validityDate);
    }
    
    /**
     * Add edit history entry
     */
    public void addEditHistory(String description, Double oldPrice, Double newPrice) {
        if (this.editHistory == null) {
            this.editHistory = new ArrayList<>();
        }
        this.editHistory.add(BidEditHistory.builder()
                .editedAt(LocalDateTime.now())
                .changeDescription(description)
                .previousPrice(oldPrice)
                .newPrice(newPrice)
                .build());
    }
    
    /**
     * Calculate price per night per person (for comparison)
     */
    public Double getPricePerNightPerPerson(int numberOfGuests) {
        if (numberOfGuests > 0 && pricePerRoomPerNight != null) {
            return pricePerRoomPerNight / numberOfGuests;
        }
        return null;
    }
}
