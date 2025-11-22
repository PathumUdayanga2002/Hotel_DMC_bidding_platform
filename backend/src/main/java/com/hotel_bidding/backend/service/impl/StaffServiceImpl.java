package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.constants.AccountType;
import com.hotel_bidding.backend.constants.ActivityType;
import com.hotel_bidding.backend.constants.UserRole;
import com.hotel_bidding.backend.dto.request.CreateStaffRequest;
import com.hotel_bidding.backend.dto.request.UpdateStaffRequest;
import com.hotel_bidding.backend.dto.response.CreateStaffResponse;
import com.hotel_bidding.backend.dto.response.StaffResponse;
import com.hotel_bidding.backend.entity.User;
import com.hotel_bidding.backend.repository.UserRepository;
import com.hotel_bidding.backend.service.ActivityLogService;
import com.hotel_bidding.backend.service.StaffService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of StaffService
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class StaffServiceImpl implements StaffService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivityLogService activityLogService;
    
    private static final String CHAR_LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    private static final String CHAR_UPPERCASE = CHAR_LOWERCASE.toUpperCase();
    private static final String DIGIT = "0123456789";
    private static final String SPECIAL_CHAR = "!@#$%&*";
    private static final String PASSWORD_ALLOW = CHAR_LOWERCASE + CHAR_UPPERCASE + DIGIT + SPECIAL_CHAR;
    private static final SecureRandom random = new SecureRandom();
    
    @Override
    @Transactional
    public CreateStaffResponse createStaff(CreateStaffRequest request, String superAdminId) {
        log.info("Creating staff member for super admin: {}", superAdminId);
        
        // Get super admin details
        User superAdmin = userRepository.findById(superAdminId)
                .orElseThrow(() -> new RuntimeException("Super admin not found"));
        
        // Verify user is super admin
        if (superAdmin.getAccountType() != AccountType.SUPER_ADMIN) {
            throw new RuntimeException("Only super admins can create staff members");
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Generate username from email
        String username = generateUsername(request.getEmail());
        
        // Generate random password
        String generatedPassword = generateRandomPassword(12);
        
        // Create staff user
        User staff = new User();
        staff.setUsername(username);
        staff.setEmail(request.getEmail());
        staff.setPassword(passwordEncoder.encode(generatedPassword));
        staff.setRole(superAdmin.getRole()); // Same role as super admin (HOTEL_USER or DMC_USER)
        staff.setAccountType(AccountType.STAFF);
        staff.setParentUserId(superAdminId);
        staff.setCreatedBy(superAdminId);
        staff.setFullName(request.getFullName());
        staff.setPhone(request.getPhone());
        staff.setPosition(request.getPosition());
        staff.setProfilePhotoUrl(request.getProfilePhotoUrl());
        staff.setIsActive(true);
        staff.setActionCount(0);
        staff.setEmailVerified(true);
        staff.setCreatedAt(LocalDateTime.now());
        staff.setUpdatedAt(LocalDateTime.now());
        
        User savedStaff = userRepository.save(staff);
        log.info("Staff member created: {} for super admin: {}", savedStaff.getId(), superAdminId);
        
        // Log activity
        try {
            HttpServletRequest httpRequest = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
            activityLogService.logActivity(
                    ActivityType.STAFF_CREATED,
                    superAdminId,
                    superAdmin.getFullName() != null ? superAdmin.getFullName() : superAdmin.getUsername(),
                    getCompanyName(superAdmin),
                    superAdminId,
                    savedStaff.getId(),
                    "STAFF",
                    String.format("Created staff member: %s (%s)", savedStaff.getFullName(), savedStaff.getPosition()),
                    null,
                    httpRequest
            );
        } catch (Exception e) {
            log.warn("Could not log activity: {}", e.getMessage());
        }
        
        StaffResponse staffResponse = mapToResponse(savedStaff);
        
        return CreateStaffResponse.builder()
                .staff(staffResponse)
                .generatedPassword(generatedPassword)
                .message("Staff member created successfully. Please share the credentials securely.")
                .build();
    }
    
    @Override
    public List<StaffResponse> getAllStaff(String superAdminId) {
        log.info("Getting all staff for super admin: {}", superAdminId);
        
        List<User> staffList = userRepository.findByParentUserId(superAdminId);
        
        return staffList.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public StaffResponse getStaffById(String staffId, String superAdminId) {
        log.info("Getting staff by ID: {} for super admin: {}", staffId, superAdminId);
        
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff member not found"));
        
        // Verify staff belongs to this super admin
        if (!staff.getParentUserId().equals(superAdminId)) {
            throw new RuntimeException("Unauthorized access to staff member");
        }
        
        return mapToResponse(staff);
    }
    
    @Override
    @Transactional
    public StaffResponse updateStaff(String staffId, UpdateStaffRequest request, String superAdminId) {
        log.info("Updating staff: {} by super admin: {}", staffId, superAdminId);
        
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff member not found"));
        
        // Verify staff belongs to this super admin
        if (!staff.getParentUserId().equals(superAdminId)) {
            throw new RuntimeException("Unauthorized access to staff member");
        }
        
        // Update fields if provided
        if (request.getFullName() != null) {
            staff.setFullName(request.getFullName());
        }
        if (request.getEmail() != null && !request.getEmail().equals(staff.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            staff.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            staff.setPhone(request.getPhone());
        }
        if (request.getPosition() != null) {
            staff.setPosition(request.getPosition());
        }
        if (request.getProfilePhotoUrl() != null) {
            staff.setProfilePhotoUrl(request.getProfilePhotoUrl());
        }
        
        staff.setUpdatedAt(LocalDateTime.now());
        User updatedStaff = userRepository.save(staff);
        
        // Log activity
        User superAdmin = userRepository.findById(superAdminId).orElse(null);
        if (superAdmin != null) {
            try {
                HttpServletRequest httpRequest = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
                activityLogService.logActivity(
                        ActivityType.STAFF_UPDATED,
                        superAdminId,
                        superAdmin.getFullName() != null ? superAdmin.getFullName() : superAdmin.getUsername(),
                        getCompanyName(superAdmin),
                        superAdminId,
                        staffId,
                        "STAFF",
                        String.format("Updated staff member: %s", updatedStaff.getFullName()),
                        null,
                        httpRequest
                );
            } catch (Exception e) {
                log.warn("Could not log activity: {}", e.getMessage());
            }
        }
        
        log.info("Staff updated: {}", staffId);
        return mapToResponse(updatedStaff);
    }
    
    @Override
    @Transactional
    public StaffResponse toggleStaffStatus(String staffId, String superAdminId) {
        log.info("Toggling staff status: {} by super admin: {}", staffId, superAdminId);
        
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff member not found"));
        
        // Verify staff belongs to this super admin
        if (!staff.getParentUserId().equals(superAdminId)) {
            throw new RuntimeException("Unauthorized access to staff member");
        }
        
        boolean newStatus = !staff.getIsActive();
        staff.setIsActive(newStatus);
        staff.setUpdatedAt(LocalDateTime.now());
        
        User updatedStaff = userRepository.save(staff);
        
        // Log activity
        User superAdmin = userRepository.findById(superAdminId).orElse(null);
        if (superAdmin != null) {
            try {
                HttpServletRequest httpRequest = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
                activityLogService.logActivity(
                        newStatus ? ActivityType.STAFF_ACTIVATED : ActivityType.STAFF_DEACTIVATED,
                        superAdminId,
                        superAdmin.getFullName() != null ? superAdmin.getFullName() : superAdmin.getUsername(),
                        getCompanyName(superAdmin),
                        superAdminId,
                        staffId,
                        "STAFF",
                        String.format("%s staff member: %s", newStatus ? "Activated" : "Deactivated", updatedStaff.getFullName()),
                        null,
                        httpRequest
                );
            } catch (Exception e) {
                log.warn("Could not log activity: {}", e.getMessage());
            }
        }
        
        log.info("Staff status toggled: {} - Active: {}", staffId, newStatus);
        return mapToResponse(updatedStaff);
    }
    
    @Override
    @Transactional
    public void deleteStaff(String staffId, String superAdminId) {
        log.info("Deleting staff: {} by super admin: {}", staffId, superAdminId);
        
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff member not found"));
        
        // Verify staff belongs to this super admin
        if (!staff.getParentUserId().equals(superAdminId)) {
            throw new RuntimeException("Unauthorized access to staff member");
        }
        
        String staffName = staff.getFullName();
        userRepository.delete(staff);
        
        // Log activity
        User superAdmin = userRepository.findById(superAdminId).orElse(null);
        if (superAdmin != null) {
            try {
                HttpServletRequest httpRequest = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
                activityLogService.logActivity(
                        ActivityType.STAFF_UPDATED,
                        superAdminId,
                        superAdmin.getFullName() != null ? superAdmin.getFullName() : superAdmin.getUsername(),
                        getCompanyName(superAdmin),
                        superAdminId,
                        staffId,
                        "STAFF",
                        String.format("Deleted staff member: %s", staffName),
                        null,
                        httpRequest
                );
            } catch (Exception e) {
                log.warn("Could not log activity: {}", e.getMessage());
            }
        }
        
        log.info("Staff deleted: {}", staffId);
    }
    
    @Override
    @Transactional
    public String resetStaffPassword(String staffId, String superAdminId) {
        log.info("Resetting password for staff: {} by super admin: {}", staffId, superAdminId);
        
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff member not found"));
        
        // Verify staff belongs to this super admin
        if (!staff.getParentUserId().equals(superAdminId)) {
            throw new RuntimeException("Unauthorized access to staff member");
        }
        
        // Generate new random password
        String newPassword = generateRandomPassword(12);
        staff.setPassword(passwordEncoder.encode(newPassword));
        staff.setUpdatedAt(LocalDateTime.now());
        
        userRepository.save(staff);
        
        log.info("Password reset for staff: {}", staffId);
        return newPassword;
    }
    
    @Override
    public Long getStaffCount(String superAdminId) {
        return userRepository.countByParentUserId(superAdminId);
    }
    
    private StaffResponse mapToResponse(User user) {
        return StaffResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .position(user.getPosition())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .role(user.getRole())
                .accountType(user.getAccountType())
                .isActive(user.getIsActive())
                .parentUserId(user.getParentUserId())
                .createdBy(user.getCreatedBy())
                .actionCount(user.getActionCount())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
    
    private String generateUsername(String email) {
        String baseUsername = email.split("@")[0].toLowerCase().replaceAll("[^a-z0-9]", "");
        String username = baseUsername;
        int counter = 1;
        
        while (userRepository.existsByUsername(username)) {
            username = baseUsername + counter;
            counter++;
        }
        
        return username;
    }
    
    private String generateRandomPassword(int length) {
        if (length < 8) {
            length = 8;
        }
        
        StringBuilder password = new StringBuilder(length);
        
        // Ensure at least one character from each category
        password.append(CHAR_LOWERCASE.charAt(random.nextInt(CHAR_LOWERCASE.length())));
        password.append(CHAR_UPPERCASE.charAt(random.nextInt(CHAR_UPPERCASE.length())));
        password.append(DIGIT.charAt(random.nextInt(DIGIT.length())));
        password.append(SPECIAL_CHAR.charAt(random.nextInt(SPECIAL_CHAR.length())));
        
        // Fill the rest randomly
        for (int i = 4; i < length; i++) {
            password.append(PASSWORD_ALLOW.charAt(random.nextInt(PASSWORD_ALLOW.length())));
        }
        
        // Shuffle the password
        return shuffleString(password.toString());
    }
    
    private String shuffleString(String input) {
        char[] characters = input.toCharArray();
        for (int i = characters.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char temp = characters[i];
            characters[i] = characters[j];
            characters[j] = temp;
        }
        return new String(characters);
    }
    
    private String getCompanyName(User user) {
        // This will be enhanced later when we have company profiles
        // For now, return username or full name
        return user.getFullName() != null ? user.getFullName() : user.getUsername();
    }
}
