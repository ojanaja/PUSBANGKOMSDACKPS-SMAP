import apiClient from '@/services/apiClient';
import type { ApiResponse } from '@/services/api/dashboardApi';

export interface User {
    id: number;
    username: string;
    email: string;
    role: 'ADMIN' | 'PEGAWAI';
    name: string;
    nip?: string;
    jabatan?: string;
    bidang?: string;
    permissions?: string[];
    active: boolean;
}

export interface UserRequest {
    username: string;
    email: string;
    password?: string;
    role: 'ADMIN' | 'PEGAWAI';
    name: string;
    nip?: string;
    jabatan?: string;
    bidang?: string;
    permissions?: string[];
    active: boolean;
}

export interface PagedResponse<T> {
    content: T[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export const getUsers = async (
    page = 0,
    size = 10,
    sortBy = 'id',
    sortDir = 'desc'
): Promise<PagedResponse<User>> => {
    const response = await apiClient.get<ApiResponse<PagedResponse<User>>>('/system/users', {
        params: { page, size, sortBy, sortDir }
    });
    return response.data.data;
};

export const createUser = async (data: UserRequest): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>('/system/users', data);
    return response.data.data;
};

export const updateUser = async (id: number, data: UserRequest): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(`/system/users/${id}`, data);
    return response.data.data;
};

export const updateProfile = async (data: UserRequest): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>('/system/users/profile', data);
    return response.data.data;
};

export const deleteUser = async (id: number): Promise<void> => {
    await apiClient.delete(`/system/users/${id}`);
};
