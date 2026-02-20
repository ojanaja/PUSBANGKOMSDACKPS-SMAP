package com.smap.api.domain.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.Map;

@Data
public class PerawatanSelesaiRequest {

    @NotEmpty(message = "Detail hasil perawatan untuk setiap barang harus diisi")
    @Valid
    private Map<Long, PerawatanDetailSelesaiDto> detailSelesaiMap;

    private String keterangan;
}
