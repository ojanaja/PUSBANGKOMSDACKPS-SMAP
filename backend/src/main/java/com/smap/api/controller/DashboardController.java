package com.smap.api.controller;

import com.smap.api.domain.dto.ApiResponse;
import com.smap.api.domain.dto.DashboardResponse;
import com.smap.api.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'PETUGAS', 'PEMINJAM')")
    public ResponseEntity<ApiResponse<DashboardResponse>> getSummary() {
        DashboardResponse summary = dashboardService.getDashboardSummary();
        return ResponseEntity.ok(ApiResponse.success(summary, "Berhasil memuat data dashboard"));
    }
}
