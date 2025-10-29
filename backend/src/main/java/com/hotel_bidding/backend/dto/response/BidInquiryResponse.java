package com.hotel_bidding.backend.dto.response;

import com.hotel_bidding.backend.constants.BidInquiryStatus;
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
 * Response DTO for BidInquiry
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BidInquiryResponse {
    
    private String id;
    
    // DMC Information
    private String dmcUserId;
    private String dmcUsername;
    private String dmcCompanyName;
    
    // Inquiry Details
    private String title;
    private String description;
    
    // Destination
    private List<String> destinationCities;
    private String country;
    
    // Date Information
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int numberOfNights;
    
    // Guest Information
    private int numberOfRooms;
    private int numberOfAdults;
    private int numberOfChildren;
    
    // Preferences
    private List<RoomType> preferredRoomTypes;
    private List<MealPlan> preferredMealPlans;
    
    // Budget
    private Double budgetMin;
    private Double budgetMax;
    private String currency;
    
    // Special Requirements
    private List<String> specialRequirements;
    private String specialNotes;
    
    // Status & Timing
    private BidInquiryStatus status;
    private LocalDateTime postedAt;
    private LocalDateTime deadline;
    private LocalDateTime closedAt;
    private LocalDateTime awardedAt;
    
    // Tracking
    private Integer viewCount;
    private Integer bidCount;
    
    // Winning Bid Info
    private String awardedBidId;
    private String awardedHotelName;
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Calculated Fields
    private boolean isOpenForBidding;
    private boolean isDeadlinePassed;
    private long hoursUntilDeadline;
    private boolean isEdited;
}
