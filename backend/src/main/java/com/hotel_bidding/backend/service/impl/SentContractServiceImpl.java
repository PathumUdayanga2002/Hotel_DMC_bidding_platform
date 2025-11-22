package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.dto.SendContractRequest;
import com.hotel_bidding.backend.entity.SentContract;
import com.hotel_bidding.backend.repository.SentContractRepository;
import com.hotel_bidding.backend.service.SentContractService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SentContractServiceImpl implements SentContractService {

    private final SentContractRepository sentContractRepository;

    @Override
    public SentContract sendContract(SendContractRequest request) {
        log.info("Sending contract {} from hotel {} to DMCs {}",
                request.getContractId(), request.getSenderHotelId(), request.getReceiverDmcIds());

        if (request.getReceiverDmcIds() == null || request.getReceiverDmcIds().isEmpty()) {
            log.warn("No receiver DMC IDs provided - nothing to send");
            // still create an entry with empty receivers to record the action
        }

        SentContract sc = new SentContract();
        sc.setContractId(request.getContractId());
        sc.setSenderHotelId(request.getSenderHotelId());
        sc.setReceiverDmcIds(request.getReceiverDmcIds() == null ? List.of() : request.getReceiverDmcIds());
        sc.setSentAt(LocalDateTime.now());

        SentContract saved = sentContractRepository.save(sc);
        log.info("SentContract saved with id {}", saved.getId());
        return saved;
    }

    @Override
    public List<SentContract> getContractsSentByHotel(String hotelId) {
        if (hotelId == null) return List.of();
        return sentContractRepository.findBySenderHotelId(hotelId);
    }

    @Override
    public List<SentContract> getContractsReceivedByDmc(String dmcId) {
        if (dmcId == null) return List.of();
        return sentContractRepository.findByReceiverDmcIdsContaining(dmcId);
    }
}
