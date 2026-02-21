-- V5__Allow_duplicate_barcodes.sql
-- Drop the UNIQUE constraints on barcode_produk and barcode_sn in the barang table
-- Empty barcodes or duplicate default barcodes cause constraint violations

ALTER TABLE barang DROP CONSTRAINT IF EXISTS barang_barcode_produk_key;
ALTER TABLE barang DROP CONSTRAINT IF EXISTS barang_barcode_sn_key;
