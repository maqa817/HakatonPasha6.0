package com.freshguard.admin.service;

import com.freshguard.admin.model.Department;
import com.freshguard.admin.model.FoodCategory;
import com.freshguard.admin.model.Store;
import com.freshguard.admin.web.dto.DepartmentOverviewDto;
import com.freshguard.admin.web.dto.StoreOverviewDto;
import com.freshguard.admin.web.dto.OverviewSummaryDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OverviewService {

    private final StoreService storeService;

    public OverviewService(StoreService storeService) {
        this.storeService = storeService;
    }

    /**
     * Mock metrics aligned with pitch: fruit ~9x target, vegetables ~14x vs 0.5% company target.
     */
    public OverviewSummaryDto buildSummary() {
        List<Store> stores = storeService.listStores();
        List<StoreOverviewDto> rows = new ArrayList<>();
        int totalCritical = 0;
        for (Store s : stores) {
            List<DepartmentOverviewDto> deptRows = new ArrayList<>();
            int storeCritical = 0;
            double wasteAgg = 0;
            int deptCount = 0;
            for (Department d : s.getDepartments()) {
                MockMetric m = mockForDepartment(d);
                wasteAgg += m.wastePercent;
                deptCount++;
                storeCritical += m.criticalSkus;
                deptRows.add(new DepartmentOverviewDto(
                        d.getId(),
                        d.getName(),
                        d.getHeadName(),
                        d.getCategories().stream().map(FoodCategory::name).toList(),
                        m.wastePercent,
                        m.vsTargetMultiplier,
                        m.criticalSkus,
                        m.status
                ));
            }
            double avgWaste = deptCount == 0 ? 0 : wasteAgg / deptCount;
            totalCritical += storeCritical;
            String status = storeCritical >= 4 ? "CRITICAL" : storeCritical >= 2 ? "WATCH" : "OK";
            rows.add(new StoreOverviewDto(
                    s.getId(),
                    s.getName(),
                    s.getCity(),
                    s.getRegionCode(),
                    round1(avgWaste),
                    storeCritical,
                    status,
                    deptRows
            ));
        }
        return new OverviewSummaryDto(
                rows.size(),
                186_000,
                totalCritical,
                "Son 4 həftə — tərəvəz ziyan dinamikası yüksələn trend (mock). Meyvə şöbəsi hədəfə nisbətən 9x, tərəvəz 14x (Bravo pitch data).",
                rows
        );
    }

    private static MockMetric mockForDepartment(Department d) {
        boolean fruit = d.getCategories().contains(FoodCategory.FRUIT);
        boolean veg = d.getCategories().contains(FoodCategory.VEGETABLE);
        if (fruit) {
            return new MockMetric(4.5, 9.0, 5, "FRUIT_HIGH");
        }
        if (veg) {
            return new MockMetric(7.2, 14.0, 6, "VEG_HIGH");
        }
        if (d.getCategories().contains(FoodCategory.DAIRY)) {
            return new MockMetric(1.1, 2.2, 2, "MODERATE");
        }
        return new MockMetric(0.6, 1.2, 1, "OK");
    }

    private static double round1(double v) {
        return Math.round(v * 10.0) / 10.0;
    }

    private record MockMetric(double wastePercent, double vsTargetMultiplier, int criticalSkus, String status) {
    }
}
