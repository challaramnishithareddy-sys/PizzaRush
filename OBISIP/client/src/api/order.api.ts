import apiClient from './axios';
import type { Order, OrderStatus, AdminStats } from '../types';

export interface CreateOrderPayload {
  items: {
    pizzaId: string;
    size: 'small' | 'medium' | 'large';
    crust: string;
    toppings?: string[];
    quantity: number;
  }[];
  deliveryAddress: { street: string; city: string; state: string; pincode: string };
  couponCode?: string;
  razorpayOrderId?: string;
}

export const orderApi = {
  create: (payload: CreateOrderPayload) =>
    apiClient.post<{ data: { order: Order } }>('/orders', payload),

  getMyOrders: () =>
    apiClient.get<{ data: { orders: Order[] } }>('/orders/my'),

  getById: (id: string) =>
    apiClient.get<{ data: { order: Order } }>(`/orders/${id}`),

  getAllOrders: (params?: { status?: OrderStatus; page?: number; limit?: number }) =>
    apiClient.get<{ data: { orders: Order[] } }>('/orders', { params }),

  updateStatus: (id: string, status: OrderStatus) =>
    apiClient.put<{ data: { order: Order } }>(`/orders/${id}/status`, { status }),

  markPaid: (id: string, paymentId: string) =>
    apiClient.post<{ data: { order: Order } }>(`/orders/${id}/pay`, { paymentId }),

  getAdminStats: () =>
    apiClient.get<{ data: AdminStats }>('/orders/admin/stats'),
};
