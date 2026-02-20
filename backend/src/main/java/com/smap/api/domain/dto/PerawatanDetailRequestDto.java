package com.smap.api.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PerawatanDetailRequestDto {
    @NotNull(message = "ID barang harus diisi")
    private Long barangId;

    @NotBlank(message = "Gejala kerusakan harus dijelaskan")
    private String gejala;
}
