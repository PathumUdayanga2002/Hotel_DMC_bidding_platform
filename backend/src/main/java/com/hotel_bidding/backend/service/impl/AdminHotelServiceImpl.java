package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.constants.HotelProfileStatus;
import com.hotel_bidding.backend.constants.UserRole;
import com.hotel_bidding.backend.dto.*;
import com.hotel_bidding.backend.entity.HotelAdminNote;
import com.hotel_bidding.backend.entity.HotelProfile;
import com.hotel_bidding.backend.entity.HotelRejectionHistory;
import com.hotel_bidding.backend.entity.User;
import com.hotel_bidding.backend.exception.BadRequestException;
import com.hotel_bidding.backend.exception.ResourceNotFoundException;
import com.hotel_bidding.backend.repository.HotelRepository;
import com.hotel_bidding.backend.repository.UserRepository;
import com.hotel_bidding.backend.service.AdminHotelService;
import com.hotel_bidding.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminHotelServiceImpl implements AdminHotelService {

    private final HotelRepository hotelRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Override
    public Page<HotelProfileSummary> getAllHotelProfiles(HotelProfileStatus status, String search, Pageable pageable) {
        Page<HotelProfile> profilesPage;

        if (status != null && search != null && !search.trim().isEmpty()) {
            // Filter by status AND search
            profilesPage = hotelRepository.findByStatusAndNameContainingIgnoreCaseOrStatusAndContactEmailContainingIgnoreCase(
                    status.name(), search, status.name(), search, pageable);
        } else if (status != null) {
            // Filter by status only
            profilesPage = hotelRepository.findByStatus(status.name(), pageable);
        } else if (search != null && !search.trim().isEmpty()) {
            // Search only
            profilesPage = hotelRepository.findByNameContainingIgnoreCaseOrContactEmailContainingIgnoreCase(
                    search, search, pageable);
        } else {
            // No filters
            profilesPage = hotelRepository.findAll(pageable);
        }

        return profilesPage.map(this::convertToSummary);
    }

    @Override
    public HotelProfileResponse getHotelProfileById(String profileId) {
        HotelProfile profile = hotelRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel profile not found with ID: " + profileId));

        return convertToResponse(profile);
    }

    @Override
    @Transactional
    public HotelProfileResponse approveHotelProfile(String profileId, String adminId, String adminUsername) {
        HotelProfile profile = hotelRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel profile not found with ID: " + profileId));

        // Update status to APPROVED
        profile.setStatus(HotelProfileStatus.APPROVED.name());
        profile.setApprovedBy(adminId);
        profile.setApprovedByUsername(adminUsername);
        profile.setApprovedAt(LocalDateTime.now());
        profile.setRejectionReason(null); // Clear rejection reason

        HotelProfile saved = hotelRepository.save(profile);

        // Update user role to HOTEL_SUPER_ADMIN
        User hotelUser = userRepository.findById(profile.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + profile.getUserId()));
        hotelUser.setRole(UserRole.HOTEL_SUPER_ADMIN);
        userRepository.save(hotelUser);
        log.info("User {} role updated to HOTEL_SUPER_ADMIN", hotelUser.getId());

        // Send approval email
        emailService.sendHotelApprovalEmail(profile.getContactEmail(), profile.getName());

        log.info("Hotel profile approved: {} by admin: {}", profileId, adminUsername);

        return convertToResponse(saved);
    }

    @Override
    @Transactional
    public HotelProfileResponse rejectHotelProfile(String profileId, String reason, String adminId, String adminUsername) {
        if (reason == null || reason.trim().isEmpty()) {
            throw new BadRequestException("Rejection reason is required");
        }

        HotelProfile profile = hotelRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel profile not found with ID: " + profileId));

        // Add to rejection history
        HotelRejectionHistory history = new HotelRejectionHistory();
        history.setReason(reason);
        history.setRejectedAt(LocalDateTime.now());
        history.setRejectedBy(adminUsername);

        if (profile.getRejectionHistory() == null) {
            profile.setRejectionHistory(new ArrayList<>());
        }
        profile.getRejectionHistory().add(history);

        // Update status to REJECTED
        profile.setStatus(HotelProfileStatus.REJECTED.name());
        profile.setRejectionReason(reason);

        HotelProfile saved = hotelRepository.save(profile);

        // Send rejection email
        emailService.sendHotelRejectionEmail(profile.getContactEmail(), profile.getName(), reason);

        log.info("Hotel profile rejected: {} by admin: {}", profileId, adminUsername);

        return convertToResponse(saved);
    }

    @Override
    @Transactional
    public HotelProfileResponse updateHotelStatus(String profileId, UpdateHotelStatusRequest request,
                                                  String adminId, String adminUsername) {
        if (request.getStatus() == null) {
            throw new BadRequestException("Status is required");
        }

        // If status is REJECTED, require rejection reason
        if (request.getStatus() == HotelProfileStatus.REJECTED) {
            if (request.getRejectionReason() == null || request.getRejectionReason().trim().isEmpty()) {
                throw new BadRequestException("Rejection reason is required for REJECTED status");
            }
            return rejectHotelProfile(profileId, request.getRejectionReason(), adminId, adminUsername);
        }

        // If status is APPROVED
        if (request.getStatus() == HotelProfileStatus.APPROVED) {
            return approveHotelProfile(profileId, adminId, adminUsername);
        }

        // For other statuses (PENDING, UNDER_REVIEW, SUSPENDED)
        HotelProfile profile = hotelRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel profile not found with ID: " + profileId));

        profile.setStatus(request.getStatus().name());

        // Add optional admin note
        if (request.getAdminNote() != null && !request.getAdminNote().trim().isEmpty()) {
            HotelAdminNote note = new HotelAdminNote();
            note.setNoteId(UUID.randomUUID().toString());
            note.setAdminId(adminId);
            note.setAdminUsername(adminUsername);
            note.setContent(request.getAdminNote());
            note.setCreatedAt(LocalDateTime.now());

            if (profile.getAdminNotes() == null) {
                profile.setAdminNotes(new ArrayList<>());
            }
            profile.getAdminNotes().add(note);
        }

        HotelProfile saved = hotelRepository.save(profile);

        log.info("Hotel profile status updated: {} to {} by admin: {}", profileId, request.getStatus(), adminUsername);

        return convertToResponse(saved);
    }

    @Override
    @Transactional
    public HotelProfileResponse addAdminNote(String profileId, HotelAdminNoteRequest request,
                                             String adminId, String adminUsername) {
        HotelProfile profile = hotelRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel profile not found with ID: " + profileId));

        HotelAdminNote note = new HotelAdminNote();
        note.setNoteId(UUID.randomUUID().toString());
        note.setAdminId(adminId);
        note.setAdminUsername(adminUsername);
        note.setContent(request.getContent());
        note.setCreatedAt(LocalDateTime.now());

        if (profile.getAdminNotes() == null) {
            profile.setAdminNotes(new ArrayList<>());
        }
        profile.getAdminNotes().add(note);

        HotelProfile saved = hotelRepository.save(profile);

        log.info("Admin note added to hotel profile: {} by admin: {}", profileId, adminUsername);

        return convertToResponse(saved);
    }

    @Override
    public HotelProfileStats getStats() {
        long total = hotelRepository.count();
        long pending = hotelRepository.countByStatus(HotelProfileStatus.PENDING.name());
        long underReview = hotelRepository.countByStatus(HotelProfileStatus.UNDER_REVIEW.name());
        long approved = hotelRepository.countByStatus(HotelProfileStatus.APPROVED.name());
        long rejected = hotelRepository.countByStatus(HotelProfileStatus.REJECTED.name());
        long suspended = hotelRepository.countByStatus(HotelProfileStatus.SUSPENDED.name());

        return new HotelProfileStats(total, pending, underReview, approved, rejected, suspended);
    }

    // Helper methods for conversion
    private HotelProfileSummary convertToSummary(HotelProfile profile) {
        HotelProfileSummary summary = new HotelProfileSummary();
        summary.setId(profile.getId());
        summary.setName(profile.getName());
        summary.setContactEmail(profile.getContactEmail());
        summary.setCity(profile.getCity());
        summary.setCountry(profile.getCountry());
        summary.setStatus(profile.getStatus());
        summary.setCreatedAt(profile.getCreatedAt());
        summary.setApprovedAt(profile.getApprovedAt());
        summary.setApprovedByUsername(profile.getApprovedByUsername());
        return summary;
    }

    private HotelProfileResponse convertToResponse(HotelProfile profile) {
        HotelProfileResponse response = new HotelProfileResponse();
        response.setId(profile.getId());
        response.setUserId(profile.getUserId());
        response.setName(profile.getName());
        response.setDescription(profile.getDescription());
        response.setAddress(profile.getAddress());
        response.setCity(profile.getCity());
        response.setCountry(profile.getCountry());
        response.setContactEmail(profile.getContactEmail());
        response.setContactNumber(profile.getContactNumber());
        response.setWebsite(profile.getWebsite());
        response.setAmenities(profile.getAmenities());
        response.setGalleryImages(profile.getGalleryImages());
        response.setTotalRooms(profile.getTotalRooms());
        response.setCertifications(profile.getCertifications());
        response.setStatus(profile.getStatus());
    // Additional fields
    response.setRoomEnvironment(profile.getRoomEnvironment());
    response.setHotelStars(profile.getHotelStars());
    response.setTermsAndConditions(profile.getTermsAndConditions());
        response.setApprovedBy(profile.getApprovedBy());
        response.setApprovedByUsername(profile.getApprovedByUsername());
        response.setApprovedAt(profile.getApprovedAt());
        response.setRejectionReason(profile.getRejectionReason());
        response.setRejectionHistory(profile.getRejectionHistory());
        response.setAdminNotes(profile.getAdminNotes());
        response.setCreatedAt(profile.getCreatedAt());
        response.setUpdatedAt(profile.getUpdatedAt());
        return response;
    }
}
