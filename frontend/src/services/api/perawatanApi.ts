import apiClient from '@/services/apiClient';
import type { ApiResponse } from '@/services/api/dashboardApi';
import type { PagedData } from '@/services/api/barangApi';

export interface PerawatanDetail {
    id: number;
    barangId: number;
    namaBarang: string;
    kodeBarang: string;
    nup: string;
    gejala: string;
    perbaikan?: string;
    garansi?: string;
    kondisiKembali?: string;
}

export interface Perawatan {
    id: number;
    noRegister: string;
    hal: string;

    diajukanOlehId: number;
    diajukanOlehName: string;
    diajukanOlehNip: string;
    diajukanOlehJabatan: string;
    diajukanOlehBidang: string;

    penanggungJawabId?: number;
    penanggungJawabName?: string;
    penanggungJawabNip?: string;
    penanggungJawabJabatan?: string;
    penanggungJawabBidang?: string;

    keterangan?: string;
    tglService: string;
    tglSelesaiRencana: string;
    tglSelesaiAktual?: string;
    status: 'PERAWATAN' | 'SELESAI';

    detailBarang: PerawatanDetail[];
    createdAt: string;
    updatedAt: string;
}

export interface PerawatanRequest {
    hal: string;
    keterangan?: string;
    tglSelesaiRencana: string;
    details: {
        barangId: number;
        gejala: string;
    }[];
}

export interface PerawatanSelesaiRequest {
    keterangan?: string;
    detailSelesaiMap: Record<number, {
        perbaikan: string;
        garansi?: string;
        kondisiKembali: 'BAIK' | 'KURANG_BAIK' | 'RUSAK_BERAT';
    }>;
}

export const getPerawatan = async (page = 0, size = 10, _search = ''): Promise<PagedData<Perawatan>> => {
    const response = await apiClient.get<ApiResponse<PagedData<Perawatan>>>(`/transaksi/perawatan?page=${page}&size=${size}`);
    return response.data.data;
};

export const createPerawatan = async (data: PerawatanRequest): Promise<Perawatan> => {
    const response = await apiClient.post<ApiResponse<Perawatan>>('/transaksi/perawatan/ajukan', data);
    return response.data.data;
};

export const selesaiPerawatan = async (id: number, data: PerawatanSelesaiRequest): Promise<Perawatan> => {
    const response = await apiClient.post<ApiResponse<Perawatan>>(`/transaksi/perawatan/${id}/selesai`, data);
    return response.data.data;
};
