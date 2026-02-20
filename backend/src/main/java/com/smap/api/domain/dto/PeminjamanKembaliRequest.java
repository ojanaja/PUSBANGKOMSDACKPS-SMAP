package com.smap.api.domain.dto;

import com.smap.api.domain.entity.Barang;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.Map;

@Data
public class PeminjamanKembaliRequest {

    @NotEmpty(message = "Perlu melaporkan kondisi kembali untuk setiap barang")
    private Map<Long, Barang.KondisiBarang> kondisiKembaliMap;

    private String keterangan;
}
