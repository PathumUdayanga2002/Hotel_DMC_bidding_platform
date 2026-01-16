package com.hotel_bidding.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hotel_bidding.backend.constants.NotificationType;
import com.hotel_bidding.backend.entity.Message;
import com.hotel_bidding.backend.entity.User;
import com.hotel_bidding.backend.repository.MessageRepository;
import com.hotel_bidding.backend.repository.UserRepository;
import com.hotel_bidding.backend.service.MessageService;
import com.hotel_bidding.backend.service.NotificationService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;

    @Override
    public Message saveMessage(Message message) {
        message.setTimestamp(LocalDateTime.now());
        message.setRead(false);
        Message savedMessage = messageRepository.save(message);
        
        // Check if sender is PLATFORM_SUPER_ADMIN or ADMIN
        Optional<User> senderOpt = userRepository.findById(message.getSenderId());
        if (senderOpt.isPresent()) {
            User sender = senderOpt.get();
            String senderRole = sender.getRole() != null ? sender.getRole().toString() : "";
            
            // If admin is sending a message, create a notification for the receiver
            if ("PLATFORM_SUPER_ADMIN".equals(senderRole) || "ADMIN".equals(senderRole)) {
                try {
                    String notificationTitle = "Platform Offer from Admin";
                    String notificationMessage = message.getContent();
                    if (message.getContent().length() > 200) {
                        notificationMessage = message.getContent().substring(0, 197) + "...";
                    }
                    
                    notificationService.createNotification(
                        message.getReceiverId(),
                        NotificationType.PLATFORM_OFFER,
                        notificationTitle,
                        notificationMessage,
                        null,  // No related inquiry
                        null,  // No related bid
                        "/messages",  // Link to messages page
                        3      // High priority
                    );
                    
                    log.info("Created PLATFORM_OFFER notification for user {} from admin {}", 
                            message.getReceiverId(), message.getSenderId());
                } catch (Exception e) {
                    log.error("Failed to create notification for admin message", e);
                    // Don't fail the message sending if notification fails
                }
            }
        }
        
        return savedMessage;
    }

    @Override
    public List<Message> getConversation(String user1, String user2) {
        return messageRepository.findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByTimestamp(
                user1, user2, user1, user2
        );
    }

    @Override
    public Message markAsRead(String messageId) {
        Message msg = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        msg.setRead(true);
        return messageRepository.save(msg);
    }

    @Override
    public List<Message> getAllMessagesForUser(String userId) {
        return messageRepository.findBySenderIdOrReceiverIdOrderByTimestamp(userId, userId);
    }

}
