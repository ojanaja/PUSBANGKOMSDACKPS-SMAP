package com.smap.api.controller;

import com.smap.api.service.LaporanService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/laporan")
@RequiredArgsConstructor
public class LaporanController {

    private final LaporanService laporanService;

    @GetMapping("/barang/csv")
    @PreAuthorize("hasAnyRole('ADMIN', 'PETUGAS')")
    public ResponseEntity<Resource> exportDaftarBarangCsv() {
        String filename = "laporan_master_barang.csv";
        InputStreamResource file = new InputStreamResource(laporanService.exportDaftarBarangCsv());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("application/csv"))
                .body(file);
    }
}
