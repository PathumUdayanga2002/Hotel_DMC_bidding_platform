package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.constants.UserRole;
import com.hotel_bidding.backend.dto.request.LoginRequest;
import com.hotel_bidding.backend.dto.request.RegisterRequest;
import com.hotel_bidding.backend.dto.response.AuthResponse;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request, UserRole role, HttpServletResponse response);
    AuthResponse login(LoginRequest request, HttpServletResponse response);
    void logout(HttpServletResponse response);
}
