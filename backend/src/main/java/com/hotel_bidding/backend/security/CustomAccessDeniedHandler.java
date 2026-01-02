package com.hotel_bidding.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Custom handler for 403 Access Denied errors.
 * This occurs when a user is authenticated but lacks the required role/authority for a resource.
 */
@Slf4j
@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException, ServletException {
        
        String requestUri = request.getRequestURI();
        String method = request.getMethod();
        String remoteAddr = request.getRemoteAddr();
        
        // Get the authenticated user details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth != null ? auth.getName() : "anonymous";
        String authorities = auth != null ? auth.getAuthorities().toString() : "none";
        
        log.error("Access Denied for user '{}' with authorities {} on {} {} from {}: {}", 
                username, authorities, method, requestUri, remoteAddr, accessDeniedException.getMessage());
        log.debug("Access Denied Details - User: {}, Authorities: {}, RequestURI: {}, Method: {}", 
                username, authorities, requestUri, method);

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", HttpServletResponse.SC_FORBIDDEN);
        body.put("error", "Forbidden");
        body.put("message", "Access Denied: You don't have permission to access this resource");
        body.put("details", String.format("User '%s' with role(s) %s cannot access %s %s", 
                username, authorities, method, requestUri));
        body.put("path", request.getServletPath());
        body.put("requestUri", requestUri);
        body.put("method", method);
        body.put("userRole", authorities);

        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(response.getOutputStream(), body);
    }
}
