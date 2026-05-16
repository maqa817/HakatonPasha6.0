package com.freshguard.admin.web.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateStoreRequest(
        @NotBlank String name,
        @NotBlank String city,
        @NotBlank String regionCode
) {
}
