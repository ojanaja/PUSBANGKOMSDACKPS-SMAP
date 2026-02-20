-- Dummy admin account (password is 'password' hashed via BCrypt equivalent, we will use a raw text temporarily until Security config overrides this, but for now we set it plainly)
INSERT INTO users (name, username, email, password, role, nip, jabatan, bidang) 
VALUES ('Super Admin', 'admin', 'admin@smap.local', '$2a$10$8.UnVuG9HLROJOsI7wQPA.0l1c4/E2/b3I.r.Z0qH1P.T6y/.i6zK', 'ADMIN', '198001012010011001', 'Kepala Tata Usaha', 'Umum');

-- Dummy Storage Data (Just for visualization)
INSERT INTO barang (kode_barang, nup, nama_barang, merk_type, gudang, lokasi, kondisi, status, keterangan)
VALUES ('BRG-001', '01.01.01', 'Laptop Lenovo Thinkpad', 'T14 Gen 3', 'Gudang IT', 'Ruang Server', 'BAIK', 'TERSEDIA', 'Laptop inventaris 2024');

INSERT INTO barang (kode_barang, nup, nama_barang, merk_type, gudang, lokasi, kondisi, status, keterangan)
VALUES ('BRG-002', '01.01.02', 'Proyektor Epson', 'EB-X06', 'Gudang ATK', 'Ruang Rapat Utama', 'KURANG_BAIK', 'DIRAWAT', 'Sedang ganti lampu');
