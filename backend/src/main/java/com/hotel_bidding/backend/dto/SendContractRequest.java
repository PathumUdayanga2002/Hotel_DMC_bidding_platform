package com.hotel_bidding.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class SendContractRequest {
    private String contractId;
    private String senderHotelId;
    private List<String> receiverDmcIds;
}
