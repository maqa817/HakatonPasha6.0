package com.freshguard.admin.web.dto;

import java.util.List;

public record StoreOverviewDto(
        String storeId,
        String storeName,
        String city,
        String regionCode,
        double avgWastePercent,
        int criticalAlerts,
        String status,
        List<DepartmentOverviewDto> departments
) {
}
