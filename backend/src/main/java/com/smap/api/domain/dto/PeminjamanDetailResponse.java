package com.smap.api.domain.dto;

import com.smap.api.domain.entity.Barang;
import com.smap.api.domain.entity.PeminjamanDetail;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PeminjamanDetailResponse {
    private Long id;
    private Long barangId;
    private String namaBarang;
    private String kodeBarang;
    private Barang.KondisiBarang kondisiPinjam;
    private Barang.KondisiBarang kondisiKembali;
    private String keterangan;

    public static PeminjamanDetailResponse fromEntity(PeminjamanDetail detail) {
        return PeminjamanDetailResponse.builder()
                .id(detail.getId())
                .barangId(detail.getBarang().getId())
                .namaBarang(detail.getBarang().getNamaBarang())
                .kodeBarang(detail.getBarang().getKodeBarang())
                .kondisiPinjam(detail.getKondisiPinjam())
                .kondisiKembali(detail.getKondisiKembali())
                .keterangan(detail.getKeterangan())
                .build();
    }
}
