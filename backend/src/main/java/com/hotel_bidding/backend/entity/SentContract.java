package com.hotel_bidding.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "sent_contracts")
public class SentContract {

    @Id
    private String id;

    // Reference to saved contract (HotelContract id)
    private String contractId;

    // Hotel who sent the contract
    private String senderHotelId;

    // List of DMC profile ids who received the contract
    private List<String> receiverDmcIds = new ArrayList<>();

    private LocalDateTime sentAt;
}
