package com.hotel_bidding.backend.dto.request;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

/**
 * Request DTO for creating/updating HotelContract
 */
@Data
public class ContractRequest {

    private General general;
    private List<Room> rooms;
    private List<MealSupplement> meals;
    private ChildPolicy childPolicy;
    private List<Offer> offers;
    private List<ValueAddedService> valueAdded;
    private List<TermCondition> terms;

    @Data
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

        @Data
        public static class PeakPeriod {
            private String name;
            private LocalDate startDate;
            private LocalDate endDate;
        }
    }

    @Data
    public static class Room {
        private String name;
        private int units;
        private int maxPax;
        private List<RatePeriod> ratePeriods;

        @Data
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

    @Data
    public static class MealSupplement {
        private String type;
        private String description;
        private boolean mandatory;
        private double cost;
        private String costBasis;
        private Double childDiscountPercent;
    }

    @Data
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

    @Data
    public static class Offer {
        private String name;
        private String condition;
        private double discountPercent;
        private boolean combinable;
        private String exclusionPeriodName;
        private String relatedPolicy;
    }

    @Data
    public static class ValueAddedService {
        private String serviceName;
        private String applicableStay;
        private String guestType;
        private String requiredMealBasis;
        private String honeymoonCondition;
    }

    @Data
    public static class TermCondition {
        private String type;
        private String applicablePeriod;
        private int conditionDays;
        private String policyDetail;
    }
}
