package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.constants.SubscriptionStatus;
import com.hotel_bidding.backend.dto.response.SubscriptionResponse;
import com.hotel_bidding.backend.entity.Subscription;
import com.hotel_bidding.backend.entity.User;
import com.hotel_bidding.backend.exception.ResourceNotFoundException;
import com.hotel_bidding.backend.repository.SubscriptionRepository;
import com.hotel_bidding.backend.repository.UserRepository;
import com.hotel_bidding.backend.service.AdminSubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminSubscriptionServiceImpl implements AdminSubscriptionService {
    
    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    
    @Override
    public Page<SubscriptionResponse> getAllSubscriptions(SubscriptionStatus status, String search, Pageable pageable) {
        List<Subscription> allSubscriptions = subscriptionRepository.findAll();
        
        // Filter by status if provided
        if (status != null) {
            allSubscriptions = allSubscriptions.stream()
                    .filter(sub -> sub.getStatus() == status)
                    .collect(Collectors.toList());
        }
        
        // Filter by search if provided (search user email or username)
        if (search != null && !search.trim().isEmpty()) {
            String searchLower = search.toLowerCase();
            allSubscriptions = allSubscriptions.stream()
                    .filter(sub -> {
                        User user = userRepository.findById(sub.getUserId()).orElse(null);
                        if (user != null) {
                            return user.getEmail().toLowerCase().contains(searchLower) ||
                                   user.getUsername().toLowerCase().contains(searchLower) ||
                                   (user.getFullName() != null && user.getFullName().toLowerCase().contains(searchLower));
                        }
                        return false;
                    })
                    .collect(Collectors.toList());
        }
        
        // Convert to SubscriptionResponse with user info
        List<SubscriptionResponse> responses = allSubscriptions.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        // Manual pagination
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), responses.size());
        List<SubscriptionResponse> pageContent = responses.subList(start, end);
        
        return new PageImpl<>(pageContent, pageable, responses.size());
    }
    
    private SubscriptionResponse convertToResponse(Subscription subscription) {
        User user = userRepository.findById(subscription.getUserId()).orElse(null);
        
        SubscriptionResponse.UserInfo userInfo = null;
        if (user != null) {
            userInfo = SubscriptionResponse.UserInfo.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .role(user.getRole() != null ? user.getRole().name() : null)
                    .approved(user.getStatus() != null && user.getStatus().name().equals("APPROVED"))
                    .build();
        }
        
        return SubscriptionResponse.builder()
                .id(subscription.getId())
                .userId(subscription.getUserId())
                .status(subscription.getStatus())
                .plan(subscription.getPlan())
                .startDate(subscription.getStartDate())
                .endDate(subscription.getEndDate())
                .paymentId(subscription.getPaymentId())
                .payherePaymentId(subscription.getPayherePaymentId())
                .amount(subscription.getAmount())
                .currency(subscription.getCurrency())
                .autoRenew(subscription.isAutoRenew())
                .createdAt(subscription.getCreatedAt())
                .updatedAt(subscription.getUpdatedAt())
                .user(userInfo)
                .isExpired(subscription.isExpired())
                .isTrial(subscription.isTrial())
                .daysRemaining(subscription.getDaysRemaining())
                .build();
    }
    
    @Override
    public Map<String, Object> getSubscriptionStatistics() {
        List<Subscription> allSubscriptions = subscriptionRepository.findAll();
        
        long totalSubscriptions = allSubscriptions.size();
        long activeCount = allSubscriptions.stream().filter(s -> s.getStatus() == SubscriptionStatus.ACTIVE).count();
        long trialCount = allSubscriptions.stream().filter(s -> s.getStatus() == SubscriptionStatus.TRIAL).count();
        long expiredCount = allSubscriptions.stream().filter(s -> s.getStatus() == SubscriptionStatus.EXPIRED).count();
        long cancelledCount = allSubscriptions.stream().filter(s -> s.getStatus() == SubscriptionStatus.CANCELLED).count();
        
        // Calculate revenue (only from ACTIVE subscriptions)
        double monthlyRevenue = allSubscriptions.stream()
                .filter(s -> s.getStatus() == SubscriptionStatus.ACTIVE && s.getPlan() != null)
                .mapToDouble(Subscription::getAmount)
                .sum();
        
        // Count expiring soon (within 7 days)
        LocalDateTime sevenDaysFromNow = LocalDateTime.now().plusDays(7);
        long expiringSoon = allSubscriptions.stream()
                .filter(s -> s.getStatus() == SubscriptionStatus.ACTIVE || s.getStatus() == SubscriptionStatus.TRIAL)
                .filter(s -> s.getEndDate() != null && s.getEndDate().isBefore(sevenDaysFromNow))
                .count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSubscriptions", totalSubscriptions);
        stats.put("activeSubscriptions", activeCount);
        stats.put("trialSubscriptions", trialCount);
        stats.put("expiredSubscriptions", expiredCount);
        stats.put("cancelledSubscriptions", cancelledCount);
        stats.put("monthlyRevenue", monthlyRevenue);
        stats.put("expiringSoon", expiringSoon);
        stats.put("conversionRate", trialCount > 0 ? (activeCount * 100.0 / (trialCount + activeCount)) : 0);
        
        return stats;
    }
    
    @Override
    @Transactional
    public Subscription extendSubscription(String subscriptionId, int days) {
        log.info("Admin extending subscription {} by {} days", subscriptionId, days);
        
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));
        
        LocalDateTime newEndDate = subscription.getEndDate().plusDays(days);
        subscription.setEndDate(newEndDate);
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setUpdatedAt(LocalDateTime.now());
        subscription.setUpdatedBy("ADMIN");
        
        Subscription saved = subscriptionRepository.save(subscription);
        log.info("Subscription extended successfully. New end date: {}", newEndDate);
        
        return saved;
    }
    
    @Override
    @Transactional
    public void cancelSubscription(String subscriptionId) {
        log.info("Admin cancelling subscription: {}", subscriptionId);
        
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));
        
        subscription.setStatus(SubscriptionStatus.CANCELLED);
        subscription.setUpdatedAt(LocalDateTime.now());
        subscription.setUpdatedBy("ADMIN");
        
        subscriptionRepository.save(subscription);
        log.info("Subscription cancelled successfully");
    }
    
    @Override
    public SubscriptionResponse getSubscriptionById(String subscriptionId) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));
        return convertToResponse(subscription);
    }
}
