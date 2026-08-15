import apiClient from './axios';
import type { AuthResponse, User } from '../types';

export const authApi = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    apiClient.post<{ data: AuthResponse }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<{ data: AuthResponse }>('/auth/login', data),

  getMe: () =>
    apiClient.get<{ data: User }>('/auth/me'),

  updateProfile: (data: Partial<User>) =>
    apiClient.put<{ data: User }>('/auth/profile', data),
};
