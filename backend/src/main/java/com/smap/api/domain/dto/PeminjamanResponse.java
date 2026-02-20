package com.smap.api.domain.dto;

import com.smap.api.domain.entity.Peminjaman;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class PeminjamanResponse {
    private Long id;
    private String noRegister;
    private Long peminjamId;
    private String peminjamName;
    private Long penanggungJawabId;
    private String penanggungJawabName;

    private String keperluan;
    private String keterangan;
    private LocalDate tglPinjam;
    private LocalDate tglKembaliRencana;
    private LocalDate tglKembaliAktual;
    private Peminjaman.StatusPeminjaman status;
    private String beritaAcaraUrl;

    private List<PeminjamanDetailResponse> detailBarang;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PeminjamanResponse fromEntity(Peminjaman peminjaman) {
        return PeminjamanResponse.builder()
                .id(peminjaman.getId())
                .noRegister(peminjaman.getNoRegister())
                .peminjamId(peminjaman.getPeminjam().getId())
                .peminjamName(peminjaman.getPeminjam().getName())
                .penanggungJawabId(
                        peminjaman.getPenanggungJawab() != null ? peminjaman.getPenanggungJawab().getId() : null)
                .penanggungJawabName(
                        peminjaman.getPenanggungJawab() != null ? peminjaman.getPenanggungJawab().getName() : null)
                .keperluan(peminjaman.getKeperluan())
                .keterangan(peminjaman.getKeterangan())
                .tglPinjam(peminjaman.getTglPinjam())
                .tglKembaliRencana(peminjaman.getTglKembaliRencana())
                .tglKembaliAktual(peminjaman.getTglKembaliAktual())
                .status(peminjaman.getStatus())
                .beritaAcaraUrl(peminjaman.getBeritaAcaraUrl())
                .detailBarang(peminjaman.getDetailBarang().stream()
                        .map(PeminjamanDetailResponse::fromEntity)
                        .collect(Collectors.toList()))
                .createdAt(peminjaman.getCreatedAt())
                .updatedAt(peminjaman.getUpdatedAt())
                .build();
    }
}
