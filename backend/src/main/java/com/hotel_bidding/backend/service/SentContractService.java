package com.hotel_bidding.backend.service;

import com.hotel_bidding.backend.dto.SendContractRequest;
import com.hotel_bidding.backend.entity.SentContract;

import java.util.List;

public interface SentContractService {

    SentContract sendContract(SendContractRequest request);

    List<SentContract> getContractsSentByHotel(String hotelId);

    List<SentContract> getContractsReceivedByDmc(String dmcId);
}
