package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.entity.Message;
import java.util.List;

public interface MessageService {
    Message saveMessage(Message message);
    List<Message> getConversation(String user1, String user2);
    Message markAsRead(String messageId);
    List<Message> getAllMessagesForUser(String userId);

}
