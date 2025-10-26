package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.constants.UserRole;
import com.hotel_bidding.backend.constants.UserStatus;
import com.hotel_bidding.backend.dto.request.LoginRequest;
import com.hotel_bidding.backend.dto.request.RegisterRequest;
import com.hotel_bidding.backend.dto.response.AuthResponse;
import com.hotel_bidding.backend.entity.User;
import com.hotel_bidding.backend.exception.BadRequestException;
import com.hotel_bidding.backend.repository.UserRepository;
import com.hotel_bidding.backend.security.JwtTokenProvider;
import com.hotel_bidding.backend.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request, UserRole role, HttpServletResponse response) {
        // Validate passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setStatus(UserStatus.APPROVED); // Auto-approve for now
        user.setEmailVerified(false);

        User savedUser = userRepository.save(user);

        // Auto-login after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate JWT token
        String token = tokenProvider.generateAccessToken(authentication);

        // Set token in HTTP-only cookie
        setAuthCookie(response, token);

        // Update last login
        savedUser.setLastLogin(LocalDateTime.now());
        userRepository.save(savedUser);

        log.info("User registered successfully: {} with role: {}", savedUser.getUsername(), role);

        return AuthResponse.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .message("Registration successful")
                .build();
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request, HttpServletResponse response) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmailOrUsername(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate JWT token
        String token = tokenProvider.generateAccessToken(authentication);

        // Set token in HTTP-only cookie
        setAuthCookie(response, token);

        // Get user details
        User user = userRepository.findByUsername(request.getEmailOrUsername())
                .or(() -> userRepository.findByEmail(request.getEmailOrUsername()))
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        log.info("User logged in successfully: {}", user.getUsername());

        return AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .message("Login successful")
                .build();
    }

    @Override
    public void logout(HttpServletResponse response) {
        // Clear authentication cookie
        Cookie cookie = new Cookie("accessToken", null);
        cookie.setMaxAge(0);
        cookie.setSecure(false); // Set to true in production with HTTPS
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);

        SecurityContextHolder.clearContext();
        log.info("User logged out successfully");
    }

    private void setAuthCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("accessToken", token);
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
        cookie.setSecure(false); // Set to true in production with HTTPS
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);
    }
}
