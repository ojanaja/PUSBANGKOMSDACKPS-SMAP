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
        private String peminjamNip;
        private String peminjamJabatan;
        private String peminjamBidang;

        private Long penanggungJawabId;
        private String penanggungJawabName;
        private String penanggungJawabNip;
        private String penanggungJawabJabatan;
        private String penanggungJawabBidang;

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
                                .peminjamNip(peminjaman.getPeminjam().getNip())
                                .peminjamJabatan(peminjaman.getPeminjam().getJabatan())
                                .peminjamBidang(peminjaman.getPeminjam().getBidang())
                                .penanggungJawabId(
                                                peminjaman.getPenanggungJawab() != null
                                                                ? peminjaman.getPenanggungJawab().getId()
                                                                : null)
                                .penanggungJawabName(
                                                peminjaman.getPenanggungJawab() != null
                                                                ? peminjaman.getPenanggungJawab().getName()
                                                                : peminjaman.getPenanggungJawabInputName())
                                .penanggungJawabNip(
                                                peminjaman.getPenanggungJawab() != null
                                                                ? peminjaman.getPenanggungJawab().getNip()
                                                                : peminjaman.getPenanggungJawabInputNip())
                                .penanggungJawabJabatan(
                                                peminjaman.getPenanggungJawab() != null
                                                                ? peminjaman.getPenanggungJawab().getJabatan()
                                                                : peminjaman.getPenanggungJawabInputJabatan())
                                .penanggungJawabBidang(
                                                peminjaman.getPenanggungJawab() != null
                                                                ? peminjaman.getPenanggungJawab().getBidang()
                                                                : null)
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
