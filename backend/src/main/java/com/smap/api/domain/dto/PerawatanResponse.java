package com.smap.api.domain.dto;

import com.smap.api.domain.entity.Perawatan;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class PerawatanResponse {
        private Long id;
        private String noRegister;
        private String hal;

        private Long diajukanOlehId;
        private String diajukanOlehName;
        private String diajukanOlehNip;
        private String diajukanOlehJabatan;
        private String diajukanOlehBidang;

        private Long penanggungJawabId;
        private String penanggungJawabName;
        private String penanggungJawabNip;
        private String penanggungJawabJabatan;
        private String penanggungJawabBidang;

        private String keterangan;
        private LocalDate tglService;
        private LocalDate tglSelesaiRencana;
        private LocalDate tglSelesaiAktual;
        private Perawatan.StatusPerawatan status;

        private List<PerawatanDetailResponse> detailBarang;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static PerawatanResponse fromEntity(Perawatan perawatan) {
                return PerawatanResponse.builder()
                                .id(perawatan.getId())
                                .noRegister(perawatan.getNoRegister())
                                .hal(perawatan.getHal())
                                .diajukanOlehId(perawatan.getDiajukanOleh().getId())
                                .diajukanOlehName(perawatan.getDiajukanOleh().getName())
                                .diajukanOlehNip(perawatan.getDiajukanOleh().getNip())
                                .diajukanOlehJabatan(perawatan.getDiajukanOleh().getJabatan())
                                .diajukanOlehBidang(perawatan.getDiajukanOleh().getBidang())
                                .penanggungJawabId(
                                                perawatan.getPenanggungJawab() != null
                                                                ? perawatan.getPenanggungJawab().getId()
                                                                : null)
                                .penanggungJawabName(
                                                perawatan.getPenanggungJawab() != null
                                                                ? perawatan.getPenanggungJawab().getName()
                                                                : null)
                                .penanggungJawabNip(
                                                perawatan.getPenanggungJawab() != null
                                                                ? perawatan.getPenanggungJawab().getNip()
                                                                : null)
                                .penanggungJawabJabatan(
                                                perawatan.getPenanggungJawab() != null
                                                                ? perawatan.getPenanggungJawab().getJabatan()
                                                                : null)
                                .penanggungJawabBidang(
                                                perawatan.getPenanggungJawab() != null
                                                                ? perawatan.getPenanggungJawab().getBidang()
                                                                : null)
                                .keterangan(perawatan.getKeterangan())
                                .tglService(perawatan.getTglService())
                                .tglSelesaiRencana(perawatan.getTglSelesaiRencana())
                                .tglSelesaiAktual(perawatan.getTglSelesaiAktual())
                                .status(perawatan.getStatus())
                                .detailBarang(perawatan.getDetailBarang().stream()
                                                .map(PerawatanDetailResponse::fromEntity)
                                                .collect(Collectors.toList()))
                                .createdAt(perawatan.getCreatedAt())
                                .updatedAt(perawatan.getUpdatedAt())
                                .build();
        }
}
