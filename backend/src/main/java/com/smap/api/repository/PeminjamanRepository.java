package com.smap.api.repository;

import com.smap.api.domain.entity.Peminjaman;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PeminjamanRepository extends JpaRepository<Peminjaman, Long> {
    long countByStatusAndDeletedFalse(Peminjaman.StatusPeminjaman status);

    Page<Peminjaman> findByPeminjamAndDeletedFalse(com.smap.api.domain.entity.User peminjam, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Peminjaman p JOIN p.detailBarang pd WHERE pd.barang.id = :barangId AND p.deleted = false ORDER BY p.createdAt DESC")
    List<Peminjaman> findHistoryByBarangId(@Param("barangId") Long barangId);

    @Query("SELECT DISTINCT p FROM Peminjaman p JOIN p.detailBarang pd WHERE pd.barang.id = :barangId AND p.deleted = false")
    Page<Peminjaman> findHistoryByBarangIdPaged(@Param("barangId") Long barangId, Pageable pageable);
}
