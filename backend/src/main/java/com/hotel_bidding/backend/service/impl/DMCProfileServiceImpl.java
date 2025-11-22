package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.constants.DMCProfileStatus;
import com.hotel_bidding.backend.dto.DMCProfileRequest;
import com.hotel_bidding.backend.dto.DMCProfileResponse;
import com.hotel_bidding.backend.dto.RejectionHistoryDTO;
import com.hotel_bidding.backend.entity.DMCProfile;
import com.hotel_bidding.backend.entity.RejectionHistory;
import com.hotel_bidding.backend.exception.BadRequestException;
import com.hotel_bidding.backend.exception.ResourceNotFoundException;
import com.hotel_bidding.backend.repository.DMCProfileRepository;
import com.hotel_bidding.backend.service.CloudinaryService;
import com.hotel_bidding.backend.service.DMCProfileService;
import com.hotel_bidding.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DMCProfileServiceImpl implements DMCProfileService {

    private final DMCProfileRepository dmcProfileRepository;
    private final CloudinaryService cloudinaryService;
    private final EmailService emailService;

    @Override
    @Transactional
    public DMCProfileResponse createOrUpdateProfile(
            String userId,
            DMCProfileRequest request,
            MultipartFile sltdaCertification
    ) throws IOException {

        // Check if profile already exists
        DMCProfile profile = dmcProfileRepository.findByUserId(userId).orElse(null);
        boolean isNewProfile = (profile == null);

        if (isNewProfile) {
            profile = new DMCProfile();
            profile.setUserId(userId);
            profile.setStatus(DMCProfileStatus.PENDING);
        } else {
            // If profile exists and is rejected, allow resubmission
            if (profile.getStatus() == DMCProfileStatus.REJECTED) {
                // Move current rejection to history
                if (profile.getCurrentRejectionReason() != null) {
                    RejectionHistory history = new RejectionHistory();
                    history.setReason(profile.getCurrentRejectionReason());
                    history.setRejectedAt(profile.getReviewedAt());
                    profile.getRejectionHistory().add(history);
                }
                // Reset status to pending for resubmission
                profile.setStatus(DMCProfileStatus.PENDING);
                profile.setCurrentRejectionReason(null);
            } else if (profile.getStatus() == DMCProfileStatus.APPROVED) {
                throw new BadRequestException("Profile is already approved. Contact admin for changes.");
            } else if (profile.getStatus() == DMCProfileStatus.UNDER_REVIEW) {
                throw new BadRequestException("Profile is currently under review. Please wait for admin response.");
            }
        }

        // Check if business registration number already exists (for other users)
        if (dmcProfileRepository.existsByBusinessRegistrationNumber(request.getBusinessRegistrationNumber())) {
            DMCProfile existingProfile = dmcProfileRepository
                    .findByBusinessRegistrationNumber(request.getBusinessRegistrationNumber())
                    .orElse(null);
            if (existingProfile != null && !existingProfile.getUserId().equals(userId)) {
                throw new BadRequestException("Business registration number already exists");
            }
        }

        // Update profile fields
        profile.setCompanyName(request.getCompanyName());
        profile.setAddress(request.getAddress());
        profile.setBusinessRegistrationNumber(request.getBusinessRegistrationNumber());
        profile.setContactNumber(request.getContactNumber());
        profile.setEmail(request.getEmail());
        profile.setSubmittedAt(LocalDateTime.now());

        // Handle file upload
        if (sltdaCertification != null && !sltdaCertification.isEmpty()) {
            // Delete old file if exists
            if (profile.getSltdaCertificationPublicId() != null) {
                try {
                    cloudinaryService.deleteFile(profile.getSltdaCertificationPublicId());
                } catch (Exception e) {
                    log.warn("Failed to delete old certification file: {}", e.getMessage());
                }
            }

            // Upload new file
            Map<String, String> uploadResult = cloudinaryService.uploadFile(
                    sltdaCertification,
                    "dmc_certifications"
            );

            profile.setSltdaCertificationUrl(uploadResult.get("url"));
            profile.setSltdaCertificationPublicId(uploadResult.get("publicId"));
            profile.setSltdaCertificationFileName(uploadResult.get("fileName"));
        }

        // Save profile
        DMCProfile savedProfile = dmcProfileRepository.save(profile);

        // Send email notification to admin (only for new submissions)
        if (isNewProfile) {
            emailService.sendNewDMCRegistrationNotification(
                    savedProfile.getCompanyName(),
                    savedProfile.getEmail()
            );
            log.info("New DMC profile created and admin notified: {}", savedProfile.getCompanyName());
        } else {
            log.info("DMC profile updated and resubmitted: {}", savedProfile.getCompanyName());
            // Also notify admin about resubmission
            emailService.sendNewDMCRegistrationNotification(
                    savedProfile.getCompanyName() + " (Resubmission)",
                    savedProfile.getEmail()
            );
        }

        return convertToResponse(savedProfile);
    }

    @Override
    public List<DMCProfileResponse> searchApprovedDmcsByName(String name) {
        String query = name == null ? "" : name.trim();
        List<com.hotel_bidding.backend.entity.DMCProfile> found = dmcProfileRepository
                .findByStatusAndCompanyNameContainingIgnoreCase(DMCProfileStatus.APPROVED, query);

        return found.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Override
    public DMCProfileResponse getProfileByUserId(String userId) {
        DMCProfile profile = dmcProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("DMC profile not found"));
        return convertToResponse(profile);
    }

    @Override
    public boolean isProfileApproved(String userId) {
        return dmcProfileRepository.findByUserId(userId)
                .map(profile -> profile.getStatus() == DMCProfileStatus.APPROVED)
                .orElse(false);
    }

    private DMCProfileResponse convertToResponse(DMCProfile profile) {
        DMCProfileResponse response = new DMCProfileResponse();
        response.setId(profile.getId());
        response.setUserId(profile.getUserId());
        response.setCompanyName(profile.getCompanyName());
        response.setAddress(profile.getAddress());
        response.setBusinessRegistrationNumber(profile.getBusinessRegistrationNumber());
        response.setContactNumber(profile.getContactNumber());
        response.setEmail(profile.getEmail());
        response.setSltdaCertificationUrl(profile.getSltdaCertificationUrl());
        response.setSltdaCertificationFileName(profile.getSltdaCertificationFileName());
        response.setStatus(profile.getStatus());
        response.setCurrentRejectionReason(profile.getCurrentRejectionReason());
        response.setCreatedAt(profile.getCreatedAt());
        response.setUpdatedAt(profile.getUpdatedAt());
        response.setSubmittedAt(profile.getSubmittedAt());
        response.setApprovedAt(profile.getApprovedAt());

        // Convert rejection history
        if (profile.getRejectionHistory() != null) {
            response.setRejectionHistory(
                    profile.getRejectionHistory().stream()
                            .map(history -> new RejectionHistoryDTO(
                                    history.getReason(),
                                    history.getRejectedAt(),
                                    history.getRejectedBy()
                            ))
                            .collect(Collectors.toList())
            );
        }

        return response;
    }
}
