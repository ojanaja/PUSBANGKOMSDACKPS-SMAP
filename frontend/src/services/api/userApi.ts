import apiClient from '@/services/apiClient';
import type { ApiResponse } from '@/services/api/dashboardApi';

export interface User {
    id: number;
    username: string;
    email: string;
    role: 'ADMIN' | 'PETUGAS' | 'PEMINJAM' | 'VIEWER';
    namaLengkap: string;
    jabatan?: string;
    isActive: boolean;
}

export interface UserRequest {
    username: string;
    email: string;
    password?: string;
    role: 'ADMIN' | 'PETUGAS' | 'PEMINJAM' | 'VIEWER';
    namaLengkap: string;
    jabatan?: string;
    isActive: boolean;
}

export const getUsers = async (): Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/users');
    return response.data.data;
};

export const createUser = async (data: UserRequest): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>('/users', data);
    return response.data.data;
};

export const updateUser = async (id: number, data: UserRequest): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data;
};

export const deleteUser = async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
};
