package com.smap.api.domain.dto;

import com.smap.api.domain.entity.Barang;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PerawatanDetailSelesaiDto {

    private String perbaikan;

    private LocalDate garansi;

    @NotNull(message = "Kondisi kembali harus dilaporkan")
    private Barang.KondisiBarang kondisiKembali;
}
