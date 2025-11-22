package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.entity.Message;
import com.hotel_bidding.backend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // REST: Send a message (for Postman testing)
    @PostMapping
    public Message sendMessageRest(@RequestBody Message message) {
        return messageService.saveMessage(message);
    }

    @GetMapping("/all")
    public List<Message> getAllMessages(@RequestParam String userId) {
        return messageService.getAllMessagesForUser(userId);
    }


    // REST: Get conversation history
    @GetMapping("/conversation")
    public List<Message> getConversation(@RequestParam String user1, @RequestParam String user2) {
        return messageService.getConversation(user1, user2);
    }

    // REST: Mark as read
    @PutMapping("/read/{id}")
    public Message markAsRead(@PathVariable String id) {
        return messageService.markAsRead(id);
    }

    // WebSocket: Send a message
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/messages")
    public Message sendMessageWs(Message message) {
        return messageService.saveMessage(message);
    }
}
