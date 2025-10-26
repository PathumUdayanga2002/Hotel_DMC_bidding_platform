package com.hotel_bidding.backend.dto.response;

import com.hotel_bidding.backend.constants.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String id;
    private String username;
    private String email;
    private UserRole role;
    private String message;
}
