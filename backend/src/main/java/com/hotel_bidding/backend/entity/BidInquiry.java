package com.hotel_bidding.backend.entity;

import com.hotel_bidding.backend.constants.BidInquiryStatus;
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
 * BidInquiry - Posted by DMC, Hotels can bid on it
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bid_inquiries")
public class BidInquiry {
    
    @Id
    private String id;
    
    // DMC Information
    private String dmcUserId;           // User ID of DMC who posted
    private String dmcUsername;         // DMC username
    private String dmcCompanyName;      // DMC company name
    
    // Inquiry Details
    private String title;               // Brief title for the inquiry
    private String description;         // Detailed description
    
    // Destination (Multiple cities supported)
    private List<String> destinationCities;  // e.g., ["Colombo", "Negombo", "Galle"]
    private String country;                  // e.g., "Sri Lanka"
    
    // Date Information
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int numberOfNights;         // Auto-calculated
    
    // Guest Information
    private int numberOfRooms;
    private int numberOfAdults;
    private int numberOfChildren;
    
    // Room & Meal Preferences
    private List<RoomType> preferredRoomTypes;  // Can select multiple
    private List<MealPlan> preferredMealPlans;  // Can select multiple
    
    // Budget
    private Double budgetMin;           // Minimum budget per room per night
    private Double budgetMax;           // Maximum budget per room per night
    private String currency;            // e.g., "USD", "LKR"
    
    // Special Requirements
    private List<String> specialRequirements;  // e.g., ["Pool", "Parking", "WiFi"]
    private String specialNotes;               // Additional notes from DMC
    
    // Inquiry Metadata
    private BidInquiryStatus status;
    private LocalDateTime postedAt;
    private LocalDateTime deadline;      // 48 hours from postedAt
    private LocalDateTime closedAt;
    private LocalDateTime awardedAt;
    
    // Tracking
    private Integer viewCount;          // How many hotels viewed this inquiry
    private Integer bidCount;           // How many bids received
    
    // Winning Bid (if awarded)
    private String awardedBidId;        // ID of the winning bid
    private String awardedHotelId;      // ID of the winning hotel
    private String awardedHotelName;    // Name of the winning hotel
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Edit History
    private List<InquiryEditHistory> editHistory;
    
    /**
     * Embedded class for tracking inquiry edits
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InquiryEditHistory {
        private LocalDateTime editedAt;
        private String editedBy;        // User ID
        private String changeDescription;
    }
    
    /**
     * Check if inquiry is still open for bidding
     */
    public boolean isOpenForBidding() {
        return status == BidInquiryStatus.OPEN && 
               LocalDateTime.now().isBefore(deadline);
    }
    
    /**
     * Check if deadline has passed
     */
    public boolean isDeadlinePassed() {
        return LocalDateTime.now().isAfter(deadline);
    }
    
    /**
     * Increment view count
     */
    public void incrementViewCount() {
        this.viewCount = (this.viewCount == null ? 0 : this.viewCount) + 1;
    }
    
    /**
     * Increment bid count
     */
    public void incrementBidCount() {
        this.bidCount = (this.bidCount == null ? 0 : this.bidCount) + 1;
    }
    
    /**
     * Add edit history entry
     */
    public void addEditHistory(String userId, String description) {
        if (this.editHistory == null) {
            this.editHistory = new ArrayList<>();
        }
        this.editHistory.add(InquiryEditHistory.builder()
                .editedAt(LocalDateTime.now())
                .editedBy(userId)
                .changeDescription(description)
                .build());
    }
}
