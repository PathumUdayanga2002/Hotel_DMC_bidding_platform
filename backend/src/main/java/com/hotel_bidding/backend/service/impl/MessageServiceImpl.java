package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.entity.Message;
import com.hotel_bidding.backend.repository.MessageRepository;
import com.hotel_bidding.backend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Override
    public Message saveMessage(Message message) {
        message.setTimestamp(LocalDateTime.now());
        message.setRead(false);
        return messageRepository.save(message);
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
