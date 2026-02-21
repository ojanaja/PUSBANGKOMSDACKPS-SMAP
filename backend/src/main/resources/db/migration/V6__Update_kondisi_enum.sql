-- V6__Update_kondisi_enum.sql
-- Update legacy Enum string values in the database from KURANG_BAIK to RUSAK_RINGAN
-- This aligns the existing data with the updated Java KondisiBarang Enum and frontend Select options

UPDATE barang SET kondisi = 'RUSAK_RINGAN' WHERE kondisi = 'KURANG_BAIK';
