package com.hotel_bidding.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminNote {
    private String noteId;
    private String adminId;
    private String adminUsername;
    private String content;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
