import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Pizza } from '../types';
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '../utils/constants';

interface CartState {
  items: CartItem[];
  couponCode: string;
  discount: number;
  // Computed
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  // Actions
  addItem: (pizza: Pizza, size: 'small' | 'medium' | 'large', crust: string, toppings: string[], unitPrice: number) => void;
  removeItem: (pizzaId: string, size: string, crust: string) => void;
  updateQuantity: (pizzaId: string, size: string, crust: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
}

/** Computes a unique key for a cart line item */
const itemKey = (pizzaId: string, size: string, crust: string) =>
  `${pizzaId}-${size}-${crust}`;

/**
 * Global cart state. Persisted to localStorage.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => {
      const computeTotals = (items: CartItem[], discount: number) => {
        const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
        const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
        const total = subtotal - discount + deliveryFee;
        const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
        return { subtotal, deliveryFee, total, itemCount };
      };

      return {
        items: [],
        couponCode: '',
        discount: 0,
        itemCount: 0,
        subtotal: 0,
        deliveryFee: DELIVERY_FEE,
        total: 0,

        addItem: (pizza, size, crust, toppings, unitPrice) => {
          const { items, discount } = get();
          const key = itemKey(pizza._id, size, crust);
          const existing = items.find(
            (i) => itemKey(i.pizza._id, i.size, i.crust) === key
          );

          const newItems = existing
            ? items.map((i) =>
                itemKey(i.pizza._id, i.size, i.crust) === key
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              )
            : [...items, { pizza, size, crust, toppings, quantity: 1, unitPrice }];

          set({ items: newItems, ...computeTotals(newItems, discount) });
        },

        removeItem: (pizzaId, size, crust) => {
          const { discount } = get();
          const newItems = get().items.filter(
            (i) => itemKey(i.pizza._id, i.size, i.crust) !== itemKey(pizzaId, size, crust)
          );
          set({ items: newItems, ...computeTotals(newItems, discount) });
        },

        updateQuantity: (pizzaId, size, crust, quantity) => {
          const { discount } = get();
          if (quantity <= 0) {
            get().removeItem(pizzaId, size, crust);
            return;
          }
          const newItems = get().items.map((i) =>
            itemKey(i.pizza._id, i.size, i.crust) === itemKey(pizzaId, size, crust)
              ? { ...i, quantity }
              : i
          );
          set({ items: newItems, ...computeTotals(newItems, discount) });
        },

        clearCart: () =>
          set({ items: [], couponCode: '', discount: 0, itemCount: 0, subtotal: 0, deliveryFee: DELIVERY_FEE, total: 0 }),

        applyCoupon: (code, discount) => {
          const { items } = get();
          set({ couponCode: code, discount, ...computeTotals(items, discount) });
        },

        removeCoupon: () => {
          const { items } = get();
          set({ couponCode: '', discount: 0, ...computeTotals(items, 0) });
        },
      };
    },
    {
      name: 'pizzahub_cart',
    }
  )
);
