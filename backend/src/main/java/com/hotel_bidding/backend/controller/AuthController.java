package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.constants.UserRole;
import com.hotel_bidding.backend.dto.request.LoginRequest;
import com.hotel_bidding.backend.dto.request.RegisterRequest;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.dto.response.AuthResponse;
import com.hotel_bidding.backend.security.UserDetailsImpl;
import com.hotel_bidding.backend.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/hotel")
    public ResponseEntity<ApiResponse> registerHotel(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {
        log.info("Hotel registration request for: {}", request.getEmail());
        AuthResponse authResponse = authService.register(request, UserRole.HOTEL_USER, response);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.builder()
                        .success(true)
                        .message("Hotel user registered successfully")
                        .data(authResponse)
                        .build());
    }

    @PostMapping("/register/dmc")
    public ResponseEntity<ApiResponse> registerDMC(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {
        log.info("DMC registration request for: {}", request.getEmail());
        AuthResponse authResponse = authService.register(request, UserRole.DMC_USER, response);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.builder()
                        .success(true)
                        .message("DMC user registered successfully")
                        .data(authResponse)
                        .build());
    }

    @PostMapping("/register/admin")
    public ResponseEntity<ApiResponse> registerAdmin(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {
        log.info("Admin registration request for: {}", request.getEmail());
        AuthResponse authResponse = authService.register(request, UserRole.ADMIN, response);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.builder()
                        .success(true)
                        .message("Admin user registered successfully")
                        .data(authResponse)
                        .build());
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        log.info("Login request for: {}", request.getEmailOrUsername());
        AuthResponse authResponse = authService.login(request, response);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Login successful")
                .data(authResponse)
                .build());
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            HttpServletResponse response) {
        String userId = userDetails != null ? userDetails.getId() : null;
        authService.logout(userId, response);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Logout successful")
                .build());
    }

    @GetMapping("/check")
    public ResponseEntity<ApiResponse> checkAuth(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.builder()
                            .success(false)
                            .message("Not authenticated")
                            .build());
        }
        
        AuthResponse authResponse = new AuthResponse();
        authResponse.setId(userDetails.getId());
        authResponse.setUsername(userDetails.getUsername());
        authResponse.setEmail(userDetails.getEmail());
        authResponse.setRole(userDetails.getRole());
        authResponse.setAccountType(userDetails.getAccountType());
        authResponse.setFullName(userDetails.getFullName());
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Authenticated")
                .data(authResponse)
                .build());
    }

    /**
     * Health check endpoint for Docker and monitoring
     * GET /auth/health
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse> healthCheck() {
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Application is running")
                .build());
    }
}
