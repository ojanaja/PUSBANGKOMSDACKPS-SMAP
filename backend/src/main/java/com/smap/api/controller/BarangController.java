package com.smap.api.controller;

import com.smap.api.domain.dto.ApiResponse;
import com.smap.api.domain.dto.BarangRequest;
import com.smap.api.domain.dto.BarangResponse;
import com.smap.api.domain.dto.PagedResponse;
import com.smap.api.service.BarangService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/barang")
@RequiredArgsConstructor
public class BarangController {

    private final BarangService barangService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PEGAWAI')")
    public ResponseEntity<ApiResponse<PagedResponse<BarangResponse>>> getAllBarang(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<BarangResponse> response = barangService.getAllBarang(page, size, sortDir, sortBy);
        return ResponseEntity.ok(ApiResponse.success(response, "Berhasil memuat data barang"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PEGAWAI')")
    public ResponseEntity<ApiResponse<BarangResponse>> getBarangById(@PathVariable Long id) {
        BarangResponse response = barangService.getBarangById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Berhasil memuat detail barang"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PEGAWAI')")
    public ResponseEntity<ApiResponse<BarangResponse>> createBarang(@Valid @RequestBody BarangRequest request) {
        BarangResponse response = barangService.createBarang(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Berhasil menambahkan barang"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PEGAWAI')")
    public ResponseEntity<ApiResponse<BarangResponse>> updateBarang(
            @PathVariable Long id, @Valid @RequestBody BarangRequest request) {
        BarangResponse response = barangService.updateBarang(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Berhasil memperbarui barang"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteBarang(@PathVariable Long id) {
        barangService.deleteBarang(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Berhasil menghapus barang"));
    }

    @GetMapping("/{id}/history-peminjaman")
    @PreAuthorize("hasAnyRole('ADMIN', 'PEGAWAI')")
    public ResponseEntity<ApiResponse<PagedResponse<com.smap.api.domain.dto.PeminjamanResponse>>> getHistoryPeminjaman(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<com.smap.api.domain.dto.PeminjamanResponse> response = barangService
                .getHistoryPeminjamanByBarangId(id, page, size);
        return ResponseEntity.ok(ApiResponse.success(response, "Berhasil memuat riwayat peminjaman barang"));
    }

    @GetMapping("/{id}/history-perawatan")
    @PreAuthorize("hasAnyRole('ADMIN', 'PEGAWAI')")
    public ResponseEntity<ApiResponse<PagedResponse<com.smap.api.domain.dto.PerawatanResponse>>> getHistoryPerawatan(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<com.smap.api.domain.dto.PerawatanResponse> response = barangService
                .getHistoryPerawatanByBarangId(id, page, size);
        return ResponseEntity.ok(ApiResponse.success(response, "Berhasil memuat riwayat perawatan barang"));
    }
}
