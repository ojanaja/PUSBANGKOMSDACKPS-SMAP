import apiClient from '@/services/apiClient';

export interface DashboardData {
    totalBarang: number;
    barangTersedia: number;
    barangDipinjam: number;
    barangDirawat: number;
    barangRusak: number;
    peminjamanAktif: number;
    perawatanAktif: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

export const getDashboardSummary = async (): Promise<DashboardData> => {
    const response = await apiClient.get<ApiResponse<DashboardData>>('/dashboard/summary');
    return response.data.data;
};
