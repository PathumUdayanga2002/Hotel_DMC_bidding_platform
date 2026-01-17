package com.hotel_bidding.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hotel_bidding.backend.dto.response.NotificationResponse;
import com.hotel_bidding.backend.exception.ResourceNotFoundException;
import com.hotel_bidding.backend.repository.UserRepository;
import com.hotel_bidding.backend.service.NotificationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST Controller for Notification Management
 * Handles in-app notification display, read status, and cleanup
 */
@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('DMC_USER', 'DMC_SUPER_ADMIN', 'DMC_STAFF_ADMIN', 'HOTEL_USER', 'HOTEL_SUPER_ADMIN', 'HOTEL_STAFF_ADMIN', 'ADMIN', 'PLATFORM_SUPER_ADMIN')")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    /**
     * Helper method to get user ID from authentication
     */
    private String getUserId(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getId();
    }

    /**
     * Get all notifications for the authenticated user
     */
    @GetMapping
    public ResponseEntity<Page<NotificationResponse>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        
        String userId = getUserId(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        Page<NotificationResponse> notifications = notificationService.getNotificationsByUser(userId, pageable);
        
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get unread notification count
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        String userId = getUserId(authentication);
        long count = notificationService.countUnreadNotifications(userId);
        
        Map<String, Long> response = new HashMap<>();
        response.put("unreadCount", count);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Mark a specific notification as read
     */
    @PutMapping("/{notificationId}/mark-read")
    public ResponseEntity<Map<String, String>> markAsRead(
            @PathVariable String notificationId,
            Authentication authentication) {
        
        String userId = getUserId(authentication);
        log.info("Marking notification {} as read by user: {}", notificationId, userId);
        
        notificationService.markAsRead(notificationId, userId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Notification marked as read");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Mark all notifications as read
     */
    @PutMapping("/mark-all-read")
    public ResponseEntity<Map<String, String>> markAllAsRead(Authentication authentication) {
        String userId = getUserId(authentication);
        
        log.info("Marking all notifications as read for user: {}", userId);
        
        notificationService.markAllAsRead(userId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "All notifications marked as read");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a notification
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Map<String, String>> deleteNotification(
            @PathVariable String notificationId,
            Authentication authentication) {
        
        String userId = getUserId(authentication);
        log.info("Deleting notification {} by user: {}", notificationId, userId);
        
        notificationService.deleteNotification(notificationId, userId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Notification deleted successfully");
        
        return ResponseEntity.ok(response);
    }
}
