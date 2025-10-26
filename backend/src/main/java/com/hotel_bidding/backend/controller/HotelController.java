package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.security.UserDetailsImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/hotel")
public class HotelController {

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse> getDashboard(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Map<String, Object> dashboardData = new HashMap<>();
        dashboardData.put("username", userDetails.getUsername());
        dashboardData.put("email", userDetails.getEmail());
        dashboardData.put("role", userDetails.getRole());
        dashboardData.put("message", "Welcome to Hotel Dashboard");

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Hotel Dashboard")
                .data(dashboardData)
                .build());
    }
}
