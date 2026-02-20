package com.smap.api.service;

import com.smap.api.domain.dto.DashboardResponse;
import com.smap.api.domain.entity.Barang;
import com.smap.api.domain.entity.Peminjaman;
import com.smap.api.domain.entity.Perawatan;
import com.smap.api.repository.BarangRepository;
import com.smap.api.repository.PeminjamanRepository;
import com.smap.api.repository.PerawatanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BarangRepository barangRepository;
    private final PeminjamanRepository peminjamanRepository;
    private final PerawatanRepository perawatanRepository;

    @Cacheable(value = "dashboardData", key = "'summary'")
    @Transactional(readOnly = true)
    public DashboardResponse getDashboardSummary() {
        long totalBarang = barangRepository.countByDeletedFalse();
        long tersedia = barangRepository.countByStatusAndDeletedFalse(Barang.StatusBarang.TERSEDIA);
        long dipinjam = barangRepository.countByStatusAndDeletedFalse(Barang.StatusBarang.DIPINJAM);
        long dirawat = barangRepository.countByStatusAndDeletedFalse(Barang.StatusBarang.DIRAWAT);
        long rusak = barangRepository.countByStatusAndDeletedFalse(Barang.StatusBarang.RUSAK);

        long peminjamanAktif = peminjamanRepository.countByStatusAndDeletedFalse(Peminjaman.StatusPeminjaman.DIPINJAM);
        long perawatanAktif = perawatanRepository.countByStatusAndDeletedFalse(Perawatan.StatusPerawatan.PERAWATAN);

        return DashboardResponse.builder()
                .totalBarang(totalBarang)
                .barangTersedia(tersedia)
                .barangDipinjam(dipinjam)
                .barangDirawat(dirawat)
                .barangRusak(rusak)
                .peminjamanAktif(peminjamanAktif)
                .perawatanAktif(perawatanAktif)
                .build();
    }
}
