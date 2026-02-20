CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    nip VARCHAR(255),
    jabatan VARCHAR(255),
    bidang VARCHAR(255),
    
    -- Audit & Optimistic Locking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE barang (
    id BIGSERIAL PRIMARY KEY,
    kode_barang VARCHAR(255) NOT NULL UNIQUE,
    nup VARCHAR(255),
    nama_barang VARCHAR(255) NOT NULL,
    merk_type VARCHAR(255),
    ukuran VARCHAR(255),
    jenis_barang VARCHAR(255),
    gudang VARCHAR(255),
    lokasi VARCHAR(255),
    koordinat_peta VARCHAR(255),
    bukti_kepemilikan VARCHAR(255),
    kondisi VARCHAR(50) NOT NULL, -- BAIK, KURANG_BAIK, RUSAK_BERAT
    status VARCHAR(50) NOT NULL, -- TERSEDIA, DIPINJAM, DIRAWAT, RUSAK, HILANG
    tgl_perolehan DATE,
    photo_url VARCHAR(500),
    barcode_produk VARCHAR(255) UNIQUE,
    barcode_sn VARCHAR(255) UNIQUE,
    keterangan TEXT,

    -- Audit & Optimistic Locking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE transaksi_peminjaman (
    id BIGSERIAL PRIMARY KEY,
    no_register VARCHAR(255) NOT NULL UNIQUE,
    peminjam_id BIGINT NOT NULL REFERENCES users(id),
    penanggung_jawab_id BIGINT REFERENCES users(id),
    keperluan VARCHAR(500) NOT NULL,
    keterangan TEXT,
    tgl_pinjam DATE NOT NULL,
    tgl_kembali_rencana DATE,
    tgl_kembali_aktual DATE,
    status VARCHAR(20) NOT NULL, -- DIPINJAM, SELESAI
    berita_acara_url VARCHAR(500),

    -- Audit & Optimistic Locking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE transaksi_peminjaman_detail (
    id BIGSERIAL PRIMARY KEY,
    peminjaman_id BIGINT NOT NULL REFERENCES transaksi_peminjaman(id),
    barang_id BIGINT NOT NULL REFERENCES barang(id),
    kondisi_pinjam VARCHAR(50),
    kondisi_kembali VARCHAR(50),
    keterangan TEXT,

    -- Audit & Optimistic Locking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE transaksi_perawatan (
    id BIGSERIAL PRIMARY KEY,
    no_register VARCHAR(255) NOT NULL UNIQUE,
    hal VARCHAR(500) NOT NULL,
    diajukan_oleh_id BIGINT NOT NULL REFERENCES users(id),
    penanggung_jawab_id BIGINT REFERENCES users(id),
    keterangan TEXT,
    tgl_service DATE NOT NULL,
    tgl_selesai_rencana DATE,
    tgl_selesai_aktual DATE,
    status VARCHAR(50) NOT NULL, -- PERAWATAN, SELESAI

    -- Audit & Optimistic Locking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE transaksi_perawatan_detail (
    id BIGSERIAL PRIMARY KEY,
    perawatan_id BIGINT NOT NULL REFERENCES transaksi_perawatan(id),
    barang_id BIGINT NOT NULL REFERENCES barang(id),
    gejala TEXT NOT NULL,
    perbaikan TEXT,
    garansi_until DATE,
    keterangan TEXT,
    kondisi_kembali VARCHAR(50),

    -- Audit & Optimistic Locking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL
);
