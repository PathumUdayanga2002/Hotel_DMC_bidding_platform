package com.hotel_bidding.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "password_reset_tokens")
public class PasswordResetToken {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed(unique = true)
    private String tokenHash;

    @Indexed(name = "password_reset_token_expiry_index", expireAfterSeconds = 0)
    private LocalDateTime expiresAt;

    private boolean used;

    private LocalDateTime usedAt;

    private LocalDateTime createdAt;
}
