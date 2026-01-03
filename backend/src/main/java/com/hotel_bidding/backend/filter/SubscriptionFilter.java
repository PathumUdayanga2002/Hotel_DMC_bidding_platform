package com.hotel_bidding.backend.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.entity.Subscription;
import com.hotel_bidding.backend.entity.User;
import com.hotel_bidding.backend.repository.SubscriptionRepository;
import com.hotel_bidding.backend.repository.UserRepository;
import com.hotel_bidding.backend.service.SubscriptionService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * Filter to check subscription status before allowing access to protected endpoints
 * Blocks EXPIRED users from accessing premium features
 * 
 * IMPORTANT: Users without any subscription (pending profile approval) are ALLOWED
 * Trial only starts AFTER admin approves the profile
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SubscriptionFilter extends OncePerRequestFilter {
    
    private final SubscriptionService subscriptionService;
    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    
    // Endpoints that don't require active subscription
    private static final List<String> EXCLUDED_PATHS = Arrays.asList(
            "/auth/",
            "/admin/",
            // Subscription management endpoints
            "/subscription/status",
            "/subscription/purchase",
            "/subscription/payhere-notify",
            "/subscription/plans",
            "/subscription/cancel",
            "/subscription/payment-history",
            // Profile registration endpoints (users need to complete profile before trial starts)
            "/hotel/profile",
            "/dmc/profile",
            // Public endpoints
            "/public/",
            "/api-docs",
            "/swagger-ui",
            "/actuator"
    );
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String requestPath = request.getRequestURI();
        
        // Skip filter for excluded paths
        if (shouldSkipFilter(requestPath)) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // Get authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated() && 
            !"anonymousUser".equals(authentication.getPrincipal())) {
            
            String username = authentication.getName();
            
            try {
                User user = userRepository.findByUsername(username).orElse(null);
                
                if (user != null) {
                    // Check if user has a subscription record
                    Optional<Subscription> subscriptionOpt = subscriptionRepository.findByUserId(user.getId());
                    
                    if (subscriptionOpt.isEmpty()) {
                        // User has NO subscription yet - this means:
                        // 1. They just registered
                        // 2. Profile not approved yet
                        // 3. Trial hasn't started
                        // ALLOW them to continue (they need to complete profile)
                        log.debug("User {} has no subscription yet (pending profile approval), allowing access", username);
                        filterChain.doFilter(request, response);
                        return;
                    }
                    
                    Subscription subscription = subscriptionOpt.get();
                    
                    // Only block if subscription EXISTS and is EXPIRED
                    if (subscription.isExpired()) {
                        log.warn("User {} attempted to access {} with EXPIRED subscription", username, requestPath);
                        
                        // Block access - return 403 with subscription required message
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.setContentType("application/json");
                        
                        ApiResponse apiResponse = ApiResponse.builder()
                                .success(false)
                                .message("Your subscription has expired. Please renew to continue accessing this feature.")
                                .data(null)
                                .build();
                        
                        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
                        return;
                    }
                    
                    // Subscription exists and is active (TRIAL or ACTIVE status)
                    log.debug("User {} has active subscription ({}), allowing access", username, subscription.getStatus());
                }
            } catch (Exception e) {
                log.error("Error checking subscription status for user: {}", username, e);
                // Continue with request if there's an error checking subscription
                // This prevents blocking users due to technical issues
            }
        }
        
        filterChain.doFilter(request, response);
    }
    
    private boolean shouldSkipFilter(String requestPath) {
        return EXCLUDED_PATHS.stream().anyMatch(requestPath::contains);
    }
}
