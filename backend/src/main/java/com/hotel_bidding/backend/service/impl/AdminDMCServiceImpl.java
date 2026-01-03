package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.constants.DMCProfileStatus;
import com.hotel_bidding.backend.constants.UserRole;
import com.hotel_bidding.backend.dto.*;
import com.hotel_bidding.backend.entity.AdminNote;
import com.hotel_bidding.backend.entity.DMCProfile;
import com.hotel_bidding.backend.entity.RejectionHistory;
import com.hotel_bidding.backend.entity.User;
import com.hotel_bidding.backend.exception.BadRequestException;
import com.hotel_bidding.backend.exception.ResourceNotFoundException;
import com.hotel_bidding.backend.repository.DMCProfileRepository;
import com.hotel_bidding.backend.repository.UserRepository;
import com.hotel_bidding.backend.service.AdminDMCService;
import com.hotel_bidding.backend.service.EmailService;
import com.hotel_bidding.backend.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminDMCServiceImpl implements AdminDMCService {

    private final DMCProfileRepository dmcProfileRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final SubscriptionService subscriptionService;

    @Override
    public Page<DMCProfileSummary> getAllDMCProfiles(DMCProfileStatus status, String search, Pageable pageable) {
        Page<DMCProfile> profiles;

        if (status != null && search != null && !search.trim().isEmpty()) {
            // Filter by status and search
            profiles = dmcProfileRepository.findByStatusAndCompanyNameContainingIgnoreCaseOrStatusAndEmailContainingIgnoreCase(
                    status, search, status, search, pageable
            );
        } else if (status != null) {
            // Filter by status only
            profiles = dmcProfileRepository.findByStatus(status, pageable);
        } else if (search != null && !search.trim().isEmpty()) {
            // Search only
            profiles = dmcProfileRepository.findByCompanyNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                    search, search, pageable
            );
        } else {
            // Get all
            profiles = dmcProfileRepository.findAll(pageable);
        }

        return profiles.map(this::convertToSummary);
    }

    @Override
    public DMCProfileResponse getDMCProfileById(String profileId) {
        DMCProfile profile = dmcProfileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("DMC profile not found"));
        return convertToResponse(profile);
    }

    @Override
    @Transactional
    public DMCProfileResponse approveDMCProfile(String profileId, String adminId, String adminUsername) {
        DMCProfile profile = dmcProfileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("DMC profile not found"));

        profile.setStatus(DMCProfileStatus.APPROVED);
        profile.setApprovedBy(adminId);
        profile.setApprovedByUsername(adminUsername);
        profile.setApprovedAt(LocalDateTime.now());
        profile.setReviewedAt(LocalDateTime.now());
        profile.setCurrentRejectionReason(null); // Clear rejection reason

        DMCProfile savedProfile = dmcProfileRepository.save(profile);

        // Update user role to DMC_SUPER_ADMIN
        User dmcUser = userRepository.findById(profile.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + profile.getUserId()));
        dmcUser.setRole(UserRole.DMC_SUPER_ADMIN);
        userRepository.save(dmcUser);
        log.info("User {} role updated to DMC_SUPER_ADMIN", dmcUser.getId());

        // Create 30-day free trial subscription
        try {
            subscriptionService.createTrialSubscription(profile.getUserId());
            log.info("30-day trial subscription created for user: {}", profile.getUserId());
        } catch (Exception e) {
            log.error("Failed to create trial subscription for user: {}", profile.getUserId(), e);
            // Continue with approval even if subscription creation fails
        }

        // Send approval email
        emailService.sendDMCApprovalEmail(profile.getEmail(), profile.getCompanyName());

        log.info("DMC profile approved: {} by admin: {}", profile.getCompanyName(), adminUsername);

        return convertToResponse(savedProfile);
    }

    @Override
    @Transactional
    public DMCProfileResponse rejectDMCProfile(String profileId, String reason, String adminId, String adminUsername) {
        if (reason == null || reason.trim().isEmpty()) {
            throw new BadRequestException("Rejection reason is required");
        }

        DMCProfile profile = dmcProfileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("DMC profile not found"));

        // Add to rejection history
        RejectionHistory history = new RejectionHistory();
        history.setReason(reason);
        history.setRejectedAt(LocalDateTime.now());
        history.setRejectedBy(adminId);
        profile.getRejectionHistory().add(history);

        profile.setStatus(DMCProfileStatus.REJECTED);
        profile.setCurrentRejectionReason(reason);
        profile.setReviewedAt(LocalDateTime.now());
        profile.setApprovedBy(null);
        profile.setApprovedByUsername(null);
        profile.setApprovedAt(null);

        DMCProfile savedProfile = dmcProfileRepository.save(profile);

        // Send rejection email
        emailService.sendDMCRejectionEmail(profile.getEmail(), profile.getCompanyName(), reason);

        log.info("DMC profile rejected: {} by admin: {} - Reason: {}", 
                profile.getCompanyName(), adminUsername, reason);

        return convertToResponse(savedProfile);
    }

    @Override
    @Transactional
    public DMCProfileResponse updateDMCStatus(String profileId, UpdateDMCStatusRequest request, 
                                               String adminId, String adminUsername) {
        DMCProfile profile = dmcProfileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("DMC profile not found"));

        DMCProfileStatus newStatus = request.getStatus();

        // Handle status-specific logic
        switch (newStatus) {
            case APPROVED:
                return approveDMCProfile(profileId, adminId, adminUsername);
            
            case REJECTED:
                if (request.getRejectionReason() == null || request.getRejectionReason().trim().isEmpty()) {
                    throw new BadRequestException("Rejection reason is required");
                }
                return rejectDMCProfile(profileId, request.getRejectionReason(), adminId, adminUsername);
            
            case UNDER_REVIEW:
                profile.setStatus(DMCProfileStatus.UNDER_REVIEW);
                profile.setReviewedAt(LocalDateTime.now());
                break;
            
            case SUSPENDED:
                profile.setStatus(DMCProfileStatus.SUSPENDED);
                profile.setReviewedAt(LocalDateTime.now());
                break;
            
            case PENDING:
                profile.setStatus(DMCProfileStatus.PENDING);
                break;
            
            default:
                throw new BadRequestException("Invalid status");
        }

        // Add admin note if provided
        if (request.getAdminNote() != null && !request.getAdminNote().trim().isEmpty()) {
            AdminNote note = new AdminNote();
            note.setNoteId(UUID.randomUUID().toString());
            note.setAdminId(adminId);
            note.setAdminUsername(adminUsername);
            note.setContent(request.getAdminNote());
            note.setCreatedAt(LocalDateTime.now());
            profile.getAdminNotes().add(note);
        }

        DMCProfile savedProfile = dmcProfileRepository.save(profile);

        log.info("DMC profile status updated: {} to {} by admin: {}", 
                profile.getCompanyName(), newStatus, adminUsername);

        return convertToResponse(savedProfile);
    }

    @Override
    @Transactional
    public DMCProfileResponse addAdminNote(String profileId, AdminNoteRequest request, 
                                           String adminId, String adminUsername) {
        DMCProfile profile = dmcProfileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("DMC profile not found"));

        AdminNote note = new AdminNote();
        note.setNoteId(UUID.randomUUID().toString());
        note.setAdminId(adminId);
        note.setAdminUsername(adminUsername);
        note.setContent(request.getContent());
        note.setCreatedAt(LocalDateTime.now());

        profile.getAdminNotes().add(note);

        DMCProfile savedProfile = dmcProfileRepository.save(profile);

        log.info("Admin note added to DMC profile: {} by admin: {}", 
                profile.getCompanyName(), adminUsername);

        return convertToResponse(savedProfile);
    }

    @Override
    public DMCProfileStats getStats() {
        DMCProfileStats stats = new DMCProfileStats();
        stats.setTotal(dmcProfileRepository.count());
        stats.setPending(dmcProfileRepository.countByStatus(DMCProfileStatus.PENDING));
        stats.setUnderReview(dmcProfileRepository.countByStatus(DMCProfileStatus.UNDER_REVIEW));
        stats.setApproved(dmcProfileRepository.countByStatus(DMCProfileStatus.APPROVED));
        stats.setRejected(dmcProfileRepository.countByStatus(DMCProfileStatus.REJECTED));
        stats.setSuspended(dmcProfileRepository.countByStatus(DMCProfileStatus.SUSPENDED));
        return stats;
    }

    private DMCProfileSummary convertToSummary(DMCProfile profile) {
        DMCProfileSummary summary = new DMCProfileSummary();
        summary.setId(profile.getId());
        summary.setCompanyName(profile.getCompanyName());
        summary.setEmail(profile.getEmail());
        summary.setBusinessRegistrationNumber(profile.getBusinessRegistrationNumber());
        summary.setStatus(profile.getStatus());
        summary.setSubmittedAt(profile.getSubmittedAt());
        summary.setApprovedAt(profile.getApprovedAt());
        summary.setApprovedByUsername(profile.getApprovedByUsername());
        return summary;
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
        response.setApprovedBy(profile.getApprovedBy());
        response.setApprovedByUsername(profile.getApprovedByUsername());
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

        // Convert admin notes
        if (profile.getAdminNotes() != null) {
            response.setAdminNotes(
                    profile.getAdminNotes().stream()
                            .map(note -> new AdminNoteDTO(
                                    note.getNoteId(),
                                    note.getAdminId(),
                                    note.getAdminUsername(),
                                    note.getContent(),
                                    note.getCreatedAt()
                            ))
                            .collect(Collectors.toList())
            );
        }

        return response;
    }
}
