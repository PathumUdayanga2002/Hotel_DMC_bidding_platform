package com.hotel_bidding.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {
    private String secret;
    private AccessToken accessToken = new AccessToken();
    private RefreshToken refreshToken = new RefreshToken();

    @Data
    public static class AccessToken {
        private Long expiration;
    }

    @Data
    public static class RefreshToken {
        private Long expiration;
    }
}
