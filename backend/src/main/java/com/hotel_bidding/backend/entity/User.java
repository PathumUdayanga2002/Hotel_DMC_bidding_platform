package com.hotel_bidding.backend.entity;

import com.hotel_bidding.backend.constants.AccountType;
import com.hotel_bidding.backend.constants.UserRole;
import com.hotel_bidding.backend.constants.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Indexed(unique = true)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Indexed(unique = true)
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private UserRole role;

    private UserStatus status = UserStatus.APPROVED; // Auto-approve for now

    private Boolean emailVerified = false;
    
    // Staff Management Fields
    private AccountType accountType = AccountType.SUPER_ADMIN; // Default to SUPER_ADMIN
    
    private String parentUserId; // References the super admin user (for staff only)
    
    private Boolean isActive = true; // For staff activation/deactivation
    
    // Staff Profile Fields
    private String fullName;
    
    private String phone;
    
    private String position; // Job title (e.g., "Bid Manager")
    
    private String profilePhotoUrl;
    
    private String createdBy; // User ID who created this account
    
    private LocalDateTime lastLoginAt;
    
    private Integer actionCount = 0; // Track number of actions performed

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime lastLogin;
}
