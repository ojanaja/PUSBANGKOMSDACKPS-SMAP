package com.smap.api.repository;

import com.smap.api.domain.entity.Peminjaman;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PeminjamanRepository extends JpaRepository<Peminjaman, Long> {
    long countByStatusAndDeletedFalse(Peminjaman.StatusPeminjaman status);
}
