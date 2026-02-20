package com.smap.api.service;

import com.smap.api.domain.entity.Barang;
import com.smap.api.repository.BarangRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LaporanService {

    private final BarangRepository barangRepository;

    @Transactional(readOnly = true)
    public ByteArrayInputStream exportDaftarBarangCsv() {
        List<Barang> barangList = barangRepository.findAll();

        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
                CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(out), CSVFormat.DEFAULT.builder().setHeader(
                        "ID", "Kode Barang", "NUP", "Nama Barang", "Merk/Type", "Kondisi", "Status", "Lokasi",
                        "Tanggal Perolehan").build())) {

            for (Barang b : barangList) {
                if (!b.isDeleted()) {
                    List<String> data = Arrays.asList(
                            String.valueOf(b.getId()),
                            b.getKodeBarang(),
                            b.getNup() != null ? b.getNup() : "-",
                            b.getNamaBarang(),
                            b.getMerkType() != null ? b.getMerkType() : "-",
                            b.getKondisi().name(),
                            b.getStatus().name(),
                            b.getLokasi() != null ? b.getLokasi() : "-",
                            b.getTglPerolehan() != null ? b.getTglPerolehan().toString() : "-");
                    csvPrinter.printRecord(data);
                }
            }

            csvPrinter.flush();
            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            log.error("Error generating CSV: ", e);
            throw new RuntimeException("Gagal melakukan export CSV: " + e.getMessage());
        }
    }
}
