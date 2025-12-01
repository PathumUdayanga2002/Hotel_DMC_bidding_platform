package com.hotel_bidding.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminNoteRequest {
    
    @NotBlank(message = "Note content is required")
    private String content;
}
