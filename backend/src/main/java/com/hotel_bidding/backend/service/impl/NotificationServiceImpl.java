package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.constants.NotificationType;
import com.hotel_bidding.backend.constants.UserRole;
import com.hotel_bidding.backend.dto.response.NotificationResponse;
import com.hotel_bidding.backend.entity.BidInquiry;
import com.hotel_bidding.backend.entity.HotelBid;
import com.hotel_bidding.backend.entity.HotelProfile;
import com.hotel_bidding.backend.entity.Notification;
import com.hotel_bidding.backend.exception.ResourceNotFoundException;
import com.hotel_bidding.backend.exception.UnauthorizedException;
import com.hotel_bidding.backend.repository.BidInquiryRepository;
import com.hotel_bidding.backend.repository.HotelBidRepository;
import com.hotel_bidding.backend.repository.HotelRepository;
import com.hotel_bidding.backend.repository.NotificationRepository;
import com.hotel_bidding.backend.service.EmailService;
import com.hotel_bidding.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of NotificationService
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final BidInquiryRepository bidInquiryRepository;
    private final HotelBidRepository hotelBidRepository;
    private final HotelRepository hotelRepository;
    private final EmailService emailService;
    
    @Override
    @Transactional
    public void createNotification(String recipientUserId, NotificationType type, String title, 
                                  String message, String relatedInquiryId, String relatedBidId, 
                                  String actionUrl, int priority) {
        
        Notification notification = Notification.builder()
                .recipientUserId(recipientUserId)
                .recipientRole(determineUserRole(type))
                .type(type)
                .title(title)
                .message(message)
                .relatedInquiryId(relatedInquiryId)
                .relatedBidId(relatedBidId)
                .actionUrl(actionUrl)
                .read(false)
                .priority(priority)
                .createdAt(LocalDateTime.now())
                .build();
        
        notificationRepository.save(notification);
        log.info("Notification created for user: {} - Type: {}", recipientUserId, type);
    }
    
    @Override
    public Page<NotificationResponse> getNotificationsByUser(String userId, Pageable pageable) {
        Page<Notification> notifications = notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(userId, pageable);
        return notifications.map(this::mapToResponse);
    }
    
    @Override
    public List<NotificationResponse> getUnreadNotifications(String userId) {
        List<Notification> notifications = notificationRepository.findByRecipientUserIdAndReadFalseOrderByCreatedAtDesc(userId);
        return notifications.stream().map(this::mapToResponse).collect(Collectors.toList());
    }
    
    @Override
    public long countUnreadNotifications(String userId) {
        return notificationRepository.countByRecipientUserIdAndReadFalse(userId);
    }
    
    @Override
    @Transactional
    public void markAsRead(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        
        if (!notification.getRecipientUserId().equals(userId)) {
            throw new UnauthorizedException("You can only mark your own notifications as read");
        }
        
        if (!notification.isRead()) {
            notification.markAsRead();
            notificationRepository.save(notification);
            log.info("Notification marked as read: {}", notificationId);
        }
    }
    
    @Override
    @Transactional
    public void markAllAsRead(String userId) {
        List<Notification> unreadNotifications = notificationRepository.findUnreadByUser(userId);
        
        for (Notification notification : unreadNotifications) {
            notification.markAsRead();
        }
        
        notificationRepository.saveAll(unreadNotifications);
        log.info("All notifications marked as read for user: {}", userId);
    }
    
    @Override
    @Transactional
    public void deleteNotification(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        
        if (!notification.getRecipientUserId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own notifications");
        }
        
        notificationRepository.delete(notification);
        log.info("Notification deleted: {}", notificationId);
    }
    
    @Override
    @Transactional
    public void notifyHotelsAboutNewInquiry(String inquiryId, List<String> cities) {
        BidInquiry inquiry = bidInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found"));
        
        // Find all approved hotels in the specified cities
        List<HotelProfile> matchingHotels = hotelRepository.findByCityInAndStatus(cities, "APPROVED");
        
        for (HotelProfile hotel : matchingHotels) {
            // Create in-app notification
            String title = "New Bid Inquiry Available";
            String message = String.format("New inquiry from %s for %s. %d rooms needed from %s to %s. Budget: %s %.2f - %.2f",
                    inquiry.getDmcCompanyName(),
                    String.join(", ", inquiry.getDestinationCities()),
                    inquiry.getNumberOfRooms(),
                    inquiry.getCheckInDate(),
                    inquiry.getCheckOutDate(),
                    inquiry.getCurrency(),
                    inquiry.getBudgetMin(),
                    inquiry.getBudgetMax());
            
            createNotification(
                    hotel.getUserId(),
                    NotificationType.NEW_INQUIRY,
                    title,
                    message,
                    inquiryId,
                    null,
                    "/hotel/inquiries/" + inquiryId,
                    1 // High priority
            );
            
            // Send email notification
            emailService.sendNewInquiryNotificationToHotel(
                    hotel.getContactEmail(),
                    hotel.getName(),
                    inquiry.getTitle(),
                    inquiry.getDmcCompanyName(),
                    String.join(", ", inquiry.getDestinationCities()),
                    inquiry.getCheckInDate().toString(),
                    inquiry.getCheckOutDate().toString(),
                    inquiry.getNumberOfRooms(),
                    inquiry.getDeadline().toString()
            );
        }
        
        log.info("Notified {} hotels about new inquiry: {}", matchingHotels.size(), inquiryId);
    }
    
    @Override
    @Transactional
    public void notifyDmcAboutNewBid(String bidId, String dmcUserId) {
        HotelBid bid = hotelBidRepository.findById(bidId)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found"));
        
        BidInquiry inquiry = bidInquiryRepository.findById(bid.getInquiryId())
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found"));
        
        // Create in-app notification
        String title = "New Bid Received";
        String message = String.format("New bid from %s for your inquiry '%s'. Price: %s %.2f per room per night",
                bid.getHotelName(),
                inquiry.getTitle(),
                bid.getCurrency(),
                bid.getPricePerRoomPerNight());
        
        createNotification(
                dmcUserId,
                NotificationType.NEW_BID,
                title,
                message,
                bid.getInquiryId(),
                bidId,
                "/dmc/inquiries/" + bid.getInquiryId() + "/bids",
                1 // High priority
        );
        
        // Send email notification
        emailService.sendNewBidNotificationToDmc(
                inquiry.getDmcCompanyName(),
                bid.getHotelName(),
                inquiry.getTitle(),
                bid.getPricePerRoomPerNight(),
                bid.getCurrency()
        );
        
        log.info("Notified DMC about new bid: {}", bidId);
    }
    
    @Override
    @Transactional
    public void notifyHotelAboutBidAcceptance(String bidId, String hotelUserId) {
        HotelBid bid = hotelBidRepository.findById(bidId)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found"));
        
        // Create in-app notification
        String title = "🎉 Bid Accepted!";
        String message = String.format("Congratulations! Your bid for '%s' has been accepted by %s. Total price: %s %.2f",
                bid.getInquiryTitle(),
                bid.getDmcCompanyName(),
                bid.getCurrency(),
                bid.getTotalPrice());
        
        createNotification(
                hotelUserId,
                NotificationType.BID_ACCEPTED,
                title,
                message,
                bid.getInquiryId(),
                bidId,
                "/hotel/bids/" + bidId,
                1 // High priority
        );
        
        // Send email notification
        HotelProfile hotel = hotelRepository.findByUserId(hotelUserId).orElse(null);
        if (hotel != null) {
            emailService.sendBidAcceptanceNotificationToHotel(
                    hotel.getContactEmail(),
                    hotel.getName(),
                    bid.getInquiryTitle(),
                    bid.getDmcCompanyName(),
                    bid.getTotalPrice(),
                    bid.getCurrency()
            );
        }
        
        log.info("Notified hotel about bid acceptance: {}", bidId);
    }
    
    @Override
    @Transactional
    public void notifyHotelAboutBidRejection(String bidId, String hotelUserId) {
        HotelBid bid = hotelBidRepository.findById(bidId)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found"));
        
        // Create in-app notification
        String title = "Bid Not Accepted";
        String message = String.format("Your bid for '%s' was not accepted by %s. %s",
                bid.getInquiryTitle(),
                bid.getDmcCompanyName(),
                bid.getRejectionReason() != null ? "Reason: " + bid.getRejectionReason() : "");
        
        createNotification(
                hotelUserId,
                NotificationType.BID_REJECTED,
                title,
                message,
                bid.getInquiryId(),
                bidId,
                "/hotel/bids/" + bidId,
                2 // Medium priority
        );
        
        // Send email notification
        HotelProfile hotel = hotelRepository.findByUserId(hotelUserId).orElse(null);
        if (hotel != null) {
            emailService.sendBidRejectionNotificationToHotel(
                    hotel.getContactEmail(),
                    hotel.getName(),
                    bid.getInquiryTitle(),
                    bid.getDmcCompanyName(),
                    bid.getRejectionReason()
            );
        }
        
        log.info("Notified hotel about bid rejection: {}", bidId);
    }
    
    @Override
    @Transactional
    public void notifyHotelsAboutInquiryClosed(String inquiryId) {
        BidInquiry inquiry = bidInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found"));
        
        // Get all bids for this inquiry
        List<HotelBid> bids = hotelBidRepository.findByInquiryIdOrderBySubmittedAtDesc(inquiryId);
        
        for (HotelBid bid : bids) {
            String title = "Inquiry Closed";
            String message = String.format("The inquiry '%s' has been closed by %s.",
                    inquiry.getTitle(),
                    inquiry.getDmcCompanyName());
            
            createNotification(
                    bid.getHotelUserId(),
                    NotificationType.INQUIRY_CLOSED,
                    title,
                    message,
                    inquiryId,
                    bid.getId(),
                    "/hotel/inquiries/" + inquiryId,
                    2 // Medium priority
            );
        }
        
        log.info("Notified {} hotels about inquiry closure: {}", bids.size(), inquiryId);
    }
    
    @Override
    @Transactional
    public void notifyAboutApproachingDeadline(String inquiryId) {
        BidInquiry inquiry = bidInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found"));
        
        // Notify DMC
        String title = "⏰ Deadline Approaching";
        Integer bidCount = inquiry.getBidCount() != null ? inquiry.getBidCount() : 0;
        String message = String.format("Your inquiry '%s' deadline is approaching (less than 24 hours remaining). Current bids: %d",
                inquiry.getTitle(),
                bidCount);
        
        createNotification(
                inquiry.getDmcUserId(),
                NotificationType.DEADLINE_APPROACHING,
                title,
                message,
                inquiryId,
                null,
                "/dmc/inquiries/" + inquiryId,
                1 // High priority
        );
        
        log.info("Notified DMC about approaching deadline for inquiry: {}", inquiryId);
    }
    
    /**
     * Determine user role based on notification type
     */
    private UserRole determineUserRole(NotificationType type) {
        return switch (type) {
            case NEW_INQUIRY, BID_ACCEPTED, BID_REJECTED, INQUIRY_CLOSED, 
                 HOTEL_PROFILE_APPROVED, HOTEL_PROFILE_REJECTED, DIRECT_INQUIRY_CREATED,
                 PROPOSAL_RECEIVED, HOTEL_STAFF_ADDED, HOTEL_STAFF_REMOVED, BID_STATUS_UPDATED -> UserRole.HOTEL_SUPER_ADMIN;
            case NEW_BID, DEADLINE_APPROACHING, DMC_PROFILE_APPROVED, DMC_PROFILE_REJECTED,
                 DMC_ACCOUNT_ACTIVATED, DMC_ACCOUNT_SUSPENDED, DMC_ACCOUNT_DEACTIVATED,
                 INQUIRY_RECEIVED, CONTRACT_RECEIVED, DMC_STAFF_ADDED, DMC_STAFF_REMOVED -> UserRole.DMC_SUPER_ADMIN;
            case MESSAGE_RECEIVED, MESSAGE_FAILED -> UserRole.HOTEL_SUPER_ADMIN; // Default, can be either
            default -> UserRole.HOTEL_SUPER_ADMIN;
        };
    }
    
    // ==================== HOTEL-SPECIFIC NOTIFICATION IMPLEMENTATIONS ====================
    
    @Override
    @Transactional
    public void notifyHotelProfileApproved(String hotelUserId, String profileId) {
        String title = "🎉 Profile Approved!";
        String message = "Congratulations! Your hotel profile has been approved by our admin team. " +
                "You can now access all platform features and start receiving bid inquiries.";
        
        createNotification(
                hotelUserId,
                NotificationType.HOTEL_PROFILE_APPROVED,
                title,
                message,
                null,
                null,
                "/hotel/profile",
                1 // High priority
        );
        
        log.info("Notified hotel user {} about profile approval", hotelUserId);
    }
    
    @Override
    @Transactional
    public void notifyHotelProfileRejected(String hotelUserId, String profileId, String reason) {
        String title = "Profile Review Update";
        String message = String.format("Your hotel profile has been reviewed. " +
                "Unfortunately, we need some additional information. Reason: %s. " +
                "Please update your profile and resubmit for review.", reason);
        
        createNotification(
                hotelUserId,
                NotificationType.HOTEL_PROFILE_REJECTED,
                title,
                message,
                null,
                null,
                "/hotel/profile",
                1 // High priority
        );
        
        log.info("Notified hotel user {} about profile rejection", hotelUserId);
    }
    
    @Override
    @Transactional
    public void notifyDirectInquiryCreated(String hotelUserId, String inquiryId) {
        String title = "✅ Direct Inquiry Created";
        String message = "Your direct inquiry has been created successfully. " +
                "You will receive notifications when DMCs submit bids.";
        
        createNotification(
                hotelUserId,
                NotificationType.DIRECT_INQUIRY_CREATED,
                title,
                message,
                inquiryId,
                null,
                "/hotel/inquiries/" + inquiryId,
                2 // Medium priority
        );
        
        log.info("Notified hotel user {} about direct inquiry creation", hotelUserId);
    }
    
    @Override
    @Transactional
    public void notifyProposalReceived(String hotelUserId, String proposalId, String dmcName) {
        String title = "📩 New Proposal Received";
        String message = String.format("You have received a new proposal from %s. " +
                "Review the details and respond accordingly.", dmcName);
        
        createNotification(
                hotelUserId,
                NotificationType.PROPOSAL_RECEIVED,
                title,
                message,
                null,
                proposalId,
                "/hotel/proposals/" + proposalId,
                1 // High priority
        );
        
        log.info("Notified hotel user {} about proposal from {}", hotelUserId, dmcName);
    }
    
    @Override
    @Transactional
    public void notifyBidStatusUpdated(String hotelUserId, String bidId, String status) {
        String title = "📊 Bid Status Updated";
        String message = String.format("Your bid status has been updated to: %s", status);
        
        createNotification(
                hotelUserId,
                NotificationType.BID_STATUS_UPDATED,
                title,
                message,
                null,
                bidId,
                "/hotel/bids/" + bidId,
                2 // Medium priority
        );
        
        log.info("Notified hotel user {} about bid status update", hotelUserId);
    }
    
    @Override
    @Transactional
    public void notifyHotelStaffAdded(String hotelUserId, String staffName, String staffEmail) {
        String title = "👤 New Staff Member Added";
        String message = String.format("New staff member %s (%s) has been added to your hotel team.",
                staffName, staffEmail);
        
        createNotification(
                hotelUserId,
                NotificationType.HOTEL_STAFF_ADDED,
                title,
                message,
                null,
                null,
                "/hotel/settings/staff",
                3 // Low priority
        );
        
        log.info("Notified hotel user {} about staff addition", hotelUserId);
    }
    
    @Override
    @Transactional
    public void notifyHotelStaffRemoved(String hotelUserId, String staffName) {
        String title = "👤 Staff Member Removed";
        String message = String.format("Staff member %s has been removed from your hotel team.", staffName);
        
        createNotification(
                hotelUserId,
                NotificationType.HOTEL_STAFF_REMOVED,
                title,
                message,
                null,
                null,
                "/hotel/settings/staff",
                3 // Low priority
        );
        
        log.info("Notified hotel user {} about staff removal", hotelUserId);
    }
    
    @Override
    @Transactional
    public void notifyMessageReceived(String recipientUserId, String senderName, String messageId) {
        String title = "💬 New Message";
        String message = String.format("You have received a new message from %s.", senderName);
        
        createNotification(
                recipientUserId,
                NotificationType.MESSAGE_RECEIVED,
                title,
                message,
                null,
                null,
                "/messages/" + messageId,
                2 // Medium priority
        );
        
        log.info("Notified user {} about message from {}", recipientUserId, senderName);
    }
    
    @Override
    @Transactional
    public void notifyMessageFailed(String senderUserId, String recipientName, String reason) {
        String title = "❌ Message Delivery Failed";
        String message = String.format("Your message to %s could not be delivered. Reason: %s",
                recipientName, reason);
        
        createNotification(
                senderUserId,
                NotificationType.MESSAGE_FAILED,
                title,
                message,
                null,
                null,
                "/messages",
                2 // Medium priority
        );
        
        log.info("Notified user {} about message delivery failure", senderUserId);
    }
    
    // ==================== DMC-SPECIFIC NOTIFICATION IMPLEMENTATIONS ====================
    
    @Override
    @Transactional
    public void notifyDmcProfileApproved(String dmcUserId, String profileId) {
        String title = "🎉 Profile Approved!";
        String message = "Congratulations! Your DMC profile has been approved by our admin team. " +
                "You can now access all platform features and start bidding on inquiries.";
        
        createNotification(
                dmcUserId,
                NotificationType.DMC_PROFILE_APPROVED,
                title,
                message,
                null,
                null,
                "/dmc/profile",
                1 // High priority
        );
        
        log.info("Notified DMC user {} about profile approval", dmcUserId);
    }
    
    @Override
    @Transactional
    public void notifyDmcProfileRejected(String dmcUserId, String profileId, String reason) {
        String title = "Profile Review Update";
        String message = String.format("Your DMC profile has been reviewed. " +
                "Unfortunately, we need some additional information. Reason: %s. " +
                "Please update your profile and resubmit for review.", reason);
        
        createNotification(
                dmcUserId,
                NotificationType.DMC_PROFILE_REJECTED,
                title,
                message,
                null,
                null,
                "/dmc/profile",
                1 // High priority
        );
        
        log.info("Notified DMC user {} about profile rejection", dmcUserId);
    }
    
    @Override
    @Transactional
    public void notifyDmcAccountStatusChanged(String dmcUserId, String newStatus, String reason) {
        NotificationType type = switch (newStatus.toUpperCase()) {
            case "ACTIVE", "ACTIVATED" -> NotificationType.DMC_ACCOUNT_ACTIVATED;
            case "SUSPENDED" -> NotificationType.DMC_ACCOUNT_SUSPENDED;
            case "DEACTIVATED", "INACTIVE" -> NotificationType.DMC_ACCOUNT_DEACTIVATED;
            default -> NotificationType.DMC_ACCOUNT_ACTIVATED;
        };
        
        String title = String.format("Account Status: %s", newStatus);
        String message = String.format("Your DMC account status has been changed to %s. %s",
                newStatus, reason != null && !reason.isEmpty() ? "Reason: " + reason : "");
        
        createNotification(
                dmcUserId,
                type,
                title,
                message,
                null,
                null,
                "/dmc/profile",
                1 // High priority
        );
        
        log.info("Notified DMC user {} about account status change to {}", dmcUserId, newStatus);
    }
    
    @Override
    @Transactional
    public void notifyInquiryReceived(String dmcUserId, String inquiryId, String hotelName) {
        String title = "🔔 New Inquiry Received";
        String message = String.format("You have received a new inquiry from %s. " +
                "Review the details and submit your bid.", hotelName);
        
        createNotification(
                dmcUserId,
                NotificationType.INQUIRY_RECEIVED,
                title,
                message,
                inquiryId,
                null,
                "/dmc/inquiries/" + inquiryId,
                1 // High priority
        );
        
        log.info("Notified DMC user {} about inquiry from {}", dmcUserId, hotelName);
    }
    
    @Override
    @Transactional
    public void notifyInquiryUpdated(String dmcUserId, String inquiryId, String updateType) {
        String title = "📝 Inquiry Updated";
        String message = String.format("An inquiry has been updated: %s", updateType);
        
        createNotification(
                dmcUserId,
                NotificationType.INQUIRY_UPDATED,
                title,
                message,
                inquiryId,
                null,
                "/dmc/inquiries/" + inquiryId,
                2 // Medium priority
        );
        
        log.info("Notified DMC user {} about inquiry update", dmcUserId);
    }
    
    @Override
    @Transactional
    public void notifyContractReceived(String dmcUserId, String contractId, String hotelName) {
        String title = "📄 Contract Received";
        String message = String.format("You have received a contract from %s. " +
                "Please review and sign the contract.", hotelName);
        
        createNotification(
                dmcUserId,
                NotificationType.CONTRACT_RECEIVED,
                title,
                message,
                null,
                null,
                "/dmc/contracts/" + contractId,
                1 // High priority
        );
        
        log.info("Notified DMC user {} about contract from {}", dmcUserId, hotelName);
    }
    
    @Override
    @Transactional
    public void notifyDmcStaffAdded(String dmcUserId, String staffName, String staffEmail) {
        String title = "👤 New Staff Member Added";
        String message = String.format("New staff member %s (%s) has been added to your DMC team.",
                staffName, staffEmail);
        
        createNotification(
                dmcUserId,
                NotificationType.DMC_STAFF_ADDED,
                title,
                message,
                null,
                null,
                "/dmc/settings/staff",
                3 // Low priority
        );
        
        log.info("Notified DMC user {} about staff addition", dmcUserId);
    }
    
    @Override
    @Transactional
    public void notifyDmcStaffRemoved(String dmcUserId, String staffName) {
        String title = "👤 Staff Member Removed";
        String message = String.format("Staff member %s has been removed from your DMC team.", staffName);
        
        createNotification(
                dmcUserId,
                NotificationType.DMC_STAFF_REMOVED,
                title,
                message,
                null,
                null,
                "/dmc/settings/staff",
                3 // Low priority
        );
        
        log.info("Notified DMC user {} about staff removal", dmcUserId);
    }
    
    // ==================== ADMIN NOTIFICATION IMPLEMENTATIONS ====================
    
    @Override
    @Transactional
    public void notifyAdminNewRegistration(String userEmail, String userType) {
        // Get all admin users
        // For now, we'll skip this as admin notification requires admin user repository
        log.info("New {} registration: {}", userType, userEmail);
    }
    
    @Override
    @Transactional
    public void notifyAdminProfileSubmitted(String profileId, String profileType, String companyName) {
        // Get all admin users
        // For now, we'll skip this as admin notification requires admin user repository
        log.info("New {} profile submitted for {}", profileType, companyName);
    }
    
    /**
     * Map entity to response DTO
     */
    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .recipientUserId(notification.getRecipientUserId())
                .recipientRole(notification.getRecipientRole())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .relatedInquiryId(notification.getRelatedInquiryId())
                .relatedBidId(notification.getRelatedBidId())
                .actionUrl(notification.getActionUrl())
                .read(notification.isRead())
                .readAt(notification.getReadAt())
                .createdAt(notification.getCreatedAt())
                .priority(notification.getPriority())
                .isUnread(notification.isUnread())
                .isRecent(notification.isRecent())
                .build();
    }
}
