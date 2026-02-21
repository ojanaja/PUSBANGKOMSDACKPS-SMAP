package com.smap.api.domain.dto;

import com.smap.api.domain.entity.Barang;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BarangRequest {

    @NotBlank(message = "Kode barang tidak boleh kosong")
    private String kodeBarang;

    private String nup;

    @NotBlank(message = "Nama barang tidak boleh kosong")
    private String namaBarang;

    private String merkType;
    private String ukuran;
    private String jenisBarang;
    private String gudang;
    private String lokasi;
    private String koordinatPeta;
    private String buktiKepemilikan;

    @NotNull(message = "Kondisi barang harus dipilih")
    private Barang.KondisiBarang kondisi;

    @NotNull(message = "Status barang harus dipilih")
    private Barang.StatusBarang status;

    private LocalDate tglPerolehan;
    private String photoUrl;
    private String barcodeProduk;
    private String barcodeSn;
    private String keterangan;

    private LocalDate tglSurat;
    private String nopol;
    private String pemakai;
}
