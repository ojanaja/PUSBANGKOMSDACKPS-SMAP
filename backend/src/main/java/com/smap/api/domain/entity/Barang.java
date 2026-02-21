package com.smap.api.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "barang")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Barang extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "kode_barang", nullable = false)
    private String kodeBarang;

    @Column(name = "nup")
    private String nup;

    @Column(name = "nama_barang", nullable = false)
    private String namaBarang;

    @Column(name = "merk_type")
    private String merkType;

    @Column(name = "ukuran")
    private String ukuran;

    @Column(name = "jenis_barang")
    private String jenisBarang;

    @Column(name = "gudang")
    private String gudang;

    @Column(name = "lokasi")
    private String lokasi;

    @Column(name = "koordinat_peta")
    private String koordinatPeta;

    @Column(name = "bukti_kepemilikan")
    private String buktiKepemilikan;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KondisiBarang kondisi;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusBarang status;

    @Column(name = "tgl_perolehan")
    private LocalDate tglPerolehan;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "barcode_produk")
    private String barcodeProduk;

    @Column(name = "barcode_sn")
    private String barcodeSn;

    @Column(columnDefinition = "TEXT")
    private String keterangan;

    @Column(name = "tgl_surat")
    private LocalDate tglSurat;

    @Column(name = "nopol")
    private String nopol;

    @Column(name = "pemakai")
    private String pemakai;

    public enum KondisiBarang {
        BAIK, RUSAK_RINGAN, RUSAK_BERAT, HILANG
    }

    public enum StatusBarang {
        TERSEDIA, DIPINJAM, DIRAWAT, RUSAK, HILANG
    }
}
