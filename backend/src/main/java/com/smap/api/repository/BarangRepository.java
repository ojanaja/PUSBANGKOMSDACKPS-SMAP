package com.smap.api.repository;

import com.smap.api.domain.entity.Barang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BarangRepository extends JpaRepository<Barang, Long> {
    long countByDeletedFalse();

    long countByStatusAndDeletedFalse(Barang.StatusBarang status);

    long countByKondisiAndDeletedFalse(Barang.KondisiBarang kondisi);
}
