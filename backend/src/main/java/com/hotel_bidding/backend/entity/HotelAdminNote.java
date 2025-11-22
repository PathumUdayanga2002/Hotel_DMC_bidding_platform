package com.hotel_bidding.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Admin note for internal hotel profile tracking
 * This is an embedded document, not visible to hotel users
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelAdminNote {
    private String noteId;
    private String adminId;
    private String adminUsername;
    private String content;
    private LocalDateTime createdAt;
}
