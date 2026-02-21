package com.smap.api.service;

import com.smap.api.domain.dto.PagedResponse;
import com.smap.api.domain.dto.PeminjamanKembaliRequest;
import com.smap.api.domain.dto.PeminjamanRequest;
import com.smap.api.domain.dto.PeminjamanResponse;
import com.smap.api.domain.entity.Barang;
import com.smap.api.domain.entity.Peminjaman;
import com.smap.api.domain.entity.PeminjamanDetail;
import com.smap.api.domain.entity.User;
import com.smap.api.exception.ResourceNotFoundException;
import com.smap.api.repository.BarangRepository;
import com.smap.api.repository.PeminjamanRepository;
import com.smap.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PeminjamanService {

    private final PeminjamanRepository peminjamanRepository;
    private final BarangRepository barangRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public PagedResponse<PeminjamanResponse> getAllPeminjaman(int page, int size, String sortDir, String sortBy) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Peminjaman> peminjamanPage = peminjamanRepository.findAll(pageable);
        return PagedResponse.of(peminjamanPage.map(PeminjamanResponse::fromEntity));
    }

    @Transactional(readOnly = true)
    public PeminjamanResponse getPeminjamanById(Long id) {
        Peminjaman peminjaman = peminjamanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Peminjaman dengan ID " + id + " tidak ditemukan"));
        if (peminjaman.isDeleted()) {
            throw new ResourceNotFoundException("Peminjaman dengan ID " + id + " telah dihapus");
        }
        return PeminjamanResponse.fromEntity(peminjaman);
    }

    @CacheEvict(value = "dashboardData", allEntries = true)
    @Transactional
    public PeminjamanResponse pinjamBarang(PeminjamanRequest request, String username) {
        User peminjam = userRepository.findByUsernameAndDeletedFalse(username)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));

        Peminjaman peminjaman = Peminjaman.builder()
                .noRegister("PMJ-" + LocalDate.now().getYear() + "-"
                        + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .peminjam(peminjam)
                .keperluan(request.getKeperluan())
                .keterangan(request.getKeterangan())
                .tglPinjam(LocalDate.now())
                .tglKembaliRencana(request.getTglKembaliRencana())
                .status(Peminjaman.StatusPeminjaman.DIPINJAM)
                .build();

        List<PeminjamanDetail> details = new ArrayList<>();
        for (Long barangId : request.getBarangIds()) {
            Barang barang = barangRepository.findById(barangId)
                    .orElseThrow(() -> new ResourceNotFoundException("Barang ID " + barangId + " tidak ditemukan"));

            if (barang.isDeleted() || !barang.getStatus().equals(Barang.StatusBarang.TERSEDIA)) {
                throw new IllegalStateException("Barang " + barang.getNamaBarang() + " tidak tersedia untuk dipinjam");
            }

            barang.setStatus(Barang.StatusBarang.DIPINJAM);
            barangRepository.save(barang);

            PeminjamanDetail detail = PeminjamanDetail.builder()
                    .peminjaman(peminjaman)
                    .barang(barang)
                    .kondisiPinjam(barang.getKondisi())
                    .keterangan(request.getKeterangan())
                    .build();
            details.add(detail);
        }

        peminjaman.setDetailBarang(details);
        Peminjaman saved = peminjamanRepository.save(peminjaman);
        return PeminjamanResponse.fromEntity(saved);
    }

    @CacheEvict(value = "dashboardData", allEntries = true)
    @Transactional
    public PeminjamanResponse kembalikanBarang(Long id, PeminjamanKembaliRequest request,
            org.springframework.web.multipart.MultipartFile file, String username) {
        Peminjaman peminjaman = peminjamanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Peminjaman tidak ditemukan"));

        if (peminjaman.getStatus().equals(Peminjaman.StatusPeminjaman.SELESAI)) {
            return PeminjamanResponse.fromEntity(peminjaman);
        }

        User penanggungJawab = userRepository.findByUsernameAndDeletedFalse(username)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));

        if (file != null && !file.isEmpty()) {
            String fileUrl = fileStorageService.storeFile(file);
            peminjaman.setBeritaAcaraUrl(fileUrl);
        }

        peminjaman.setPenanggungJawab(penanggungJawab);
        peminjaman.setTglKembaliAktual(LocalDate.now());
        peminjaman.setStatus(Peminjaman.StatusPeminjaman.SELESAI);
        peminjaman.setKeterangan(peminjaman.getKeterangan() + " | Pengembalian: " + request.getKeterangan());

        for (PeminjamanDetail detail : peminjaman.getDetailBarang()) {
            Barang barang = detail.getBarang();
            Barang.KondisiBarang kondisiKembali = request.getKondisiKembaliMap().getOrDefault(barang.getId(),
                    detail.getKondisiPinjam());

            detail.setKondisiKembali(kondisiKembali);

            barang.setStatus(Barang.StatusBarang.TERSEDIA);
            barang.setKondisi(kondisiKembali);
            barangRepository.save(barang);
        }

        Peminjaman saved = peminjamanRepository.save(peminjaman);
        return PeminjamanResponse.fromEntity(saved);
    }
}
