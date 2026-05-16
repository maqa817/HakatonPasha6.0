package com.freshguard.admin.web.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateRegionalManagerRequest(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotBlank String region,
        String newPassword
) {
}
