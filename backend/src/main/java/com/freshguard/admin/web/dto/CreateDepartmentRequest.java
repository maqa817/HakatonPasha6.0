package com.freshguard.admin.web.dto;

import com.freshguard.admin.model.FoodCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.Set;

public record CreateDepartmentRequest(
        @NotBlank String name,
        @NotBlank String headName,
        @NotEmpty Set<FoodCategory> categories
) {
}
