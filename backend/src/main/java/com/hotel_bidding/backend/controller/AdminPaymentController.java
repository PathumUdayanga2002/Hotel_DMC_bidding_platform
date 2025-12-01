package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.dto.request.ApprovePayoutRequest;
import com.hotel_bidding.backend.dto.response.PaymentResponse;
import com.hotel_bidding.backend.dto.response.PlatformBalanceResponse;
import com.hotel_bidding.backend.entity.HotelBankDetails;
import com.hotel_bidding.backend.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Admin payment management controller
 */
@RestController
@RequestMapping("/api/admin/payments")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${app.frontend.url:http://localhost:5173}", allowCredentials = "true")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPaymentController {

    private final PaymentService paymentService;

    /**
     * Get all payments (admin view)
     * GET /api/admin/payments
     */
    @GetMapping
    public ResponseEntity<Page<PaymentResponse>> getAllPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        log.info("Admin fetching all payments, page: {}, size: {}", page, size);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<PaymentResponse> payments = paymentService.getAllPayments(pageable);
        
        return ResponseEntity.ok(payments);
    }

    /**
     * Get payments by status
     * GET /api/admin/payments/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<Page<PaymentResponse>> getPaymentsByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        log.info("Admin fetching payments by status: {}, page: {}, size: {}", status, page, size);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<PaymentResponse> payments = paymentService.getPaymentsByStatus(status, pageable);
        
        return ResponseEntity.ok(payments);
    }

    /**
     * Get payments for specific DMC user
     * GET /api/admin/payments/dmc/{dmcUserId}
     */
    @GetMapping("/dmc/{dmcUserId}")
    public ResponseEntity<Page<PaymentResponse>> getPaymentsByDmc(
            @PathVariable String dmcUserId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        log.info("Admin fetching payments for DMC user: {}, page: {}, size: {}", dmcUserId, page, size);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<PaymentResponse> payments = paymentService.getPaymentsByDmc(dmcUserId, pageable);
        
        return ResponseEntity.ok(payments);
    }

    /**
     * Get payments for specific hotel user
     * GET /api/admin/payments/hotel/{hotelUserId}
     */
    @GetMapping("/hotel/{hotelUserId}")
    public ResponseEntity<Page<PaymentResponse>> getPaymentsByHotel(
            @PathVariable String hotelUserId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        log.info("Admin fetching payments for hotel user: {}, page: {}, size: {}", hotelUserId, page, size);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<PaymentResponse> payments = paymentService.getPaymentsByHotel(hotelUserId, pageable);
        
        return ResponseEntity.ok(payments);
    }

    /**
     * Approve payout to hotel
     * POST /api/admin/payments/approve-payout
     */
    @PostMapping("/approve-payout")
    public ResponseEntity<PaymentResponse> approvePayoutAndInitiate(
            @Valid @RequestBody ApprovePayoutRequest request,
            Authentication authentication) {
        
        String adminUserId = authentication.getName();
        log.info("Admin {} approving payout for payment: {}", adminUserId, request.getPaymentId());
        
        PaymentResponse payment = paymentService.approvePayoutAndInitiate(request, adminUserId);
        
        return ResponseEntity.ok(payment);
    }

    /**
     * Manually trigger payout processing (for pending approved payouts)
     * POST /api/admin/payments/process-payouts
     */
    @PostMapping("/process-payouts")
    public ResponseEntity<String> processPendingPayouts() {
        
        log.info("Admin triggering manual payout processing");
        
        paymentService.processPendingPayouts();
        
        return ResponseEntity.ok("Payout processing initiated");
    }

    /**
     * Get platform balance and statistics
     * GET /api/admin/payments/platform-balance
     */
    @GetMapping("/platform-balance")
    public ResponseEntity<PlatformBalanceResponse> getPlatformBalance() {
        
        log.info("Admin fetching platform balance");
        
        PlatformBalanceResponse balance = paymentService.getPlatformBalance();
        
        return ResponseEntity.ok(balance);
    }

    /**
     * Get hotel bank details (admin view)
     * GET /api/admin/payments/hotel/{hotelUserId}/bank-details
     */
    @GetMapping("/hotel/{hotelUserId}/bank-details")
    public ResponseEntity<HotelBankDetails> getHotelBankDetails(@PathVariable String hotelUserId) {
        
        log.info("Admin fetching bank details for hotel user: {}", hotelUserId);
        
        try {
            HotelBankDetails bankDetails = paymentService.getHotelBankDetails(hotelUserId);
            return ResponseEntity.ok(bankDetails);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            throw e;
        }
    }

    /**
     * Verify hotel bank details
     * POST /api/admin/payments/hotel/{hotelUserId}/verify-bank-details
     */
    @PostMapping("/hotel/{hotelUserId}/verify-bank-details")
    public ResponseEntity<HotelBankDetails> verifyHotelBankDetails(
            @PathVariable String hotelUserId,
            Authentication authentication) {
        
        String adminUserId = authentication.getName();
        log.info("Admin {} verifying bank details for hotel user: {}", adminUserId, hotelUserId);
        
        HotelBankDetails bankDetails = paymentService.verifyHotelBankDetails(hotelUserId, adminUserId);
        
        return ResponseEntity.ok(bankDetails);
    }

    /**
     * Manually trigger expired payment cancellation
     * POST /api/admin/payments/cancel-expired
     */
    @PostMapping("/cancel-expired")
    public ResponseEntity<String> cancelExpiredPayments() {
        
        log.info("Admin triggering manual expired payment cancellation");
        
        paymentService.cancelExpiredPayments();
        
        return ResponseEntity.ok("Expired payment cancellation initiated");
    }
}
