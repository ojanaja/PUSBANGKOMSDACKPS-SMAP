-- Update barang table
ALTER TABLE barang 
ADD COLUMN tgl_surat DATE,
ADD COLUMN nopol VARCHAR(255),
ADD COLUMN pemakai VARCHAR(255);

-- Update transaksi_perawatan_detail table
ALTER TABLE transaksi_perawatan_detail
ADD COLUMN status VARCHAR(255) NOT NULL DEFAULT 'PROSES';
