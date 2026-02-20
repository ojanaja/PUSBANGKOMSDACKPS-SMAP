package com.smap.api.service;

import com.smap.api.domain.dto.PagedResponse;
import com.smap.api.domain.dto.PerawatanDetailRequestDto;
import com.smap.api.domain.dto.PerawatanDetailSelesaiDto;
import com.smap.api.domain.dto.PerawatanRequest;
import com.smap.api.domain.dto.PerawatanResponse;
import com.smap.api.domain.dto.PerawatanSelesaiRequest;
import com.smap.api.domain.entity.Barang;
import com.smap.api.domain.entity.Perawatan;
import com.smap.api.domain.entity.PerawatanDetail;
import com.smap.api.domain.entity.User;
import com.smap.api.exception.ResourceNotFoundException;
import com.smap.api.repository.BarangRepository;
import com.smap.api.repository.PerawatanRepository;
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
public class PerawatanService {

    private final PerawatanRepository perawatanRepository;
    private final BarangRepository barangRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public PagedResponse<PerawatanResponse> getAllPerawatan(int page, int size, String sortDir, String sortBy) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Perawatan> perawatanPage = perawatanRepository.findAll(pageable);
        return PagedResponse.of(perawatanPage.map(PerawatanResponse::fromEntity));
    }

    @Transactional(readOnly = true)
    public PerawatanResponse getPerawatanById(Long id) {
        Perawatan perawatan = perawatanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Perawatan dengan ID " + id + " tidak ditemukan"));
        if (perawatan.isDeleted()) {
            throw new ResourceNotFoundException("Perawatan dengan ID " + id + " telah dihapus");
        }
        return PerawatanResponse.fromEntity(perawatan);
    }

    @CacheEvict(value = "dashboardData", allEntries = true)
    @Transactional
    public PerawatanResponse ajukanPerawatan(PerawatanRequest request, String username) {
        User pengaju = userRepository.findByUsernameAndDeletedFalse(username)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));

        Perawatan perawatan = Perawatan.builder()
                .noRegister("PRW-" + LocalDate.now().getYear() + "-"
                        + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .hal(request.getHal())
                .diajukanOleh(pengaju)
                .keterangan(request.getKeterangan())
                .tglService(LocalDate.now())
                .tglSelesaiRencana(request.getTglSelesaiRencana())
                .status(Perawatan.StatusPerawatan.PERAWATAN)
                .build();

        List<PerawatanDetail> details = new ArrayList<>();
        for (PerawatanDetailRequestDto detailReq : request.getDetails()) {
            Barang barang = barangRepository.findById(detailReq.getBarangId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Barang ID " + detailReq.getBarangId() + " tidak ditemukan"));

            if (barang.isDeleted() || !barang.getStatus().equals(Barang.StatusBarang.TERSEDIA)) {
                throw new IllegalStateException(
                        "Barang " + barang.getNamaBarang() + " sedang tidak tersedia untuk dirawat");
            }

            barang.setStatus(Barang.StatusBarang.DIRAWAT);
            barangRepository.save(barang);

            PerawatanDetail detail = PerawatanDetail.builder()
                    .perawatan(perawatan)
                    .barang(barang)
                    .gejala(detailReq.getGejala())
                    .build();
            details.add(detail);
        }

        perawatan.setDetailBarang(details);
        Perawatan saved = perawatanRepository.save(perawatan);
        return PerawatanResponse.fromEntity(saved);
    }

    @CacheEvict(value = "dashboardData", allEntries = true)
    @Transactional
    public PerawatanResponse selesaiPerawatan(Long id, PerawatanSelesaiRequest request, String username) {
        Perawatan perawatan = perawatanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data perawatan tidak ditemukan"));

        if (perawatan.getStatus().equals(Perawatan.StatusPerawatan.SELESAI)) {
            return PerawatanResponse.fromEntity(perawatan);
        }

        User penanggungJawab = userRepository.findByUsernameAndDeletedFalse(username)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));

        perawatan.setPenanggungJawab(penanggungJawab);
        perawatan.setTglSelesaiAktual(LocalDate.now());
        perawatan.setStatus(Perawatan.StatusPerawatan.SELESAI);
        perawatan.setKeterangan(perawatan.getKeterangan() + " | Penyelesaian: " + request.getKeterangan());

        for (PerawatanDetail detail : perawatan.getDetailBarang()) {
            Barang barang = detail.getBarang();
            PerawatanDetailSelesaiDto selesaiInfo = request.getDetailSelesaiMap().get(barang.getId());

            if (selesaiInfo != null) {
                detail.setPerbaikan(selesaiInfo.getPerbaikan());
                detail.setGaransi(selesaiInfo.getGaransi());
                detail.setKondisiKembali(selesaiInfo.getKondisiKembali());

                barang.setStatus(Barang.StatusBarang.TERSEDIA);
                barang.setKondisi(selesaiInfo.getKondisiKembali());
                barangRepository.save(barang);
            }
        }

        Perawatan saved = perawatanRepository.save(perawatan);
        return PerawatanResponse.fromEntity(saved);
    }
}
