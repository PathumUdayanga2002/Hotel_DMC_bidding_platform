package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.dto.AdminProfileDTO;
import com.hotel_bidding.backend.dto.ChangePasswordRequest;
import com.hotel_bidding.backend.dto.UpdateAdminProfileRequest;
import com.hotel_bidding.backend.entity.User;
import com.hotel_bidding.backend.exception.ResourceNotFoundException;
import com.hotel_bidding.backend.repository.UserRepository;
import com.hotel_bidding.backend.service.AdminProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminProfileServiceImpl implements AdminProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AdminProfileDTO getAdminProfile(String adminId) {
        log.info("Fetching admin profile for ID: {}", adminId);
        
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with ID: " + adminId));
        
        return convertToDTO(admin);
    }

    @Override
    @Transactional
    public AdminProfileDTO updateAdminProfile(String adminId, UpdateAdminProfileRequest request) {
        log.info("Updating admin profile for ID: {}", adminId);
        
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with ID: " + adminId));
        
        // Update profile fields
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            // Check if email is already taken by another user
            userRepository.findByEmail(request.getEmail()).ifPresent(existingUser -> {
                if (!existingUser.getId().equals(adminId)) {
                    throw new IllegalArgumentException("Email is already in use");
                }
            });
            admin.setEmail(request.getEmail());
        }
        
        if (request.getFirstName() != null) {
            admin.setFirstName(request.getFirstName());
        }
        
        if (request.getLastName() != null) {
            admin.setLastName(request.getLastName());
        }
        
        if (request.getPhoneNumber() != null) {
            admin.setPhoneNumber(request.getPhoneNumber());
        }
        
        if (request.getDepartment() != null) {
            admin.setDepartment(request.getDepartment());
        }
        
        if (request.getPosition() != null) {
            admin.setPosition(request.getPosition());
        }
        
        if (request.getProfileImageUrl() != null) {
            admin.setProfileImageUrl(request.getProfileImageUrl());
        }
        
        User updatedAdmin = userRepository.save(admin);
        
        log.info("Admin profile updated successfully for ID: {}", adminId);
        return convertToDTO(updatedAdmin);
    }

    @Override
    @Transactional
    public void changePassword(String adminId, ChangePasswordRequest request) {
        log.info("Changing password for admin ID: {}", adminId);
        
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with ID: " + adminId));
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), admin.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        // Verify new password matches confirm password
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirm password do not match");
        }
        
        // Update password
        admin.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(admin);
        
        log.info("Password changed successfully for admin ID: {}", adminId);
    }

    private AdminProfileDTO convertToDTO(User admin) {
        return AdminProfileDTO.builder()
                .id(admin.getId())
                .username(admin.getUsername())
                .email(admin.getEmail())
                .firstName(admin.getFirstName())
                .lastName(admin.getLastName())
                .phoneNumber(admin.getPhoneNumber())
                .department(admin.getDepartment())
                .position(admin.getPosition())
                .profileImageUrl(admin.getProfileImageUrl())
                .role(admin.getRole().name())
                .status(admin.getStatus().name())
                .createdAt(admin.getCreatedAt())
                .lastLogin(admin.getLastLogin())
                .build();
    }
}
