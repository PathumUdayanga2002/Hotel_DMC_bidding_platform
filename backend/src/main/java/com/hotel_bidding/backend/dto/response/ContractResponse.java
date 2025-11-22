package com.hotel_bidding.backend.dto.response;

import com.hotel_bidding.backend.entity.HotelContract;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ContractResponse {
    private String id;
    private String hotelId;
    private General general;
    private List<HotelContract.Room> rooms;
    private List<HotelContract.MealSupplement> meals;
    private HotelContract.ChildPolicy childPolicy;
    private List<HotelContract.Offer> offers;
    private List<HotelContract.ValueAddedService> valueAdded;
    private List<HotelContract.TermCondition> terms;

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
        private List<HotelContract.General.PeakPeriod> peakPeriods;
    }
}
