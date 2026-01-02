package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.constants.BidStatus;
import com.hotel_bidding.backend.constants.PaymentStatus;
import com.hotel_bidding.backend.constants.PayoutStatus;
import com.hotel_bidding.backend.dto.analytics.PlatformAnalyticsDTO;
import com.hotel_bidding.backend.dto.analytics.PlatformPerformanceDTO;
import com.hotel_bidding.backend.dto.analytics.RevenueAnalyticsDTO;
import com.hotel_bidding.backend.dto.analytics.TopHotelMarketDTO;
import com.hotel_bidding.backend.entity.HotelBid;
import com.hotel_bidding.backend.entity.HotelProfile;
import com.hotel_bidding.backend.entity.Payment;
import com.hotel_bidding.backend.repository.HotelBidRepository;
import com.hotel_bidding.backend.repository.HotelRepository;
import com.hotel_bidding.backend.repository.PaymentRepository;
import com.hotel_bidding.backend.service.PlatformAnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.ConditionalOperators;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.aggregation.SortOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    private final MongoTemplate mongoTemplate;
    
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
        LocalDateTime now = LocalDateTime.now();
        
        // Get all completed payments for this year
        List<Payment> completedPayments = paymentRepository.findAll().stream()
                .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED)
                .filter(p -> p.getPaymentCompletedAt() != null && 
                            p.getPaymentCompletedAt().isAfter(startOfYear))
                .collect(Collectors.toList());
        
        // Calculate metrics
        double totalRevenue = completedPayments.stream()
                .mapToDouble(p -> p.getTotalAmount() != null ? p.getTotalAmount() : 0.0)
                .sum();
        
        double totalCommission = completedPayments.stream()
                .mapToDouble(p -> p.getPlatformCommission() != null ? p.getPlatformCommission() : 0.0)
                .sum();
        
        int totalBookings = completedPayments.size();
        
        double averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0.0;
        
        // Calculate previous year data for growth rate
        LocalDateTime startOfLastYear = startOfYear.minusYears(1);
        LocalDateTime endOfLastYear = startOfYear.minusDays(1);
        
        List<Payment> previousYearPayments = paymentRepository.findAll().stream()
                .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED)
                .filter(p -> p.getPaymentCompletedAt() != null && 
                            p.getPaymentCompletedAt().isAfter(startOfLastYear) &&
                            p.getPaymentCompletedAt().isBefore(endOfLastYear))
                .collect(Collectors.toList());
        
        double previousYearRevenue = previousYearPayments.stream()
                .mapToDouble(p -> p.getTotalAmount() != null ? p.getTotalAmount() : 0.0)
                .sum();
        
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
        
        double disputeRate = allPayments.size() > 0 ? 
                (disputedPayments * 100.0) / allPayments.size() : 0.0;
        
        // Calculate user satisfaction (simplified: based on successful completion rate)
        double userSatisfaction = allPayments.size() > 0 ?
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
    public List<TopHotelMarketDTO> getTopHotelMarkets(int limit) {
        log.info("Fetching top {} hotel markets", limit);
        
        try {
            // Group bids by hotel and calculate statistics
            GroupOperation groupByHotel = Aggregation.group("hotelUserId")
                    .count().as("totalBids")
                    .sum(ConditionalOperators.when(Criteria.where("status").is(BidStatus.ACCEPTED.toString()))
                            .then(1).otherwise(0)).as("acceptedBids")
                    .avg("totalPrice").as("avgBidValue")
                    .first("hotelUserId").as("hotelUserId")
                    .first("hotelName").as("hotelName")
                    .first("hotelCity").as("hotelCity");
            
            SortOperation sortByTotalBids = Aggregation.sort(Sort.Direction.DESC, "totalBids");
            
            Aggregation aggregation = Aggregation.newAggregation(
                    groupByHotel,
                    sortByTotalBids,
                    Aggregation.limit(limit)
            );
            
            AggregationResults<Map> results = mongoTemplate.aggregate(
                    aggregation, "hotel_bids", Map.class);
            
            List<TopHotelMarketDTO> topMarkets = new ArrayList<>();
            
            for (Map result : results.getMappedResults()) {
                String hotelUserId = (String) result.get("hotelUserId");
                
                // Get hotel profile details
                HotelProfile hotelProfile = hotelRepository.findByUserId(hotelUserId).orElse(null);
                
                // Calculate revenue for this hotel
                double totalRevenue = paymentRepository.findAll().stream()
                        .filter(p -> p.getHotelUserId() != null && p.getHotelUserId().equals(hotelUserId))
                        .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED)
                        .mapToDouble(p -> p.getTotalAmount() != null ? p.getTotalAmount() : 0.0)
                        .sum();
                
                Integer totalBids = result.get("totalBids") != null ? 
                        ((Number) result.get("totalBids")).intValue() : 0;
                Integer acceptedBids = result.get("acceptedBids") != null ? 
                        ((Number) result.get("acceptedBids")).intValue() : 0;
                Double avgBidValue = result.get("avgBidValue") != null ? 
                        ((Number) result.get("avgBidValue")).doubleValue() : 0.0;
                
                double successRate = totalBids > 0 ? (acceptedBids * 100.0) / totalBids : 0.0;
                
                TopHotelMarketDTO dto = TopHotelMarketDTO.builder()
                        .hotelId(hotelProfile != null ? hotelProfile.getId() : null)
                        .hotelName((String) result.get("hotelName"))
                        .city((String) result.get("hotelCity"))
                        .country(hotelProfile != null ? hotelProfile.getCountry() : "N/A")
                        .totalBids(totalBids)
                        .acceptedBids(acceptedBids)
                        .totalRevenue(Math.round(totalRevenue * 100.0) / 100.0)
                        .successRate(Math.round(successRate * 100.0) / 100.0)
                        .averageBidValue(Math.round(avgBidValue * 100.0) / 100.0)
                        .hotelStars(hotelProfile != null ? hotelProfile.getHotelStars() : null)
                        .status(hotelProfile != null ? hotelProfile.getStatus() : "N/A")
                        .build();
                
                topMarkets.add(dto);
            }
            
            return topMarkets;
            
        } catch (Exception e) {
            log.error("Error fetching top hotel markets", e);
            return new ArrayList<>();
        }
    }
}
