package com.freshguard.admin.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateRegionalManagerRequest(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotBlank String region,
        @NotBlank @Size(min = 8, max = 72) String password
) {
}
