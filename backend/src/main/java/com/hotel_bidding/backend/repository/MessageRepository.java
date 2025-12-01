package com.hotel_bidding.backend.repository;

import com.hotel_bidding.backend.entity.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByTimestamp(
            String sender1, String receiver1, String sender2, String receiver2
    );
    List<Message> findBySenderIdOrReceiverIdOrderByTimestamp(String senderId, String receiverId);

}
