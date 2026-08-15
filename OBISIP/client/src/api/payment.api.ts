import apiClient from './axios';
import type { RazorpayOrder } from '../types';

export const paymentApi = {
  createOrder: (amount: number, currency = 'INR', orderId?: string) =>
    apiClient.post<{ data: RazorpayOrder }>('/payments/create-order', { amount, currency, orderId }),

  verifyPayment: (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) =>
    apiClient.post<{ data: { verified: boolean; paymentId: string } }>(
      '/payments/verify',
      payload
    ),
};
