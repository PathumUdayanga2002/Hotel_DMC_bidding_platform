package com.hotel_bidding.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminNoteDTO {
    private String noteId;
    private String adminId;
    private String adminUsername;
    private String content;
    private LocalDateTime createdAt;
}
