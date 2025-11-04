package com.hotel_bidding.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for adding admin note to hotel profile
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelAdminNoteRequest {
    @NotBlank(message = "Note content is required")
    private String content;
}
