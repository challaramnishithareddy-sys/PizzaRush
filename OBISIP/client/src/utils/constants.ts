/** Application-wide constants */

export const API_BASE_URL = '/api';

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending:          'Order Placed',
  confirmed:        'Confirmed',
  preparing:        'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered:        'Delivered',
  cancelled:        'Cancelled',
};

export const ORDER_STATUS_STEPS = [
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
] as const;

export const SIZE_LABELS: Record<string, string> = {
  personal: 'Personal (6")',
  small:  'Small (8")',
  medium: 'Medium (10")',
  large:  'Large (12")',
  family: 'Family (14")',
};

export const CATEGORY_LABELS: Record<string, string> = {
  all:        'All',
  veg:        'Vegetarian',
  'non-veg':  'Non-Vegetarian',
  specialty:  'Specialty',
};

export const COUPON_CODES = ['PIZZA10', 'SAVE20', 'WELCOME15'];

export const FREE_DELIVERY_THRESHOLD = 499;
export const DELIVERY_FEE = 49;

export const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';
