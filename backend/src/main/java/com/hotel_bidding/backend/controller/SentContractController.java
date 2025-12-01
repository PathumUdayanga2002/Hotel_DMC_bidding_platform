package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.dto.SendContractRequest;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.entity.SentContract;
import com.hotel_bidding.backend.service.SentContractService;
import com.hotel_bidding.backend.repository.SentContractRepository;
import com.hotel_bidding.backend.repository.DMCProfileRepository;
import com.hotel_bidding.backend.repository.HotelContractRepository;
import com.hotel_bidding.backend.entity.HotelContract;
import com.hotel_bidding.backend.dto.response.ContractResponse;
import com.hotel_bidding.backend.security.UserDetailsImpl;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/send-contract")
@RequiredArgsConstructor
@Slf4j
public class SentContractController {

    private final SentContractService sentContractService;
    private final SentContractRepository sentContractRepository;
    private final DMCProfileRepository dmcProfileRepository;
    private final HotelContractRepository hotelContractRepository;

    @PostMapping
    public ResponseEntity<ApiResponse> sendContract(@Valid @RequestBody SendContractRequest request) {
        SentContract saved = sentContractService.sendContract(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.builder()
                        .success(true)
                        .message("Contract sent")
                        .data(saved)
                        .build()
        );
    }

    @GetMapping("/sent/{hotelId}")
    public ResponseEntity<ApiResponse> getSentByHotel(@PathVariable String hotelId) {
        List<SentContract> list = sentContractService.getContractsSentByHotel(hotelId);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Contracts sent by hotel")
                .data(list)
                .build());
    }

    @GetMapping("/received/{dmcId}")
    public ResponseEntity<ApiResponse> getReceivedByDmc(@PathVariable String dmcId) {
        List<SentContract> list = sentContractService.getContractsReceivedByDmc(dmcId);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Contracts received by DMC")
                .data(list)
                .build());
    }

    @GetMapping("/view/{contractId}")
    public ResponseEntity<ApiResponse> viewContractAsDmc(
            @PathVariable String contractId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        // Ensure authenticated
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.builder()
                    .success(false)
                    .message("Unauthorized")
                    .build());
        }

        // Resolve DMC profile for this user
        var profileOpt = dmcProfileRepository.findByUserId(userDetails.getId());
        if (profileOpt.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.builder()
                    .success(false)
                    .message("DMC profile not found")
                    .build());
        }

        String dmcProfileId = profileOpt.get().getId();

        // Check if this contract was sent to this DMC profile id
        boolean allowed = sentContractRepository.existsByContractIdAndReceiverDmcIdsContaining(contractId, dmcProfileId);
        if (!allowed) {
            return ResponseEntity.status(403).body(ApiResponse.builder()
                    .success(false)
                    .message("You are not authorized to view this contract")
                    .build());
        }

        // Fetch contract entity
        var contractOpt = hotelContractRepository.findById(contractId);
        if (contractOpt.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.builder()
                    .success(false)
                    .message("Contract not found")
                    .build());
        }

        HotelContract c = contractOpt.get();

        // Map to ContractResponse (similar to other mapping logic)
        ContractResponse resp = new ContractResponse();
        resp.setId(c.getId());
        resp.setHotelId(c.getHotelId());

        if (c.getGeneral() != null) {
            ContractResponse.General g = new ContractResponse.General();
            g.setContractName(c.getGeneral().getContractName());
            g.setHotelName(c.getGeneral().getHotelName());
            g.setStartDate(c.getGeneral().getStartDate());
            g.setEndDate(c.getGeneral().getEndDate());
            g.setRateBasis(c.getGeneral().getRateBasis());
            g.setCurrency(c.getGeneral().getCurrency());
            g.setInclusivity(c.getGeneral().getInclusivity());
            g.setOnlineMarkupPolicy(c.getGeneral().getOnlineMarkupPolicy());
            g.setGovernmentTaxNote(c.getGeneral().getGovernmentTaxNote());
            g.setPeakPeriods(c.getGeneral().getPeakPeriods());
            resp.setGeneral(g);
        }

        resp.setRooms(c.getRooms());
        resp.setMeals(c.getMeals());
        resp.setChildPolicy(c.getChildPolicy());
        resp.setOffers(c.getOffers());
        resp.setValueAdded(c.getValueAdded());
        resp.setTerms(c.getTerms());

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Contract details")
                .data(resp)
                .build());
    }
}
