package com.smap.api.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "transaksi_peminjaman")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Peminjaman extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "no_register", nullable = false, unique = true)
    private String noRegister;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "peminjam_id", nullable = false)
    private User peminjam;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "penanggung_jawab_id")
    private User penanggungJawab;

    @Column(nullable = false)
    private String keperluan;

    @Column(columnDefinition = "TEXT")
    private String keterangan;

    @Column(name = "tgl_pinjam", nullable = false)
    private LocalDate tglPinjam;

    @Column(name = "tgl_kembali_rencana")
    private LocalDate tglKembaliRencana;

    @Column(name = "tgl_kembali_aktual")
    private LocalDate tglKembaliAktual;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPeminjaman status;

    @Column(name = "berita_acara_url")
    private String beritaAcaraUrl;

    @OneToMany(mappedBy = "peminjaman", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PeminjamanDetail> detailBarang = new ArrayList<>();

    public enum StatusPeminjaman {
        DIPINJAM, SELESAI
    }
}
