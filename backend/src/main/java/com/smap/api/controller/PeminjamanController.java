package com.smap.api.controller;

import com.smap.api.domain.dto.ApiResponse;
import com.smap.api.domain.dto.PagedResponse;
import com.smap.api.domain.dto.PeminjamanKembaliRequest;
import com.smap.api.domain.dto.PeminjamanRequest;
import com.smap.api.domain.dto.PeminjamanResponse;
import com.smap.api.service.PeminjamanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transaksi/peminjaman")
@RequiredArgsConstructor
public class PeminjamanController {

    private final PeminjamanService peminjamanService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PETUGAS', 'PEMINJAM')")
    public ResponseEntity<ApiResponse<PagedResponse<PeminjamanResponse>>> getAllPeminjaman(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<PeminjamanResponse> response = peminjamanService.getAllPeminjaman(page, size, sortDir, sortBy);
        return ResponseEntity.ok(ApiResponse.success(response, "Berhasil memuat data peminjaman"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PETUGAS', 'PEMINJAM')")
    public ResponseEntity<ApiResponse<PeminjamanResponse>> getPeminjamanById(@PathVariable Long id) {
        PeminjamanResponse response = peminjamanService.getPeminjamanById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Berhasil memuat detail peminjaman"));
    }

    @PostMapping("/pinjam")
    @PreAuthorize("hasAnyRole('ADMIN', 'PETUGAS', 'PEMINJAM')")
    public ResponseEntity<ApiResponse<PeminjamanResponse>> pinjamBarang(
            @Valid @RequestBody PeminjamanRequest request, Authentication authentication) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        PeminjamanResponse response = peminjamanService.pinjamBarang(request, userDetails.getUsername());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Berhasil mengajukan peminjaman barang"));
    }

    @PostMapping(value = "/{id}/kembali", consumes = { "multipart/form-data" })
    @PreAuthorize("hasAnyRole('ADMIN', 'PETUGAS')")
    public ResponseEntity<ApiResponse<PeminjamanResponse>> kembalikanBarang(
            @PathVariable Long id,
            @RequestPart("request") @Valid PeminjamanKembaliRequest request,
            @RequestPart(value = "file", required = false) org.springframework.web.multipart.MultipartFile file,
            Authentication authentication) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        PeminjamanResponse response = peminjamanService.kembalikanBarang(id, request, file, userDetails.getUsername());

        return ResponseEntity.ok(ApiResponse.success(response, "Berhasil menyelesaikan pengembalian barang"));
    }
}
