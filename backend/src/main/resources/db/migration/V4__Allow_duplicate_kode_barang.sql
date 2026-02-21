-- V4__Allow_duplicate_kode_barang.sql
-- Drop the UNIQUE constraint on kode_barang in the barang table
-- This allows multiple assets to have the same kode_barang (e.g. legacy data flow)

ALTER TABLE barang DROP CONSTRAINT barang_kode_barang_key;
