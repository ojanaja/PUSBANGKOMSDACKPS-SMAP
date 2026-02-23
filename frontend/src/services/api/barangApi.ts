import apiClient from '@/services/apiClient';
import type { ApiResponse } from '@/services/api/dashboardApi';

export interface Barang {
    id: number;
    kodeBarang: string;
    nup: string;
    namaBarang: string;
    merkType: string;
    ukuran?: string;
    jenisBarang?: string;
    gudang?: string;
    lokasi?: string;
    koordinatPeta?: string;
    buktiKepemilikan?: string;
    kondisi: 'BAIK' | 'RUSAK_RINGAN' | 'RUSAK_BERAT';
    status: 'TERSEDIA' | 'DIPINJAM' | 'DIRAWAT';
    tglPerolehan?: string;
    photoUrl?: string;
    barcodeProduk?: string;
    barcodeSn?: string;
    keterangan?: string;
    tglSurat?: string;
    nopol?: string;
    pemakai?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface PagedData<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface BarangRequest {
    kodeBarang: string;
    nup?: string;
    namaBarang: string;
    merkType?: string;
    ukuran?: string;
    jenisBarang?: string;
    gudang?: string;
    lokasi?: string;
    koordinatPeta?: string;
    buktiKepemilikan?: string;
    kondisi: 'BAIK' | 'RUSAK_RINGAN' | 'RUSAK_BERAT';
    status: 'TERSEDIA' | 'DIPINJAM' | 'DIRAWAT';
    tglPerolehan?: string;
    photoUrl?: string;
    barcodeProduk?: string;
    barcodeSn?: string;
    keterangan?: string;
    tglSurat?: string;
    nopol?: string;
    pemakai?: string;
}

export const getBarang = async (page = 0, size = 10, _search = ''): Promise<PagedData<Barang>> => {
    const response = await apiClient.get<ApiResponse<PagedData<Barang>>>(`/barang?page=${page}&size=${size}`);
    return response.data.data;
};

export const createBarang = async (data: BarangRequest): Promise<Barang> => {
    const response = await apiClient.post<ApiResponse<Barang>>('/barang', data);
    return response.data.data;
};

export const updateBarang = async (id: number, data: BarangRequest): Promise<Barang> => {
    const response = await apiClient.put<ApiResponse<Barang>>(`/barang/${id}`, data);
    return response.data.data;
};

export const deleteBarang = async (id: number): Promise<void> => {
    await apiClient.delete(`/barang/${id}`);
};

export const getBarangHistoryPeminjaman = async (id: number, page = 0, size = 10): Promise<PagedData<any>> => {
    const response = await apiClient.get<ApiResponse<PagedData<any>>>(`/barang/${id}/history-peminjaman?page=${page}&size=${size}`);
    return response.data.data;
};

export const getBarangHistoryPerawatan = async (id: number, page = 0, size = 10): Promise<PagedData<any>> => {
    const response = await apiClient.get<ApiResponse<PagedData<any>>>(`/barang/${id}/history-perawatan?page=${page}&size=${size}`);
    return response.data.data;
};
