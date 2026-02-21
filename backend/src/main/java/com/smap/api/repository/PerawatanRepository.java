package com.smap.api.repository;

import com.smap.api.domain.entity.Perawatan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PerawatanRepository extends JpaRepository<Perawatan, Long> {
    long countByStatusAndDeletedFalse(Perawatan.StatusPerawatan status);

    @Query("SELECT DISTINCT p FROM Perawatan p JOIN p.detailBarang pd WHERE pd.barang.id = :barangId AND p.deleted = false ORDER BY p.createdAt DESC")
    List<Perawatan> findHistoryByBarangId(@Param("barangId") Long barangId);

    @Query("SELECT DISTINCT p FROM Perawatan p JOIN p.detailBarang pd WHERE pd.barang.id = :barangId AND p.deleted = false")
    Page<Perawatan> findHistoryByBarangIdPaged(@Param("barangId") Long barangId, Pageable pageable);
}
