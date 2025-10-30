package com.hotel_bidding.backend.scheduler;

import com.hotel_bidding.backend.service.BidInquiryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduled tasks for Bid Inquiry system
 * Handles automatic closing of expired inquiries and deadline notifications
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class BidInquiryScheduler {

    private final BidInquiryService bidInquiryService;

    /**
     * Auto-close expired inquiries
     * Runs every 30 minutes
     */
    @Scheduled(fixedRate = 1800000) // 30 minutes = 1800000 ms
    public void autoCloseExpiredInquiries() {
        log.info("Running scheduled task: Auto-close expired inquiries");
        
        try {
            bidInquiryService.autoCloseExpiredInquiries();
            log.info("Successfully completed auto-close expired inquiries task");
        } catch (Exception e) {
            log.error("Error occurred while auto-closing expired inquiries: {}", e.getMessage(), e);
        }
    }

    /**
     * Send deadline approaching notifications (24 hours before deadline)
     * Runs every 1 hour
     * 
     * Note: This would require a new service method to find inquiries expiring in 24 hours
     * and send notifications. Implementation deferred for now.
     */
    // @Scheduled(fixedRate = 3600000) // 1 hour = 3600000 ms
    // public void sendDeadlineApproachingNotifications() {
    //     log.info("Running scheduled task: Send deadline approaching notifications");
    //     
    //     try {
    //         // Find inquiries expiring in 24 hours
    //         // Call notificationService.notifyAboutApproachingDeadline(inquiryId);
    //     } catch (Exception e) {
    //         log.error("Error occurred while sending deadline notifications: {}", e.getMessage(), e);
    //     }
    // }
}
