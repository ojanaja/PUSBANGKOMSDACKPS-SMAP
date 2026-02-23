import apiClient from '@/services/apiClient';

export interface LoginRequest {
    username: string;
    password?: string;
}

export interface AuthResponse {
    token: string;
    type: string;
    id: number;
    username: string;
    name: string;
    role: 'ADMIN' | 'PEGAWAI';
    nip?: string;
    jabatan?: string;
    bidang?: string;
    permissions?: string[];
}

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
};
