import apiClient from '@/services/apiClient';
import type { ApiResponse } from '@/services/api/dashboardApi';
import type { PagedData } from '@/services/api/barangApi';

export interface PeminjamanDetail {
    id: number;
    barangId: number;
    namaBarang: string;
    kodeBarang: string;
    nup: string;
    kondisiPinjam: string;
    kondisiKembali?: string;
    keterangan?: string;
}

export interface Peminjaman {
    id: number;
    noRegister: string;
    peminjamId: number;
    peminjamName: string;
    peminjamNip: string;
    peminjamJabatan: string;
    peminjamBidang: string;

    penanggungJawabId?: number;
    penanggungJawabName?: string;
    penanggungJawabNip?: string;
    penanggungJawabJabatan?: string;
    penanggungJawabBidang?: string;

    keperluan: string;
    keterangan: string;
    tglPinjam: string;
    tglKembaliRencana: string;
    tglKembaliAktual?: string;
    status: 'DIPINJAM' | 'SELESAI';
    beritaAcaraUrl?: string;

    detailBarang: PeminjamanDetail[];
    createdAt: string;
    updatedAt: string;
}

export interface PeminjamanRequest {
    barangIds: number[];
    keperluan: string;
    keterangan?: string;
    tglKembaliRencana?: string;
}

export interface PeminjamanKembaliRequest {
    keterangan?: string;
    kembaliDetails: {
        detailId: number;
        kondisiKembali: 'BAIK' | 'RUSAK_RINGAN' | 'RUSAK_BERAT';
    }[];
}

export const getPeminjaman = async (page = 0, size = 10): Promise<PagedData<Peminjaman>> => {
    const response = await apiClient.get<ApiResponse<PagedData<Peminjaman>>>(`/transaksi/peminjaman?page=${page}&size=${size}`);
    return response.data.data;
};

export const createPeminjaman = async (data: PeminjamanRequest): Promise<Peminjaman> => {
    const response = await apiClient.post<ApiResponse<Peminjaman>>('/transaksi/peminjaman/pinjam', data);
    return response.data.data;
};

export const kembaliPeminjaman = async (id: number, data: PeminjamanKembaliRequest): Promise<Peminjaman> => {
    const response = await apiClient.post<ApiResponse<Peminjaman>>(`/transaksi/peminjaman/${id}/kembali`, data);
    return response.data.data;
};
