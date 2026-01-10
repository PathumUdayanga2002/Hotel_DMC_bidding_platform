package com.hotel_bidding.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hotel_bidding.backend.dto.request.HotelBankDetailsRequest;
import com.hotel_bidding.backend.dto.request.InitiatePaymentRequest;
import com.hotel_bidding.backend.dto.response.PayHereInitiationResponse;
import com.hotel_bidding.backend.dto.response.PaymentResponse;
import com.hotel_bidding.backend.entity.HotelBankDetails;
import com.hotel_bidding.backend.service.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Payment controller for DMC and Hotel users
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${app.frontend.url:http://localhost:5173}", allowCredentials = "true")
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * DMC initiates payment for awarded bid
     * POST /api/payments/initiate
     */
    @PostMapping("/initiate")
    @PreAuthorize("hasAnyRole('DMC_USER', 'DMC_SUPER_ADMIN', 'DMC_STAFF_ADMIN')")
    public ResponseEntity<PayHereInitiationResponse> initiatePayment(
            @Valid @RequestBody InitiatePaymentRequest request,
            Authentication authentication) {
        
        log.info("DMC user {} initiating payment for inquiry: {}, bid: {}", 
                authentication.getName(), request.getInquiryId(), request.getBidId());
        
        String dmcUserId = authentication.getName();
        PayHereInitiationResponse response = paymentService.initiatePayment(request, dmcUserId);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get payment by ID
     * GET /api/payments/{paymentId}
     */
    @GetMapping("/{paymentId}")
    @PreAuthorize("hasAnyRole('DMC_USER', 'DMC_SUPER_ADMIN', 'DMC_STAFF_ADMIN', 'HOTEL_USER', 'HOTEL_SUPER_ADMIN', 'HOTEL_STAFF_ADMIN', 'ADMIN')")
    public ResponseEntity<PaymentResponse> getPaymentById(
            @PathVariable String paymentId,
            Authentication authentication) {
        
        log.info("User {} fetching payment: {}", authentication.getName(), paymentId);
        
        PaymentResponse payment = paymentService.getPaymentById(paymentId);
        
        // Verify user has access to this payment
        String userId = authentication.getName();
        if (!payment.getDmcUserId().equals(userId) && 
            !payment.getHotelUserId().equals(userId) &&
            !authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).build();
        }
        
        return ResponseEntity.ok(payment);
    }

    /**
     * Get payment by order ID
     * GET /api/payments/order/{orderId}
     */
    @GetMapping("/order/{orderId}")
    @PreAuthorize("hasAnyRole('DMC_USER', 'DMC_SUPER_ADMIN', 'DMC_STAFF_ADMIN', 'HOTEL_USER', 'HOTEL_SUPER_ADMIN', 'HOTEL_STAFF_ADMIN', 'ADMIN')")
    public ResponseEntity<PaymentResponse> getPaymentByOrderId(
            @PathVariable String orderId,
            Authentication authentication) {
        
        log.info("User {} fetching payment by order ID: {}", authentication.getName(), orderId);
        
        PaymentResponse payment = paymentService.getPaymentByOrderId(orderId);
        
        // Verify user has access to this payment
        String userId = authentication.getName();
        if (!payment.getDmcUserId().equals(userId) && 
            !payment.getHotelUserId().equals(userId) &&
            !authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).build();
        }
        
        return ResponseEntity.ok(payment);
    }

    /**
     * Get all payments for current DMC user
     * GET /api/payments/dmc/my-payments
     */
    @GetMapping("/dmc/my-payments")
    @PreAuthorize("hasAnyRole('DMC_USER', 'DMC_SUPER_ADMIN', 'DMC_STAFF_ADMIN')")
    public ResponseEntity<Page<PaymentResponse>> getMyDmcPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        String dmcUserId = authentication.getName();
        log.info("DMC user {} fetching their payments, page: {}, size: {}", dmcUserId, page, size);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<PaymentResponse> payments = paymentService.getPaymentsByDmc(dmcUserId, pageable);
        
        return ResponseEntity.ok(payments);
    }

    /**
     * Get all payments for current hotel user
     * GET /api/payments/hotel/my-payments
     */
    @GetMapping("/hotel/my-payments")
    @PreAuthorize("hasAnyRole('HOTEL_USER', 'HOTEL_SUPER_ADMIN', 'HOTEL_STAFF_ADMIN')")
    public ResponseEntity<Page<PaymentResponse>> getMyHotelPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        String hotelUserId = authentication.getName();
        log.info("Hotel user {} fetching their payments, page: {}, size: {}", hotelUserId, page, size);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<PaymentResponse> payments = paymentService.getPaymentsByHotel(hotelUserId, pageable);
        
        return ResponseEntity.ok(payments);
    }

    /**
     * Hotel user saves/updates bank details
     * POST /api/payments/hotel/bank-details
     */
    @PostMapping("/hotel/bank-details")
    @PreAuthorize("hasAnyRole('HOTEL_USER', 'HOTEL_SUPER_ADMIN', 'HOTEL_STAFF_ADMIN')")
    public ResponseEntity<HotelBankDetails> saveHotelBankDetails(
            @Valid @RequestBody HotelBankDetailsRequest request,
            Authentication authentication) {
        
        String hotelUserId = authentication.getName();
        log.info("Hotel user {} saving bank details", hotelUserId);
        
        HotelBankDetails bankDetails = paymentService.saveHotelBankDetails(request, hotelUserId);
        
        return ResponseEntity.ok(bankDetails);
    }

    /**
     * Hotel user gets their bank details
     * GET /api/payments/hotel/bank-details
     */
    @GetMapping("/hotel/bank-details")
    @PreAuthorize("hasAnyRole('HOTEL_USER', 'HOTEL_SUPER_ADMIN', 'HOTEL_STAFF_ADMIN')")
    public ResponseEntity<HotelBankDetails> getHotelBankDetails(Authentication authentication) {
        
        String hotelUserId = authentication.getName();
        log.info("Hotel user {} fetching their bank details", hotelUserId);
        
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
}
