package com.freshguard.admin.web.dto;

import java.util.List;

public record OverviewSummaryDto(
        int totalStores,
        int monthlyGoodsReceptionsMock,
        int totalCriticalAlerts,
        String trendNoteAz,
        List<StoreOverviewDto> stores
) {
}
