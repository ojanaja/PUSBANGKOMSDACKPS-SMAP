package com.smap.api.domain.dto;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Data
@Builder
public class DashboardResponse implements Serializable {
    private long totalBarang;
    private long barangTersedia;
    private long barangDipinjam;
    private long barangDirawat;
    private long barangRusak;

    private long peminjamanAktif;
    private long perawatanAktif;
}
