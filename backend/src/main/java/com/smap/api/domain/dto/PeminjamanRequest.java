package com.smap.api.domain.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PeminjamanRequest {

    @NotEmpty(message = "Pilih minimal 1 barang untuk dipinjam")
    private List<Long> barangIds;

    @NotEmpty(message = "Keperluan tidak boleh kosong")
    private String keperluan;

    private String keterangan;

    private LocalDate tglPinjam;

    private LocalDate tglKembaliRencana;

    private String penanggungJawabName;

    private String penanggungJawabNip;

    private String penanggungJawabJabatan;
}
