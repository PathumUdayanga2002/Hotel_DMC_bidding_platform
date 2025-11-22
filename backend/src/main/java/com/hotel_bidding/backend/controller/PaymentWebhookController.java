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
 */
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
     * PayHere will send payment status updates to this endpoint
     * 
     * Expected parameters from PayHere:
     * - merchant_id: Merchant ID
     * - order_id: Order ID (our payment ID)
     * - payhere_amount: Payment amount
     * - payhere_currency: Currency (LKR)
     * - status_code: Status (2=success, 0=pending, -1=cancelled, -2=failed, -3=chargedback)
     * - md5sig: MD5 signature for verification
     * - payment_id: PayHere payment ID
     * - method: Payment method
     * - status_message: Status message
     * - card_holder_name: Card holder name (if card payment)
     * - card_no: Masked card number (if card payment)
     */
    @PostMapping("/payhere/notify")
    public ResponseEntity<String> handlePayHereNotification(@RequestParam Map<String, String> params) {
        
        log.info("Received PayHere notification for order: {}, status: {}", 
                params.get("order_id"), params.get("status_code"));
        
        try {
            // Process the notification
            paymentService.handlePayHereNotification(params);
            
            log.info("Successfully processed PayHere notification for order: {}", params.get("order_id"));
            
            return ResponseEntity.ok("Notification processed");
            
        } catch (Exception e) {
            log.error("Error processing PayHere notification for order: {}", params.get("order_id"), e);
            
            // Return 200 even on error to prevent PayHere from retrying
            // We'll handle errors internally
            return ResponseEntity.ok("Notification received");
        }
    }

    /**
     * PayHere return URL (success)
     * GET /api/webhooks/payhere/return
     * 
     * User is redirected here after successful payment
     */
    @GetMapping("/payhere/return")
    public ResponseEntity<Map<String, String>> handlePayHereReturn(
            @RequestParam String order_id) {
        
        log.info("User returned from PayHere for order: {}", order_id);
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("orderId", order_id);
        response.put("message", "Payment initiated successfully. You will be notified once payment is confirmed.");
        response.put("redirectUrl", "/payments/" + order_id);
        
        return ResponseEntity.ok(response);
    }

    /**
     * PayHere cancel URL
     * GET /api/webhooks/payhere/cancel
     * 
     * User is redirected here if they cancel the payment
     */
    @GetMapping("/payhere/cancel")
    public ResponseEntity<Map<String, String>> handlePayHereCancel(
            @RequestParam String order_id) {
        
        log.info("User cancelled PayHere payment for order: {}", order_id);
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "cancelled");
        response.put("orderId", order_id);
        response.put("message", "Payment was cancelled.");
        response.put("redirectUrl", "/payments/" + order_id);
        
        return ResponseEntity.ok(response);
    }
}
