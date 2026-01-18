package com.hotel_bidding.backend.config;

import com.hotel_bidding.backend.filter.SubscriptionFilter;
import com.hotel_bidding.backend.security.CustomAccessDeniedHandler;
import com.hotel_bidding.backend.security.JwtAuthenticationEntryPoint;
import com.hotel_bidding.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final SubscriptionFilter subscriptionFilter;
    private final CustomAccessDeniedHandler accessDeniedHandler;
    private final CorsConfig corsConfig;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/api/webhooks/**").permitAll()
                        .requestMatchers("/subscription/payhere-notify").permitAll() // PayHere webhook
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                        // Protected endpoints - Using hasAnyRole to support all role levels
                        // DMC users (legacy, super admin, staff) can view approved hotels
                        .requestMatchers("/hotel/approved-profiles").hasAnyRole("DMC_USER", "DMC_SUPER_ADMIN", "DMC_STAFF_ADMIN")
                        // Hotel endpoints - accessible by all hotel role types
                        .requestMatchers("/hotel/**").hasAnyRole("HOTEL_USER", "HOTEL_SUPER_ADMIN", "HOTEL_STAFF_ADMIN")
                        // DMC endpoints - accessible by all DMC role types
                        .requestMatchers("/dmc/**").hasAnyRole("DMC_USER", "DMC_SUPER_ADMIN", "DMC_STAFF_ADMIN")
                        // Admin endpoints - accessible by legacy ADMIN and PLATFORM_SUPER_ADMIN
                        .requestMatchers("/admin/**").hasAnyRole("ADMIN", "PLATFORM_SUPER_ADMIN")
                        // All other requests need authentication
                        .anyRequest().authenticated()
                );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterAfter(subscriptionFilter, JwtAuthenticationFilter.class);

        return http.build();
    }
}
