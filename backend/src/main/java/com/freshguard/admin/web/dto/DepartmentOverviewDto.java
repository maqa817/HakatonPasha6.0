package com.freshguard.admin.web.dto;

import java.util.List;

public record DepartmentOverviewDto(
        String departmentId,
        String departmentName,
        String headName,
        List<String> categories,
        double wastePercent,
        double wasteVsTargetMultiplier,
        int criticalProductAlerts,
        String statusKey
) {
}
