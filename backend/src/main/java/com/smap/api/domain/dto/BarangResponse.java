package com.smap.api.domain.dto;

import com.smap.api.domain.entity.Barang;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class BarangResponse {
    private Long id;
    private String kodeBarang;
    private String nup;
    private String namaBarang;
    private String merkType;
    private String ukuran;
    private String jenisBarang;
    private String gudang;
    private String lokasi;
    private String koordinatPeta;
    private String buktiKepemilikan;
    private Barang.KondisiBarang kondisi;
    private Barang.StatusBarang status;
    private LocalDate tglPerolehan;
    private String photoUrl;
    private String barcodeProduk;
    private String barcodeSn;
    private String keterangan;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BarangResponse fromEntity(Barang barang) {
        return BarangResponse.builder()
                .id(barang.getId())
                .kodeBarang(barang.getKodeBarang())
                .nup(barang.getNup())
                .namaBarang(barang.getNamaBarang())
                .merkType(barang.getMerkType())
                .ukuran(barang.getUkuran())
                .jenisBarang(barang.getJenisBarang())
                .gudang(barang.getGudang())
                .lokasi(barang.getLokasi())
                .koordinatPeta(barang.getKoordinatPeta())
                .buktiKepemilikan(barang.getBuktiKepemilikan())
                .kondisi(barang.getKondisi())
                .status(barang.getStatus())
                .tglPerolehan(barang.getTglPerolehan())
                .photoUrl(barang.getPhotoUrl())
                .barcodeProduk(barang.getBarcodeProduk())
                .barcodeSn(barang.getBarcodeSn())
                .keterangan(barang.getKeterangan())
                .createdAt(barang.getCreatedAt())
                .updatedAt(barang.getUpdatedAt())
                .build();
    }
}
