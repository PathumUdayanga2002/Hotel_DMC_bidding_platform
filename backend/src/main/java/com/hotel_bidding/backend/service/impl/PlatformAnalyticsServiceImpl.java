package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.constants.BidInquiryStatus;
import com.hotel_bidding.backend.constants.BidStatus;
import com.hotel_bidding.backend.constants.DMCProfileStatus;
import com.hotel_bidding.backend.dto.*;
import com.hotel_bidding.backend.entity.BidInquiry;
import com.hotel_bidding.backend.entity.HotelBid;
import com.hotel_bidding.backend.entity.HotelProfile;
import com.hotel_bidding.backend.repository.BidInquiryRepository;
import com.hotel_bidding.backend.repository.DMCProfileRepository;
import com.hotel_bidding.backend.repository.HotelBidRepository;
import com.hotel_bidding.backend.repository.HotelRepository;
import com.hotel_bidding.backend.service.PlatformAnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlatformAnalyticsServiceImpl implements PlatformAnalyticsService {

    private final BidInquiryRepository bidInquiryRepository;
    private final HotelBidRepository hotelBidRepository;
    private final HotelRepository hotelRepository;
    private final DMCProfileRepository dmcProfileRepository;

    // Commission rate from application.properties (default 5%)
    private static final Double COMMISSION_RATE = 0.05;

    @Override
    public PlatformAnalyticsDTO getPlatformAnalytics(Integer year) {
        log.info("Generating platform analytics for year: {}", year == null ? "current" : year);
        
        int targetYear = year != null ? year : LocalDate.now().getYear();
        LocalDateTime startOfYear = LocalDateTime.of(targetYear, 1, 1, 0, 0);
        LocalDateTime endOfYear = LocalDateTime.of(targetYear, 12, 31, 23, 59, 59);
        
        return generateAnalytics(startOfYear, endOfYear, "YTD " + targetYear);
    }

    @Override
    public PlatformAnalyticsDTO getPlatformAnalyticsByPeriod(String startDate, String endDate) {
        log.info("Generating platform analytics for period: {} to {}", startDate, endDate);
        
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
        LocalDateTime start = LocalDate.parse(startDate, formatter).atStartOfDay();
        LocalDateTime end = LocalDate.parse(endDate, formatter).atTime(23, 59, 59);
        
        return generateAnalytics(start, end, startDate + " to " + endDate);
    }

    private PlatformAnalyticsDTO generateAnalytics(LocalDateTime start, LocalDateTime end, String period) {
        // Generate all analytics components
        RevenueAnalyticsDTO revenueAnalytics = calculateRevenueAnalytics(start, end);
        PlatformPerformanceDTO platformPerformance = calculatePlatformPerformance(start, end);
        List<TopMarketDTO> topMarkets = calculateTopMarkets(start, end);

        return PlatformAnalyticsDTO.builder()
                .revenueAnalytics(revenueAnalytics)
                .platformPerformance(platformPerformance)
                .topMarkets(topMarkets)
                .period(period)
                .generatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .build();
    }

    private RevenueAnalyticsDTO calculateRevenueAnalytics(LocalDateTime start, LocalDateTime end) {
        log.debug("Calculating revenue analytics from {} to {}", start, end);

        // Get all accepted bids in the period
        List<HotelBid> acceptedBids = hotelBidRepository.findAll().stream()
                .filter(bid -> bid.getStatus() == BidStatus.ACCEPTED)
                .filter(bid -> bid.getAcceptedAt() != null)
                .filter(bid -> !bid.getAcceptedAt().isBefore(start) && !bid.getAcceptedAt().isAfter(end))
                .collect(Collectors.toList());

        // Calculate total revenue
        BigDecimal totalRevenue = acceptedBids.stream()
                .map(bid -> bid.getTotalPrice() != null ? BigDecimal.valueOf(bid.getTotalPrice()) : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate platform commission (5% of total revenue)
        BigDecimal platformCommission = totalRevenue.multiply(BigDecimal.valueOf(COMMISSION_RATE));

        // Calculate average booking value
        BigDecimal averageBookingValue = BigDecimal.ZERO;
        if (!acceptedBids.isEmpty()) {
            averageBookingValue = totalRevenue.divide(
                    BigDecimal.valueOf(acceptedBids.size()), 2, RoundingMode.HALF_UP);
        }

        // Calculate growth rate (comparing to previous period)
        Double growthRate = calculateGrowthRate(start, end, totalRevenue);

        // Get monthly and quarterly revenue for current period
        BigDecimal monthlyRevenue = calculateMonthlyRevenue(start, end, acceptedBids);
        BigDecimal quarterlyRevenue = calculateQuarterlyRevenue(start, end, acceptedBids);

        // Count active hotels and DMCs
        long activeHotels = hotelRepository.countByStatus("APPROVED");
        long activeDMCs = dmcProfileRepository.countByStatus(DMCProfileStatus.APPROVED);

        return RevenueAnalyticsDTO.builder()
                .totalRevenue(totalRevenue)
                .platformCommission(platformCommission)
                .averageBookingValue(averageBookingValue)
                .growthRate(growthRate)
                .monthlyRevenue(monthlyRevenue)
                .quarterlyRevenue(quarterlyRevenue)
                .totalBookings(acceptedBids.size())
                .activeHotels((int) activeHotels)
                .activeDMCs((int) activeDMCs)
                .build();
    }

    private PlatformPerformanceDTO calculatePlatformPerformance(LocalDateTime start, LocalDateTime end) {
        log.debug("Calculating platform performance from {} to {}", start, end);

        // Get all inquiries in the period
        List<BidInquiry> inquiries = bidInquiryRepository.findAll().stream()
                .filter(inq -> inq.getPostedAt() != null)
                .filter(inq -> !inq.getPostedAt().isBefore(start) && !inq.getPostedAt().isAfter(end))
                .collect(Collectors.toList());

        // Get all bids in the period
        List<HotelBid> bids = hotelBidRepository.findAll().stream()
                .filter(bid -> bid.getSubmittedAt() != null)
                .filter(bid -> !bid.getSubmittedAt().isBefore(start) && !bid.getSubmittedAt().isAfter(end))
                .collect(Collectors.toList());

        int totalInquiries = inquiries.size();
        int successfulBookings = (int) inquiries.stream()
                .filter(inq -> inq.getStatus() == BidInquiryStatus.AWARDED)
                .count();

        int totalBids = bids.size();
        int acceptedBids = (int) bids.stream()
                .filter(bid -> bid.getStatus() == BidStatus.ACCEPTED)
                .count();

        // Calculate booking success rate
        Double bookingSuccessRate = totalInquiries > 0 
                ? (successfulBookings * 100.0) / totalInquiries 
                : 0.0;

        // Calculate average response time (time from inquiry posted to first bid)
        Double averageResponseTime = calculateAverageResponseTime(inquiries, bids);

        // Calculate user satisfaction (mock data - in real app, would come from reviews/ratings)
        Double userSatisfaction = 4.5; // Default rating out of 5

        // Calculate dispute rate (mock data - in real app, would track disputes)
        int totalDisputes = 0; // Would come from disputes table
        Double disputeRate = totalInquiries > 0 
                ? (totalDisputes * 100.0) / totalInquiries 
                : 0.0;

        return PlatformPerformanceDTO.builder()
                .bookingSuccessRate(Math.round(bookingSuccessRate * 100.0) / 100.0)
                .averageResponseTime(Math.round(averageResponseTime * 100.0) / 100.0)
                .userSatisfaction(Math.round(userSatisfaction * 10.0) / 10.0)
                .disputeRate(Math.round(disputeRate * 100.0) / 100.0)
                .totalInquiries(totalInquiries)
                .successfulBookings(successfulBookings)
                .totalBids(totalBids)
                .acceptedBids(acceptedBids)
                .totalDisputes(totalDisputes)
                .build();
    }

    private List<TopMarketDTO> calculateTopMarkets(LocalDateTime start, LocalDateTime end) {
        log.debug("Calculating top markets from {} to {}", start, end);

        // Get all accepted bids with their associated inquiries
        List<HotelBid> acceptedBids = hotelBidRepository.findAll().stream()
                .filter(bid -> bid.getStatus() == BidStatus.ACCEPTED)
                .filter(bid -> bid.getAcceptedAt() != null)
                .filter(bid -> !bid.getAcceptedAt().isBefore(start) && !bid.getAcceptedAt().isAfter(end))
                .collect(Collectors.toList());

        // Group by country (from hotel city/location)
        Map<String, List<HotelBid>> bidsByCountry = new HashMap<>();
        
        for (HotelBid bid : acceptedBids) {
            // Get hotel to determine country
            Optional<HotelProfile> hotelOpt = hotelRepository.findById(bid.getHotelId());
            String country = hotelOpt.map(HotelProfile::getCountry).orElse("Unknown");
            
            bidsByCountry.computeIfAbsent(country, k -> new ArrayList<>()).add(bid);
        }

        // Calculate total revenue for market share
        BigDecimal totalRevenue = acceptedBids.stream()
                .map(bid -> bid.getTotalPrice() != null ? BigDecimal.valueOf(bid.getTotalPrice()) : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Create TopMarketDTO for each country
        List<TopMarketDTO> markets = new ArrayList<>();
        int rank = 1;
        
        for (Map.Entry<String, List<HotelBid>> entry : bidsByCountry.entrySet()) {
            String country = entry.getKey();
            List<HotelBid> countryBids = entry.getValue();
            
            int bookingCount = countryBids.size();
            BigDecimal revenueValue = countryBids.stream()
                    .map(bid -> bid.getTotalPrice() != null ? BigDecimal.valueOf(bid.getTotalPrice()) : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            Double marketShare = totalRevenue.compareTo(BigDecimal.ZERO) > 0
                    ? revenueValue.divide(totalRevenue, 4, RoundingMode.HALF_UP)
                            .multiply(BigDecimal.valueOf(100)).doubleValue()
                    : 0.0;
            
            markets.add(TopMarketDTO.builder()
                    .countryName(country)
                    .countryCode(getCountryCode(country))
                    .bookingCount(bookingCount)
                    .revenueValue(revenueValue)
                    .marketShare(Math.round(marketShare * 100.0) / 100.0)
                    .rank(rank++)
                    .build());
        }

        // Sort by revenue (descending) and limit to top 10
        return markets.stream()
                .sorted((a, b) -> b.getRevenueValue().compareTo(a.getRevenueValue()))
                .limit(10)
                .collect(Collectors.toList());
    }

    // Helper methods

    private Double calculateGrowthRate(LocalDateTime start, LocalDateTime end, BigDecimal currentRevenue) {
        // Calculate previous period (same duration)
        long daysBetween = java.time.Duration.between(start, end).toDays();
        LocalDateTime prevStart = start.minusDays(daysBetween);
        LocalDateTime prevEnd = end.minusDays(daysBetween);

        // Get previous period revenue
        BigDecimal previousRevenue = hotelBidRepository.findAll().stream()
                .filter(bid -> bid.getStatus() == BidStatus.ACCEPTED)
                .filter(bid -> bid.getAcceptedAt() != null)
                .filter(bid -> !bid.getAcceptedAt().isBefore(prevStart) && !bid.getAcceptedAt().isAfter(prevEnd))
                .map(bid -> bid.getTotalPrice() != null ? BigDecimal.valueOf(bid.getTotalPrice()) : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (previousRevenue.compareTo(BigDecimal.ZERO) == 0) {
            return currentRevenue.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }

        BigDecimal growth = currentRevenue.subtract(previousRevenue)
                .divide(previousRevenue, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));

        return Math.round(growth.doubleValue() * 100.0) / 100.0;
    }

    private BigDecimal calculateMonthlyRevenue(LocalDateTime start, LocalDateTime end, List<HotelBid> acceptedBids) {
        LocalDateTime monthStart = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime monthEnd = LocalDateTime.now();

        return acceptedBids.stream()
                .filter(bid -> bid.getAcceptedAt() != null)
                .filter(bid -> !bid.getAcceptedAt().isBefore(monthStart) && !bid.getAcceptedAt().isAfter(monthEnd))
                .map(bid -> bid.getTotalPrice() != null ? BigDecimal.valueOf(bid.getTotalPrice()) : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateQuarterlyRevenue(LocalDateTime start, LocalDateTime end, List<HotelBid> acceptedBids) {
        int currentMonth = LocalDateTime.now().getMonthValue();
        int quarterStartMonth = ((currentMonth - 1) / 3) * 3 + 1;
        
        LocalDateTime quarterStart = LocalDateTime.now()
                .withMonth(quarterStartMonth)
                .withDayOfMonth(1)
                .withHour(0).withMinute(0).withSecond(0);
        LocalDateTime quarterEnd = LocalDateTime.now();

        return acceptedBids.stream()
                .filter(bid -> bid.getAcceptedAt() != null)
                .filter(bid -> !bid.getAcceptedAt().isBefore(quarterStart) && !bid.getAcceptedAt().isAfter(quarterEnd))
                .map(bid -> bid.getTotalPrice() != null ? BigDecimal.valueOf(bid.getTotalPrice()) : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private Double calculateAverageResponseTime(List<BidInquiry> inquiries, List<HotelBid> bids) {
        if (inquiries.isEmpty() || bids.isEmpty()) {
            return 0.0;
        }

        // Map bids by inquiry ID
        Map<String, List<HotelBid>> bidsByInquiry = bids.stream()
                .collect(Collectors.groupingBy(HotelBid::getInquiryId));

        List<Double> responseTimes = new ArrayList<>();

        for (BidInquiry inquiry : inquiries) {
            List<HotelBid> inquiryBids = bidsByInquiry.get(inquiry.getId());
            if (inquiryBids != null && !inquiryBids.isEmpty()) {
                // Get first bid time
                LocalDateTime firstBidTime = inquiryBids.stream()
                        .map(HotelBid::getSubmittedAt)
                        .filter(Objects::nonNull)
                        .min(LocalDateTime::compareTo)
                        .orElse(null);

                if (firstBidTime != null && inquiry.getPostedAt() != null) {
                    long hours = java.time.Duration.between(inquiry.getPostedAt(), firstBidTime).toHours();
                    responseTimes.add((double) hours);
                }
            }
        }

        if (responseTimes.isEmpty()) {
            return 0.0;
        }

        double average = responseTimes.stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);

        return average;
    }

    private String getCountryCode(String countryName) {
        // Simple mapping - in production, use a proper library or service
        Map<String, String> countryCodes = new HashMap<>();
        countryCodes.put("Sri Lanka", "LK");
        countryCodes.put("India", "IN");
        countryCodes.put("United States", "US");
        countryCodes.put("United Kingdom", "GB");
        countryCodes.put("Australia", "AU");
        countryCodes.put("Canada", "CA");
        countryCodes.put("Germany", "DE");
        countryCodes.put("France", "FR");
        countryCodes.put("Japan", "JP");
        countryCodes.put("China", "CN");
        
        return countryCodes.getOrDefault(countryName, "XX");
    }
}
