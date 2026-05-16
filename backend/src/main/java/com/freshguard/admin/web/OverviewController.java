package com.freshguard.admin.web;

import com.freshguard.admin.service.OverviewService;
import com.freshguard.admin.web.dto.OverviewSummaryDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/overview")
public class OverviewController {

    private final OverviewService overviewService;

    public OverviewController(OverviewService overviewService) {
        this.overviewService = overviewService;
    }

    @GetMapping("/summary")
    public OverviewSummaryDto summary() {
        return overviewService.buildSummary();
    }
}
