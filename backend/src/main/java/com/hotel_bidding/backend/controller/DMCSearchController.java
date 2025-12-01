package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.dto.DMCProfileResponse;
import com.hotel_bidding.backend.dto.response.ApiResponse;
import com.hotel_bidding.backend.service.DMCProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dmcs")
@RequiredArgsConstructor
@Slf4j
public class DMCSearchController {

    private final DMCProfileService dmcProfileService;

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchDmcs(@RequestParam(name = "name", required = false) String name) {
        List<DMCProfileResponse> results = dmcProfileService.searchApprovedDmcsByName(name == null ? "" : name);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("DMC search results")
                .data(results)
                .build());
    }
}
