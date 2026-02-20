package com.smap.api.repository;

import com.smap.api.domain.entity.Perawatan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PerawatanRepository extends JpaRepository<Perawatan, Long> {
    long countByStatusAndDeletedFalse(Perawatan.StatusPerawatan status);
}
