package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.constants.DMCProfileStatus;
import com.hotel_bidding.backend.dto.ApprovalActionRequest;
import com.hotel_bidding.backend.dto.PendingApprovalDTO;
import com.hotel_bidding.backend.dto.UserManagementStatsDTO;
import com.hotel_bidding.backend.entity.DMCProfile;
import com.hotel_bidding.backend.entity.HotelProfile;
import com.hotel_bidding.backend.exception.ResourceNotFoundException;
import com.hotel_bidding.backend.repository.DMCProfileRepository;
import com.hotel_bidding.backend.repository.HotelRepository;
import com.hotel_bidding.backend.service.AdminDMCService;
import com.hotel_bidding.backend.service.AdminHotelService;
import com.hotel_bidding.backend.service.UserManagementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserManagementServiceImpl implements UserManagementService {

    private final HotelRepository hotelRepository;
    private final DMCProfileRepository dmcProfileRepository;
    private final AdminHotelService adminHotelService;
    private final AdminDMCService adminDMCService;

    @Override
    public UserManagementStatsDTO getUserManagementStats() {
        log.info("Fetching user management statistics");

        // Hotel statistics
        long totalHotels = hotelRepository.count();
        long approvedHotels = hotelRepository.countByStatus("APPROVED");
        long pendingHotels = hotelRepository.countByStatus("PENDING");
        long rejectedHotels = hotelRepository.countByStatus("REJECTED");

        // DMC statistics
        long totalDMCs = dmcProfileRepository.count();
        long approvedDMCs = dmcProfileRepository.countByStatus(DMCProfileStatus.APPROVED);
        long pendingDMCs = dmcProfileRepository.countByStatus(DMCProfileStatus.PENDING);
        long rejectedDMCs = dmcProfileRepository.countByStatus(DMCProfileStatus.REJECTED);

        // Total pending approvals
        long totalPendingApprovals = pendingHotels + pendingDMCs;

        return UserManagementStatsDTO.builder()
                .totalHotels(totalHotels)
                .approvedHotels(approvedHotels)
                .pendingHotels(pendingHotels)
                .rejectedHotels(rejectedHotels)
                .totalDMCs(totalDMCs)
                .approvedDMCs(approvedDMCs)
                .pendingDMCs(pendingDMCs)
                .rejectedDMCs(rejectedDMCs)
                .totalPendingApprovals(totalPendingApprovals)
                .build();
    }

    @Override
    public Page<PendingApprovalDTO> getPendingApprovals(Pageable pageable) {
        log.info("Fetching pending approvals - Page: {}, Size: {}", pageable.getPageNumber(), pageable.getPageSize());

        // Fetch pending hotels
        List<HotelProfile> pendingHotels = hotelRepository.findByStatus("PENDING", Pageable.unpaged()).getContent();
        
        // Fetch pending DMCs
        List<DMCProfile> pendingDMCs = dmcProfileRepository.findByStatus(DMCProfileStatus.PENDING, Pageable.unpaged()).getContent();

        // Convert to DTOs
        List<PendingApprovalDTO> allPendingApprovals = new ArrayList<>();

        // Add hotels
        List<PendingApprovalDTO> hotelDTOs = pendingHotels.stream()
                .map(this::convertHotelToPendingApprovalDTO)
                .collect(Collectors.toList());
        allPendingApprovals.addAll(hotelDTOs);

        // Add DMCs
        List<PendingApprovalDTO> dmcDTOs = pendingDMCs.stream()
                .map(this::convertDMCToPendingApprovalDTO)
                .collect(Collectors.toList());
        allPendingApprovals.addAll(dmcDTOs);

        // Sort by applied date (newest first)
        allPendingApprovals.sort((a, b) -> b.getAppliedDate().compareTo(a.getAppliedDate()));

        // Implement pagination manually
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), allPendingApprovals.size());
        
        List<PendingApprovalDTO> pageContent = allPendingApprovals.subList(start, end);

        return new PageImpl<>(pageContent, pageable, allPendingApprovals.size());
    }

    @Override
    public PendingApprovalDTO getPendingApprovalById(String id, String type) {
        log.info("Fetching pending approval details - ID: {}, Type: {}", id, type);

        if ("HOTEL".equalsIgnoreCase(type)) {
            HotelProfile hotel = hotelRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Hotel profile not found with ID: " + id));
            return convertHotelToPendingApprovalDTO(hotel);
        } else if ("DMC".equalsIgnoreCase(type)) {
            DMCProfile dmc = dmcProfileRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("DMC profile not found with ID: " + id));
            return convertDMCToPendingApprovalDTO(dmc);
        } else {
            throw new IllegalArgumentException("Invalid type: " + type + ". Must be HOTEL or DMC");
        }
    }

    @Override
    @Transactional
    public Map<String, Object> processApprovalAction(
            String id,
            String type,
            ApprovalActionRequest request,
            String adminId,
            String adminUsername
    ) {
        log.info("Processing approval action - ID: {}, Type: {}, Action: {}", id, type, request.getAction());

        Map<String, Object> result = new HashMap<>();

        if ("HOTEL".equalsIgnoreCase(type)) {
            if ("APPROVE".equalsIgnoreCase(request.getAction())) {
                adminHotelService.approveHotelProfile(id, adminId, adminUsername);
                result.put("status", "APPROVED");
                result.put("message", "Hotel profile approved successfully");
            } else if ("REJECT".equalsIgnoreCase(request.getAction())) {
                if (request.getReason() == null || request.getReason().trim().isEmpty()) {
                    throw new IllegalArgumentException("Rejection reason is required");
                }
                adminHotelService.rejectHotelProfile(id, request.getReason(), adminId, adminUsername);
                result.put("status", "REJECTED");
                result.put("message", "Hotel profile rejected successfully");
            } else {
                throw new IllegalArgumentException("Invalid action: " + request.getAction());
            }
        } else if ("DMC".equalsIgnoreCase(type)) {
            if ("APPROVE".equalsIgnoreCase(request.getAction())) {
                adminDMCService.approveDMCProfile(id, adminId, adminUsername);
                result.put("status", "APPROVED");
                result.put("message", "DMC profile approved successfully");
            } else if ("REJECT".equalsIgnoreCase(request.getAction())) {
                if (request.getReason() == null || request.getReason().trim().isEmpty()) {
                    throw new IllegalArgumentException("Rejection reason is required");
                }
                adminDMCService.rejectDMCProfile(id, request.getReason(), adminId, adminUsername);
                result.put("status", "REJECTED");
                result.put("message", "DMC profile rejected successfully");
            } else {
                throw new IllegalArgumentException("Invalid action: " + request.getAction());
            }
        } else {
            throw new IllegalArgumentException("Invalid type: " + type + ". Must be HOTEL or DMC");
        }

        result.put("id", id);
        result.put("type", type);
        result.put("action", request.getAction());

        return result;
    }

    // Helper methods to convert entities to DTOs
    private PendingApprovalDTO convertHotelToPendingApprovalDTO(HotelProfile hotel) {
        boolean documentsVerified = hotel.getCertifications() != null && !hotel.getCertifications().isEmpty();
        
        return PendingApprovalDTO.builder()
                .id(hotel.getId())
                .type("HOTEL")
                .name(hotel.getName())
                .location(hotel.getCity() + ", " + hotel.getCountry())
                .contactEmail(hotel.getContactEmail())
                .contactNumber(hotel.getContactNumber())
                .appliedDate(hotel.getCreatedAt())
                .documentsVerified(documentsVerified)
                .status(hotel.getStatus())
                .city(hotel.getCity())
                .country(hotel.getCountry())
                .address(hotel.getAddress())
                .totalRooms(hotel.getTotalRooms())
                .build();
    }

    private PendingApprovalDTO convertDMCToPendingApprovalDTO(DMCProfile dmc) {
        boolean documentsVerified = dmc.getSltdaCertificationUrl() != null && !dmc.getSltdaCertificationUrl().isEmpty();
        
        return PendingApprovalDTO.builder()
                .id(dmc.getId())
                .type("DMC")
                .name(dmc.getCompanyName())
                .location(dmc.getAddress())
                .contactEmail(dmc.getEmail())
                .contactNumber(dmc.getContactNumber())
                .appliedDate(dmc.getCreatedAt())
                .documentsVerified(documentsVerified)
                .status(dmc.getStatus().name())
                .companyName(dmc.getCompanyName())
                .businessRegistrationNumber(dmc.getBusinessRegistrationNumber())
                .sltdaCertificationUrl(dmc.getSltdaCertificationUrl())
                .build();
    }
}
