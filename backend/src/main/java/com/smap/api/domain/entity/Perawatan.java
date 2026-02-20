package com.smap.api.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "transaksi_perawatan")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Perawatan extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "no_register", nullable = false, unique = true)
    private String noRegister;

    @Column(nullable = false)
    private String hal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diajukan_oleh_id", nullable = false)
    private User diajukanOleh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "penanggung_jawab_id")
    private User penanggungJawab;

    @Column(columnDefinition = "TEXT")
    private String keterangan;

    @Column(name = "tgl_service", nullable = false)
    private LocalDate tglService;

    @Column(name = "tgl_selesai_rencana")
    private LocalDate tglSelesaiRencana;

    @Column(name = "tgl_selesai_aktual")
    private LocalDate tglSelesaiAktual;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPerawatan status;

    @OneToMany(mappedBy = "perawatan", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PerawatanDetail> detailBarang = new ArrayList<>();

    public enum StatusPerawatan {
        PERAWATAN, SELESAI
    }
}
