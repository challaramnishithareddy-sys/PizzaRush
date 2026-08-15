/**
 * Shared TypeScript interfaces for the PizzaHub frontend.
 * These mirror the backend Mongoose model shapes.
 */

// ── Pizza ────────────────────────────────────────────────────────────────────

export interface SizeVariant {
  size: 'small' | 'medium' | 'large';
  price: number;
}

export interface Topping {
  name: string;
  price: number;
}

export interface Pizza {
  _id: string;
  name: string;
  description: string;
  category: 'veg' | 'non-veg' | 'specialty';
  basePrice: number;
  sizes: SizeVariant[];
  crusts: string[];
  toppings: Topping[];
  image: string;
  rating: number;
  totalRatings: number;
  isAvailable: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ── User ─────────────────────────────────────────────────────────────────────

export interface Address {
  _id?: string;
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses: Address[];
}

// ── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  pizza: Pizza;
  size: 'small' | 'medium' | 'large';
  crust: string;
  toppings: string[];
  quantity: number;
  unitPrice: number;
  /** True when this item was created via the pizza builder */
  isCustom?: boolean;
  /** User-given name for custom-built pizzas */
  customName?: string;
}

// ── Order ─────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  pizza: string;
  pizzaName: string;
  size: 'small' | 'medium' | 'large';
  crust: string;
  toppings: string[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface StatusEvent {
  status: OrderStatus;
  timestamp: string;
  message: string;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string | User;
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  couponCode?: string;
  status: OrderStatus;
  statusHistory: StatusEvent[];
  paymentId?: string;
  razorpayOrderId?: string;
  isPaid: boolean;
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
}

// ── API ───────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  user: User;
}

// ── Admin Stats ───────────────────────────────────────────────────────────────

export interface AdminStats {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  statusCounts: Record<OrderStatus, number>;
  revenueData: { _id: string; revenue: number; orders: number }[];
}

// ── Payment ───────────────────────────────────────────────────────────────────

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  key: string;
  isDemoMode?: boolean;
}

// ── Socket ────────────────────────────────────────────────────────────────────

export interface OrderStatusUpdate {
  orderId: string;
  status: OrderStatus;
  message: string;
  timestamp: string;
}
