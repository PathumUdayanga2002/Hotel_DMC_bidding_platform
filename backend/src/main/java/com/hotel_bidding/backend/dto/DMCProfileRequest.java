package com.hotel_bidding.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DMCProfileRequest {

    @NotBlank(message = "Company name is required")
    @Size(min = 2, max = 200, message = "Company name must be between 2 and 200 characters")
    @Pattern(regexp = "^[a-zA-Z0-9\\s.,&()'-]+$", message = "Company name contains invalid characters")
    private String companyName;

    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address must not exceed 500 characters")
    @Pattern(regexp = "^[a-zA-Z0-9\\s.,/#()-]+$", message = "Address contains invalid characters")
    private String address;

    @NotBlank(message = "Business registration number is required")
    @Size(max = 100, message = "Business registration number must not exceed 100 characters")
    @Pattern(regexp = "^[a-zA-Z0-9/-]+$", message = "Business registration number contains invalid characters")
    private String businessRegistrationNumber;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Contact number must be valid (10-15 digits)")
    private String contactNumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
}
