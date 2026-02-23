package com.smap.api.controller;

import com.smap.api.domain.dto.ApiResponse;
import com.smap.api.domain.dto.PagedResponse;
import com.smap.api.domain.dto.PerawatanRequest;
import com.smap.api.domain.dto.PerawatanResponse;
import com.smap.api.domain.dto.PerawatanSelesaiRequest;
import com.smap.api.service.PerawatanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transaksi/perawatan")
@RequiredArgsConstructor
public class PerawatanController {

    private final PerawatanService perawatanService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PEGAWAI')")
    public ResponseEntity<ApiResponse<PagedResponse<PerawatanResponse>>> getAllPerawatan(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<PerawatanResponse> response = perawatanService.getAllPerawatan(page, size, sortDir, sortBy);
        return ResponseEntity.ok(ApiResponse.success(response, "Berhasil memuat data perawatan"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PEGAWAI')")
    public ResponseEntity<ApiResponse<PerawatanResponse>> getPerawatanById(@PathVariable Long id) {
        PerawatanResponse response = perawatanService.getPerawatanById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Berhasil memuat detail perawatan"));
    }

    @PostMapping("/ajukan")
    @PreAuthorize("hasAnyRole('ADMIN', 'PEGAWAI')")
    public ResponseEntity<ApiResponse<PerawatanResponse>> ajukanPerawatan(
            @Valid @RequestBody PerawatanRequest request, Authentication authentication) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        PerawatanResponse response = perawatanService.ajukanPerawatan(request, userDetails.getUsername());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Berhasil mengajukan perawatan barang"));
    }

    @PostMapping("/{id}/selesai")
    @PreAuthorize("hasAnyRole('ADMIN', 'PEGAWAI')")
    public ResponseEntity<ApiResponse<PerawatanResponse>> selesaiPerawatan(
            @PathVariable Long id,
            @Valid @RequestBody PerawatanSelesaiRequest request,
            Authentication authentication) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        PerawatanResponse response = perawatanService.selesaiPerawatan(id, request, userDetails.getUsername());

        return ResponseEntity.ok(ApiResponse.success(response, "Berhasil menyelesaikan proses perawatan barang"));
    }
}
