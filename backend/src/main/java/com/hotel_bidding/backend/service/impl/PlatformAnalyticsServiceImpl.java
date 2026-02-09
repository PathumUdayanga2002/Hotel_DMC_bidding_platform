package com.hotel_bidding.backend.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.hotel_bidding.backend.constants.BidStatus;
import com.hotel_bidding.backend.constants.PaymentStatus;
import com.hotel_bidding.backend.dto.analytics.PlatformAnalyticsDTO;
import com.hotel_bidding.backend.dto.analytics.PlatformPerformanceDTO;
import com.hotel_bidding.backend.dto.analytics.RevenueAnalyticsDTO;
import com.hotel_bidding.backend.dto.analytics.TopHotelMarketDTO;
import com.hotel_bidding.backend.entity.HotelBid;
import com.hotel_bidding.backend.entity.HotelProfile;
import com.hotel_bidding.backend.entity.Payment;
import com.hotel_bidding.backend.entity.Subscription;
import com.hotel_bidding.backend.repository.HotelBidRepository;
import com.hotel_bidding.backend.repository.HotelRepository;
import com.hotel_bidding.backend.repository.PaymentRepository;
import com.hotel_bidding.backend.repository.SubscriptionRepository;
import com.hotel_bidding.backend.service.PlatformAnalyticsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implementation of Platform Analytics Service
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PlatformAnalyticsServiceImpl implements PlatformAnalyticsService {
    
    private final PaymentRepository paymentRepository;
    private final HotelBidRepository hotelBidRepository;
    private final HotelRepository hotelRepository;
    private final SubscriptionRepository subscriptionRepository;
    
    @Override
    public PlatformAnalyticsDTO getPlatformAnalytics() {
        log.info("Generating complete platform analytics");
        
        return PlatformAnalyticsDTO.builder()
                .revenueAnalytics(getRevenueAnalytics())
                .platformPerformance(getPlatformPerformance())
                .topHotelMarkets(getTopHotelMarkets(10))
                .generatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME))
                .period("YTD " + LocalDateTime.now().getYear())
                .build();
    }
    
    @Override
    public RevenueAnalyticsDTO getRevenueAnalytics() {
        log.info("Calculating revenue analytics");
        
        // Get year-to-date date range
        LocalDateTime startOfYear = LocalDateTime.now().withDayOfYear(1).withHour(0).withMinute(0).withSecond(0);
        
        log.info("Calculating analytics from start of year: {}", startOfYear);
        
        // Get all completed payments for this year
        List<Payment> allPayments = paymentRepository.findAll();
        List<Payment> completedPayments = allPayments.stream()
                .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED)
                .filter(p -> p.getPaymentCompletedAt() != null && 
                            p.getPaymentCompletedAt().isAfter(startOfYear))
                .collect(Collectors.toList());
        
        log.info("Total payments in database: {}", allPayments.size());
        log.info("Found {} completed payments for year-to-date", completedPayments.size());
        
        // Debug: Show all completed payments (any year)
        long allCompletedCount = allPayments.stream()
                .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED)
                .count();
        log.info("Total completed payments (all time): {}", allCompletedCount);
        
        // Calculate booking revenue from payments
        double bookingRevenue = completedPayments.stream()
                .mapToDouble(p -> p.getTotalAmount() != null ? p.getTotalAmount() : 0.0)
                .sum();
        
        log.info("Booking revenue calculated: {}", bookingRevenue);
        
        double totalCommission = completedPayments.stream()
                .mapToDouble(p -> p.getPlatformCommission() != null ? p.getPlatformCommission() : 0.0)
                .sum();
        
        log.info("Total commission calculated: {}", totalCommission);
        
        // Calculate subscription revenue for the year
        // Count all subscriptions that were paid/activated during this year
        List<Subscription> allSubscriptions = subscriptionRepository.findAll();
        
        List<Subscription> yearSubscriptions = allSubscriptions.stream()
                .filter(s -> {
                    // Include subscriptions created this year (new subscriptions)
                    if (s.getCreatedAt() != null && s.getCreatedAt().isAfter(startOfYear)) {
                        return true;
                    }
                    // Include subscriptions that started this year (activated/renewed)
                    if (s.getStartDate() != null && s.getStartDate().isAfter(startOfYear)) {
                        return true;
                    }
                    return false;
                })
                .collect(Collectors.toList());
        
        log.info("Found {} subscriptions for revenue calculation (created or started this year)", yearSubscriptions.size());
        log.info("Total subscriptions in database: {}", allSubscriptions.size());
        
        // Calculate total subscription revenue from this year's subscriptions
        double subscriptionRevenue = yearSubscriptions.stream()
                .mapToDouble(s -> {
                    double amt = s.getAmount() != null ? s.getAmount() : 0.0;
                    if (amt > 0) {
                        log.debug("Subscription {} - Amount: {}, Status: {}, Created: {}, Started: {}", 
                                s.getId(), amt, s.getStatus(), s.getCreatedAt(), s.getStartDate());
                    }
                    return amt;
                })
                .sum();
        
        log.info("Subscription revenue calculated: {} (from {} subscriptions)", 
                subscriptionRevenue, yearSubscriptions.size());
        
        // Calculate total revenue (booking revenue + subscription revenue)
        double totalRevenue = bookingRevenue + subscriptionRevenue;
        
        log.info("Total revenue (bookings + subscriptions): {}", totalRevenue);
        
        int totalBookings = completedPayments.size();
        
        double averageBookingValue = totalBookings > 0 ? bookingRevenue / totalBookings : 0.0;
        
        log.info("Average Booking Value calculated: {} (from {} bookings, total revenue: {})", 
                averageBookingValue, totalBookings, bookingRevenue);
        
        // Calculate previous year data for growth rate
        LocalDateTime startOfLastYear = startOfYear.minusYears(1);
        LocalDateTime endOfLastYear = startOfYear.minusDays(1);
        
        List<Payment> previousYearPayments = paymentRepository.findAll().stream()
                .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED)
                .filter(p -> p.getPaymentCompletedAt() != null && 
                            p.getPaymentCompletedAt().isAfter(startOfLastYear) &&
                            p.getPaymentCompletedAt().isBefore(endOfLastYear))
                .collect(Collectors.toList());
        
        double previousYearBookingRevenue = previousYearPayments.stream()
                .mapToDouble(p -> p.getTotalAmount() != null ? p.getTotalAmount() : 0.0)
                .sum();
        
        // Calculate previous year subscription revenue
        List<Subscription> previousYearSubscriptions = subscriptionRepository.findAll().stream()
                .filter(s -> {
                    if (s.getCreatedAt() != null && s.getCreatedAt().isAfter(startOfLastYear) && s.getCreatedAt().isBefore(endOfLastYear)) {
                        return true;
                    }
                    if (s.getStartDate() != null && s.getStartDate().isAfter(startOfLastYear) && s.getStartDate().isBefore(endOfLastYear)) {
                        return true;
                    }
                    return false;
                })
                .collect(Collectors.toList());
        
        double previousYearSubscriptionRevenue = previousYearSubscriptions.stream()
                .mapToDouble(s -> s.getAmount() != null ? s.getAmount() : 0.0)
                .sum();
        
        double previousYearRevenue = previousYearBookingRevenue + previousYearSubscriptionRevenue;
        
        log.info("Previous year revenue: {} (bookings: {}, subscriptions: {})", 
                previousYearRevenue, previousYearBookingRevenue, previousYearSubscriptionRevenue);
        
        // Calculate growth rate
        double growthRate = 0.0;
        if (previousYearRevenue > 0) {
            growthRate = ((totalRevenue - previousYearRevenue) / previousYearRevenue) * 100;
        } else if (totalRevenue > 0) {
            growthRate = 100.0; // 100% growth if starting from zero
        }
        
        return RevenueAnalyticsDTO.builder()
                .totalRevenueYTD(Math.round(totalRevenue * 100.0) / 100.0)
                .platformCommission(Math.round(totalCommission * 100.0) / 100.0)
                .subscriptionRevenue(Math.round(subscriptionRevenue * 100.0) / 100.0)
                .averageBookingValue(Math.round(averageBookingValue * 100.0) / 100.0)
                .growthRate(Math.round(growthRate * 100.0) / 100.0)
                .currency("USD")
                .totalBookingsYTD(totalBookings)
                .previousPeriodRevenue(Math.round(previousYearRevenue * 100.0) / 100.0)
                .previousPeriodBookings(previousYearPayments.size())
                .build();
    }
    
    @Override
    public PlatformPerformanceDTO getPlatformPerformance() {
        log.info("Calculating platform performance metrics");
        
        // Get all bids
        List<HotelBid> allBids = hotelBidRepository.findAll();
        int totalBids = allBids.size();
        
        // Count accepted bids
        long acceptedBids = allBids.stream()
                .filter(bid -> bid.getStatus() == BidStatus.ACCEPTED)
                .count();
        
        // Calculate booking success rate
        double bookingSuccessRate = totalBids > 0 ? (acceptedBids * 100.0) / totalBids : 0.0;
        
        // Calculate average response time (from inquiry to first bid)
        double averageBidResponseTime = allBids.stream()
                .filter(bid -> bid.getSubmittedAt() != null)
                .mapToDouble(bid -> {
                    // Assuming inquiry creation time is before bid submission
                    // This is a simplified calculation
                    return 24.0; // Placeholder: 24 hours average
                })
                .average()
                .orElse(0.0);
        
        // Get payment statistics
        List<Payment> allPayments = paymentRepository.findAll();
        long completedPayments = allPayments.stream()
                .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED)
                .count();
        
        // Calculate dispute rate (failed/cancelled as disputes)
        long disputedPayments = allPayments.stream()
                .filter(p -> p.getPaymentStatus() == PaymentStatus.FAILED || 
                            p.getPaymentStatus() == PaymentStatus.CANCELLED)
                .count();
        
        double disputeRate = !allPayments.isEmpty() ?
                (disputedPayments * 100.0) / allPayments.size() : 0.0;
        
        // Calculate user satisfaction (simplified: based on successful completion rate)
        double userSatisfaction = !allPayments.isEmpty() ?
                (completedPayments * 100.0) / allPayments.size() : 0.0;
        
        // Average response time for platform (simplified to 24 hours)
        double averageResponseTime = 24.0;
        
        return PlatformPerformanceDTO.builder()
                .bookingSuccessRate(Math.round(bookingSuccessRate * 100.0) / 100.0)
                .averageResponseTime(Math.round(averageResponseTime * 100.0) / 100.0)
                .userSatisfaction(Math.round(userSatisfaction * 100.0) / 100.0)
                .disputeRate(Math.round(disputeRate * 100.0) / 100.0)
                .totalBids(totalBids)
                .acceptedBids((int) acceptedBids)
                .completedPayments((int) completedPayments)
                .totalDisputes((int) disputedPayments)
                .averageBidResponseTime(Math.round(averageBidResponseTime * 100.0) / 100.0)
                .build();
    }
    
    @Override
    public List<TopHotelMarketDTO> getTopHotelMarkets(int limit, String sortBy, Integer minStars, String city) {
        log.info("Fetching top {} hotel markets with filters - sortBy: {}, minStars: {}, city: {}", 
                limit, sortBy, minStars, city);
        
        try {
            // Get all approved hotel profiles
            List<HotelProfile> allHotels = hotelRepository.findByStatus("APPROVED");
            
            // Apply filters
            List<HotelProfile> filteredHotels = allHotels.stream()
                    .filter(hotel -> {
                        // City filter
                        if (city != null && !city.trim().isEmpty()) {
                            return hotel.getCity() != null && 
                                   hotel.getCity().toLowerCase().contains(city.toLowerCase());
                        }
                        return true;
                    })
                    .filter(hotel -> {
                        // Star rating filter
                        if (minStars != null) {
                            Integer hotelStars = hotel.getHotelStars();
                            return hotelStars != null && hotelStars >= minStars;
                        }
                        return true;
                    })
                    .collect(Collectors.toList());
            
            // Get all bids for statistics
            List<HotelBid> allBids = hotelBidRepository.findAll();
            
            // Get all payments for revenue calculation
            List<Payment> allPayments = paymentRepository.findAll().stream()
                    .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED)
                    .collect(Collectors.toList());
            
            // Build DTOs for each hotel
            List<TopHotelMarketDTO> topMarkets = new ArrayList<>();
            
            for (HotelProfile hotel : filteredHotels) {
                String hotelUserId = hotel.getUserId();
                
                // Calculate bid statistics for this hotel
                List<HotelBid> hotelBids = allBids.stream()
                        .filter(bid -> bid.getHotelUserId() != null && 
                                      bid.getHotelUserId().equals(hotelUserId))
                        .collect(Collectors.toList());
                
                int totalBids = hotelBids.size();
                long acceptedBids = hotelBids.stream()
                        .filter(bid -> bid.getStatus() == BidStatus.ACCEPTED)
                        .count();
                
                double avgBidValue = hotelBids.stream()
                        .mapToDouble(bid -> bid.getTotalPrice() != null ? bid.getTotalPrice() : 0.0)
                        .average()
                        .orElse(0.0);
                
                // Calculate revenue for this hotel
                double totalRevenue = allPayments.stream()
                        .filter(p -> p.getHotelUserId() != null && 
                                    p.getHotelUserId().equals(hotelUserId))
                        .mapToDouble(p -> p.getTotalAmount() != null ? p.getTotalAmount() : 0.0)
                        .sum();
                
                double successRate = totalBids > 0 ? (acceptedBids * 100.0) / totalBids : 0.0;
                
                TopHotelMarketDTO dto = TopHotelMarketDTO.builder()
                        .hotelId(hotel.getId())
                        .hotelName(hotel.getName())
                        .city(hotel.getCity())
                        .country(hotel.getCountry())
                        .totalBids(totalBids)
                        .acceptedBids((int) acceptedBids)
                        .totalRevenue(Math.round(totalRevenue * 100.0) / 100.0)
                        .successRate(Math.round(successRate * 100.0) / 100.0)
                        .averageBidValue(Math.round(avgBidValue * 100.0) / 100.0)
                        .hotelStars(hotel.getHotelStars())
                        .status(hotel.getStatus())
                        .build();
                
                topMarkets.add(dto);
            }
            
            // Apply sorting based on sortBy parameter
            if (sortBy != null && !topMarkets.isEmpty()) {
                switch (sortBy.toLowerCase()) {
                    case "successrate":
                        topMarkets.sort((a, b) -> Double.compare(b.getSuccessRate(), a.getSuccessRate()));
                        break;
                    case "revenue":
                        topMarkets.sort((a, b) -> Double.compare(b.getTotalRevenue(), a.getTotalRevenue()));
                        break;
                    case "avgbidvalue":
                        topMarkets.sort((a, b) -> Double.compare(b.getAverageBidValue(), a.getAverageBidValue()));
                        break;
                    case "totalbids":
                    default:
                        topMarkets.sort((a, b) -> Integer.compare(b.getTotalBids(), a.getTotalBids()));
                        break;
                }
            } else {
                // Default sort by total bids descending
                topMarkets.sort((a, b) -> Integer.compare(b.getTotalBids(), a.getTotalBids()));
            }
            
            // Return limited results
            return topMarkets.stream().limit(limit).collect(Collectors.toList());
            
        } catch (Exception e) {
            log.error("Error fetching top hotel markets", e);
            return new ArrayList<>();
        }
    }
}
