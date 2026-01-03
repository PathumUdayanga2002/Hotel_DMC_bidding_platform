package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.constants.AccountType;
import com.hotel_bidding.backend.constants.ActivityType;
import com.hotel_bidding.backend.constants.UserRole;
import com.hotel_bidding.backend.constants.UserStatus;
import com.hotel_bidding.backend.dto.request.LoginRequest;
import com.hotel_bidding.backend.dto.request.PasswordResetConfirmRequest;
import com.hotel_bidding.backend.dto.request.PasswordResetRequest;
import com.hotel_bidding.backend.dto.request.RegisterRequest;
import com.hotel_bidding.backend.dto.response.AuthResponse;
import com.hotel_bidding.backend.entity.PasswordResetToken;
import com.hotel_bidding.backend.entity.User;
import com.hotel_bidding.backend.exception.BadRequestException;
import com.hotel_bidding.backend.repository.PasswordResetTokenRepository;
import com.hotel_bidding.backend.repository.UserRepository;
import com.hotel_bidding.backend.security.JwtTokenProvider;
import com.hotel_bidding.backend.service.ActivityLogService;
import com.hotel_bidding.backend.service.AuthService;
import com.hotel_bidding.backend.service.EmailService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Objects;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final ActivityLogService activityLogService;
    private final EmailService emailService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Value("${password.reset.token.expiration.minutes:30}")
    private int passwordResetTokenExpirationMinutes;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendBaseUrl;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

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
        user.setAccountType(AccountType.SUPER_ADMIN); // Default to super admin for new registrations
        user.setIsActive(true);

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
                .accountType(savedUser.getAccountType())
                .fullName(savedUser.getFullName())
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

        // Get user details
        User user = userRepository.findByUsername(request.getEmailOrUsername())
                .or(() -> userRepository.findByEmail(request.getEmailOrUsername()))
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        // Check if staff account is active
        if (user.getAccountType() == AccountType.STAFF && !user.getIsActive()) {
            throw new BadRequestException("Your account has been deactivated. Please contact your administrator.");
        }

        // Generate JWT token
        String token = tokenProvider.generateAccessToken(authentication);

        // Set token in HTTP-only cookie
        setAuthCookie(response, token);

        // Update last login
        user.setLastLogin(LocalDateTime.now());
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // Log login activity
        String companyName = user.getFullName() != null ? user.getFullName() : user.getUsername();
        activityLogService.logActivity(
                ActivityType.LOGIN,
                user.getId(),
                user.getFullName(),
                companyName,
                user.getId(),
                null,
                null,
                "User logged in successfully",
                null,
                null
        );

        log.info("User logged in successfully: {}", user.getUsername());

        return AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .accountType(user.getAccountType())
                .fullName(user.getFullName())
                .message("Login successful")
                .build();
    }

    @Override
    public void logout(String userId, HttpServletResponse response) {
        // Get user for activity logging
        User user = userRepository.findById(userId).orElse(null);
        
        // Clear authentication cookie
        Cookie cookie = new Cookie("accessToken", null);
        cookie.setMaxAge(0);
        cookie.setSecure(false); // Set to true in production with HTTPS
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);

        SecurityContextHolder.clearContext();
        
        // Log logout activity
        if (user != null) {
            String companyName = user.getFullName() != null ? user.getFullName() : user.getUsername();
            activityLogService.logActivity(
                    ActivityType.LOGOUT,
                    user.getId(),
                    user.getFullName(),
                    companyName,
                    user.getId(),
                    null,
                    null,
                    "User logged out successfully",
                    null,
                    null
            );
        }
        
        log.info("User logged out successfully");
    }

    @Override
    @Transactional
    public void requestPasswordReset(PasswordResetRequest request) {
        String email = request.getEmail().trim();

        userRepository.findByEmail(email).ifPresentOrElse(user -> {
            passwordResetTokenRepository.deleteByUserId(user.getId());

            String rawToken = generateResetToken();
            String tokenHash = hashToken(rawToken);
            LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(passwordResetTokenExpirationMinutes);

            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .userId(user.getId())
                    .tokenHash(tokenHash)
                    .expiresAt(expiresAt)
                    .used(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            passwordResetTokenRepository.save(resetToken);

            String resetLink = buildResetLink(rawToken);
            String recipientName = user.getFullName() != null ? user.getFullName() : user.getUsername();
            emailService.sendPasswordResetEmail(user.getEmail(), recipientName, resetLink);

            log.info("Password reset token created for user: {}", user.getUsername());
        }, () -> log.warn("Password reset requested for non-existing email: {}", email));
    }

    @Override
    @Transactional
    public void resetPassword(PasswordResetConfirmRequest request) {
        if (!Objects.equals(request.getNewPassword(), request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        validatePasswordStrength(request.getNewPassword());

        String tokenHash = hashToken(request.getToken());
        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));

        if (resetToken.isUsed()) {
            throw new BadRequestException("Reset token has already been used");
        }

        if (resetToken.getExpiresAt() != null && resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            passwordResetTokenRepository.deleteById(resetToken.getId());
            throw new BadRequestException("Reset token has expired");
        }

        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(() -> new BadRequestException("Invalid reset token"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        resetToken.setUsedAt(LocalDateTime.now());
        passwordResetTokenRepository.save(resetToken);
        passwordResetTokenRepository.deleteByUserId(user.getId());

        log.info("Password reset completed for user: {}", user.getUsername());
    }

    private void setAuthCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("accessToken", token);
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
        cookie.setSecure(false); // Set to true in production with HTTPS
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

    private void validatePasswordStrength(String password) {
        if (password == null || password.length() < 8) {
            throw new BadRequestException("Password must be at least 8 characters long");
        }
    }

    private String generateResetToken() {
        byte[] randomBytes = new byte[32];
        SECURE_RANDOM.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashed);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Failed to hash reset token", e);
        }
    }

    private String buildResetLink(String rawToken) {
        String sanitizedBaseUrl = frontendBaseUrl != null && frontendBaseUrl.endsWith("/")
                ? frontendBaseUrl.substring(0, frontendBaseUrl.length() - 1)
                : frontendBaseUrl;
        return sanitizedBaseUrl + "/reset-password?token=" + rawToken;
    }
}
