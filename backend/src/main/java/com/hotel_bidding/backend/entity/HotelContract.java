package com.hotel_bidding.backend.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "hotelContracts")
public class HotelContract {

    @Id
    private String id;

    // link to hotel_profile.userId (or hotelProfile.id depending on your scheme)
    private String hotelId;

    private General general;
    private List<Room> rooms;
    private List<MealSupplement> meals;
    private ChildPolicy childPolicy;
    private List<Offer> offers;
    private List<ValueAddedService> valueAdded;
    private List<TermCondition> terms;

    // Nested classes...
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class General {
        private String contractName;
        private String hotelName;
        private LocalDate startDate;
        private LocalDate endDate;
        private String rateBasis;
        private String currency;
        private String inclusivity;
        private String onlineMarkupPolicy;
        private String governmentTaxNote;
        private List<PeakPeriod> peakPeriods;

        @Data @NoArgsConstructor @AllArgsConstructor
        public static class PeakPeriod {
            private String name;
            private LocalDate startDate;
            private LocalDate endDate;
        }
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class Room {
        private String name;
        private int units;
        private int maxPax;
        private List<RatePeriod> ratePeriods;

        @Data @NoArgsConstructor @AllArgsConstructor
        public static class RatePeriod {
            private String periodName;
            private LocalDate startDate;
            private LocalDate endDate;
            private double rateSingle;
            private double rateDouble;
            private double rateTriple;
            private int minNights;
        }
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class MealSupplement {
        private String type;
        private String description;
        private boolean mandatory;
        private double cost;
        private String costBasis;
        private Double childDiscountPercent;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ChildPolicy {
        private double childFOCAgeMax;
        private String childFOCConditions;
        private String childMealDiscountAgeRange;
        private double childMealDiscountPercent;
        private String extraBedChargeAge;
        private double extraBedCost;
        private String extraAdultDefinition;
        private double extraAdultRate;
        private String driverAccommodation;
        private double driverAllowanceAmount;
        private String driverAllowanceCurrency;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class Offer {
        private String name;
        private String condition;
        private double discountPercent;
        private boolean combinable;
        private String exclusionPeriodName;
        private String relatedPolicy;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ValueAddedService {
        private String serviceName;
        private String applicableStay;
        private String guestType;
        private String requiredMealBasis;
        private String honeymoonCondition;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class TermCondition {
        private String type;
        private String applicablePeriod;
        private int conditionDays;
        private String policyDetail;
    }
}
