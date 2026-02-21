import apiClient from '@/services/apiClient';
import type { ApiResponse } from '@/services/api/dashboardApi';

export const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<{ url: string }>>('/files/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data.data.url;
};
