import apiClient from './axios';
import type { Pizza } from '../types';

export interface PizzaListResponse {
  pizzas: Pizza[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface PizzaFilters {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
  available?: string;
}

export const pizzaApi = {
  getAll: (filters: PizzaFilters = {}) =>
    apiClient.get<{ data: PizzaListResponse }>('/pizzas', { params: filters }),

  getFeatured: () =>
    apiClient.get<{ data: { pizzas: Pizza[] } }>('/pizzas/featured'),

  getById: (id: string) =>
    apiClient.get<{ data: { pizza: Pizza } }>(`/pizzas/${id}`),

  create: (data: Partial<Pizza>) =>
    apiClient.post<{ data: { pizza: Pizza } }>('/pizzas', data),

  update: (id: string, data: Partial<Pizza>) =>
    apiClient.put<{ data: { pizza: Pizza } }>(`/pizzas/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/pizzas/${id}`),

  toggleAvailability: (id: string) =>
    apiClient.patch<{ data: { pizza: Pizza } }>(`/pizzas/${id}/toggle-availability`),
};
