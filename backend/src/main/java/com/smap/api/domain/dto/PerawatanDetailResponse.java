package com.smap.api.domain.dto;

import com.smap.api.domain.entity.Barang;
import com.smap.api.domain.entity.PerawatanDetail;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class PerawatanDetailResponse {
    private Long id;
    private Long barangId;
    private String namaBarang;
    private String kodeBarang;
    private String gejala;
    private String perbaikan;
    private LocalDate garansi;
    private Barang.KondisiBarang kondisiKembali;

    public static PerawatanDetailResponse fromEntity(PerawatanDetail detail) {
        return PerawatanDetailResponse.builder()
                .id(detail.getId())
                .barangId(detail.getBarang().getId())
                .namaBarang(detail.getBarang().getNamaBarang())
                .kodeBarang(detail.getBarang().getKodeBarang())
                .gejala(detail.getGejala())
                .perbaikan(detail.getPerbaikan())
                .garansi(detail.getGaransi())
                .kondisiKembali(detail.getKondisiKembali())
                .build();
    }
}
