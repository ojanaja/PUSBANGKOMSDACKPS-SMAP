package com.smap.api.service;

import com.smap.api.domain.dto.BarangRequest;
import com.smap.api.domain.dto.BarangResponse;
import com.smap.api.domain.dto.PagedResponse;
import com.smap.api.domain.entity.Barang;
import com.smap.api.exception.ResourceNotFoundException;
import com.smap.api.repository.BarangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BarangService {

    private final BarangRepository barangRepository;

    @Transactional(readOnly = true)
    public PagedResponse<BarangResponse> getAllBarang(int page, int size, String sortDir, String sortBy) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Barang> barangPage = barangRepository.findAll(pageable); 
        Page<BarangResponse> responsePage = barangPage.map(BarangResponse::fromEntity);
        return PagedResponse.of(responsePage);
    }

    @Transactional(readOnly = true)
    public BarangResponse getBarangById(Long id) {
        Barang barang = barangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Barang dengan ID " + id + " tidak ditemukan"));
        if (barang.isDeleted()) {
            throw new ResourceNotFoundException("Barang dengan ID " + id + " telah dihapus");
        }
        return BarangResponse.fromEntity(barang);
    }

    @CacheEvict(value = "dashboardData", allEntries = true)
    @Transactional
    public BarangResponse createBarang(BarangRequest request) {
        Barang barang = new Barang();
        mapRequestToEntity(request, barang);
        Barang saved = barangRepository.save(barang);
        return BarangResponse.fromEntity(saved);
    }

    @CacheEvict(value = "dashboardData", allEntries = true)
    @Transactional
    public BarangResponse updateBarang(Long id, BarangRequest request) {
        Barang barang = barangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Barang dengan ID " + id + " tidak ditemukan"));
        if (barang.isDeleted()) {
            throw new ResourceNotFoundException("Barang dengan ID " + id + " telah dihapus");
        }
        mapRequestToEntity(request, barang);
        Barang updated = barangRepository.save(barang);
        return BarangResponse.fromEntity(updated);
    }

    @CacheEvict(value = "dashboardData", allEntries = true)
    @Transactional
    public void deleteBarang(Long id) {
        Barang barang = barangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Barang dengan ID " + id + " tidak ditemukan"));
        barang.setDeleted(true);
        barangRepository.save(barang);
    }

    private void mapRequestToEntity(BarangRequest req, Barang entity) {
        entity.setKodeBarang(req.getKodeBarang());
        entity.setNup(req.getNup());
        entity.setNamaBarang(req.getNamaBarang());
        entity.setMerkType(req.getMerkType());
        entity.setUkuran(req.getUkuran());
        entity.setJenisBarang(req.getJenisBarang());
        entity.setGudang(req.getGudang());
        entity.setLokasi(req.getLokasi());
        entity.setKoordinatPeta(req.getKoordinatPeta());
        entity.setBuktiKepemilikan(req.getBuktiKepemilikan());
        entity.setKondisi(req.getKondisi());
        entity.setStatus(req.getStatus());
        entity.setTglPerolehan(req.getTglPerolehan());
        entity.setPhotoUrl(req.getPhotoUrl());
        entity.setBarcodeProduk(req.getBarcodeProduk());
        entity.setBarcodeSn(req.getBarcodeSn());
        entity.setKeterangan(req.getKeterangan());
    }
}
