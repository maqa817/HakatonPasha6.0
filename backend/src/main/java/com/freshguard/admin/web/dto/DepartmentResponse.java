package com.freshguard.admin.web.dto;

import java.util.List;

public record DepartmentResponse(
        String id,
        String storeId,
        String name,
        String headName,
        List<String> categories
) {
}
