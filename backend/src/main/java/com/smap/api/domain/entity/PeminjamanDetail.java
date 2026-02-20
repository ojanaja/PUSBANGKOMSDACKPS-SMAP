package com.smap.api.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "transaksi_peminjaman_detail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PeminjamanDetail extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "peminjaman_id", nullable = false)
    private Peminjaman peminjaman;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barang_id", nullable = false)
    private Barang barang;

    @Enumerated(EnumType.STRING)
    @Column(name = "kondisi_pinjam")
    private Barang.KondisiBarang kondisiPinjam;

    @Enumerated(EnumType.STRING)
    @Column(name = "kondisi_kembali")
    private Barang.KondisiBarang kondisiKembali;

    @Column(columnDefinition = "TEXT")
    private String keterangan;
}
