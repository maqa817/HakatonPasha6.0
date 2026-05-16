package com.freshguard.admin.web.dto;

import java.util.List;

public record StoreResponse(
        String id,
        String name,
        String city,
        String regionCode,
        List<DepartmentResponse> departments
) {
}
