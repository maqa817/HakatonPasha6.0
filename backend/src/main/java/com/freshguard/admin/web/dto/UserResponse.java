package com.freshguard.admin.web.dto;

public record UserResponse(
        String userId,
        String firstName,
        String lastName,
        String region,
        String role,
        boolean active
) {
}
