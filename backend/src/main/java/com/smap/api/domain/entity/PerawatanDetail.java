package com.smap.api.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "transaksi_perawatan_detail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerawatanDetail extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "perawatan_id", nullable = false)
    private Perawatan perawatan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barang_id", nullable = false)
    private Barang barang;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String gejala;

    @Column(columnDefinition = "TEXT")
    private String perbaikan;

    @Column(name = "garansi_until")
    private java.time.LocalDate garansi;

    @Column(columnDefinition = "TEXT")
    private String keterangan;

    @Enumerated(EnumType.STRING)
    @Column(name = "kondisi_kembali")
    private Barang.KondisiBarang kondisiKembali;
}
