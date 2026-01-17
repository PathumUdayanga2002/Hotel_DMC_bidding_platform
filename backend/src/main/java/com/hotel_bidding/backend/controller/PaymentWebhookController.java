package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * PayHere webhook controller for payment notifications
 * 
 * @deprecated This controller is for the OLD bid payment system.
 * The subscription system uses different webhook endpoints in SubscriptionController.
 */
@Deprecated
@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*") // Allow PayHere to send webhooks
public class PaymentWebhookController {

    private final PaymentService paymentService;

    /**
     * PayHere payment notification endpoint
     * POST /api/webhooks/payhere/notify
     * 
     * @deprecated This webhook is for the OLD bid payment system.
     * Returns 410 Gone to indicate the endpoint is deprecated.
     */
    @Deprecated
    @PostMapping("/payhere/notify")
    public ResponseEntity<String> handlePayHereNotification(@RequestParam Map<String, String> params) {
        
        log.warn("DEPRECATED: PayHere notification received for OLD bid payment system. Order: {}", 
                params.get("order_id"));
        
        return ResponseEntity.status(410).body("Bid payment system deprecated. Use subscription system.");
    }

    /**
     * PayHere return URL (success)
     * GET /api/webhooks/payhere/return
     * 
     * @deprecated This is for the OLD bid payment system.
     */
    @Deprecated
    @GetMapping("/payhere/return")
    public ResponseEntity<Map<String, String>> handlePayHereReturn(
            @RequestParam String order_id) {
        
        log.warn("DEPRECATED: User returned from PayHere for old system. Order: {}", order_id);
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "deprecated");
        response.put("message", "Bid payment system has been deprecated. Use subscription system.");
        
        return ResponseEntity.status(410).body(response);
    }

    /**
     * PayHere cancel URL
     * GET /api/webhooks/payhere/cancel
     * 
     * @deprecated This is for the OLD bid payment system.
     */
    @Deprecated
    @GetMapping("/payhere/cancel")
    public ResponseEntity<Map<String, String>> handlePayHereCancel(
            @RequestParam String order_id) {
        
        log.warn("DEPRECATED: User cancelled PayHere payment for old system. Order: {}", order_id);
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "deprecated");
        response.put("message", "Bid payment system has been deprecated.");
        
        return ResponseEntity.status(410).body(response);
    }
}
