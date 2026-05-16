package com.freshguard.admin.web.dto;

public record LoginResponse(
        String accessToken,
        long expiresInSeconds,
        String role,
        String displayName
) {
}
