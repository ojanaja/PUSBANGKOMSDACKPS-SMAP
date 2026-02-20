package com.smap.api.domain.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PerawatanRequest {

    @NotBlank(message = "Hal/Subject perawatan tidak boleh kosong")
    private String hal;

    private String keterangan;

    private LocalDate tglSelesaiRencana;

    @NotEmpty(message = "Minimal pilih 1 barang untuk dirawat")
    @Valid
    private List<PerawatanDetailRequestDto> details;
}
