package com.hotel_bidding.backend.scheduler;

import com.hotel_bidding.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduler for payment-related automated tasks
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentScheduler {

    private final PaymentService paymentService;

    /**
     * Cancel expired payments
     * Runs every 1 minute to check for payments that have exceeded the 15-minute timeout
     * 
     * Cron: 0 * * * * * = Every minute at 0 seconds
     */
    @Scheduled(cron = "0 * * * * *")
    public void cancelExpiredPayments() {
        log.info("Starting scheduled task: Cancel expired payments");
        
        try {
            paymentService.cancelExpiredPayments();
            log.info("Completed scheduled task: Cancel expired payments");
        } catch (Exception e) {
            log.error("Error in scheduled task: Cancel expired payments", e);
        }
    }

    /**
     * Process pending payouts
     * Runs every hour to process approved payouts via PayHere Payout API
     * 
     * Cron: 0 0 * * * * = Every hour at the top of the hour
     */
    @Scheduled(cron = "0 0 * * * *")
    public void processPendingPayouts() {
        log.info("Starting scheduled task: Process pending payouts");
        
        try {
            paymentService.processPendingPayouts();
            log.info("Completed scheduled task: Process pending payouts");
        } catch (Exception e) {
            log.error("Error in scheduled task: Process pending payouts", e);
        }
    }

    /**
     * Alternative: Process pending payouts every 30 minutes
     * Uncomment this and comment out the hourly one if you want more frequent processing
     */
    // @Scheduled(fixedRate = 1800000) // 30 minutes = 1800000 milliseconds
    // public void processPendingPayoutsFrequent() {
    //     log.info("Starting scheduled task: Process pending payouts (30-min interval)");
    //     
    //     try {
    //         paymentService.processPendingPayouts();
    //         log.info("Completed scheduled task: Process pending payouts (30-min interval)");
    //     } catch (Exception e) {
    //         log.error("Error in scheduled task: Process pending payouts (30-min interval)", e);
    //     }
    // }
}
