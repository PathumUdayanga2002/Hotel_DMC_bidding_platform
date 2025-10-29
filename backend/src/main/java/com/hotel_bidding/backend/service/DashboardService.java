package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.dto.ApprovalRequestDTO;
import com.hotel_bidding.backend.dto.DashboardStatsDTO;
import com.hotel_bidding.backend.entity.ApprovalRequest;
import com.hotel_bidding.backend.entity.ApprovalStatus;
import com.hotel_bidding.backend.repository.ApprovalRequestRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    private final ApprovalRequestRepository approvalRequestRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public DashboardService(ApprovalRequestRepository approvalRequestRepository, 
                          SimpMessagingTemplate messagingTemplate) {
        this.approvalRequestRepository = approvalRequestRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalHotels(approvalRequestRepository.countByTypeAndStatus("HOTEL", ApprovalStatus.APPROVED));
        stats.setTotalDMCs(approvalRequestRepository.countByTypeAndStatus("DMC", ApprovalStatus.APPROVED));
        stats.setPendingApprovals(approvalRequestRepository.countByTypeAndStatus("HOTEL", ApprovalStatus.PENDING) +
                                approvalRequestRepository.countByTypeAndStatus("DMC", ApprovalStatus.PENDING));
        return stats;
    }

    public List<ApprovalRequestDTO> getPendingApprovals() {
        return approvalRequestRepository.findByStatusOrderByAppliedDateDesc(ApprovalStatus.PENDING)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ApprovalRequestDTO convertToDTO(ApprovalRequest entity) {
        ApprovalRequestDTO dto = new ApprovalRequestDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }

    public void updateApprovalRequest(ApprovalRequestDTO dto) {
        ApprovalRequest entity = approvalRequestRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Approval request not found"));
        BeanUtils.copyProperties(dto, entity);
        approvalRequestRepository.save(entity);
        
        // Notify clients about the update
        messagingTemplate.convertAndSend("/topic/dashboard-updates", getDashboardStats());
    }
}
