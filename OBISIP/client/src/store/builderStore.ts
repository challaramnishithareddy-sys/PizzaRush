/**
 * Zustand store for the Premium Pizza Builder.
 *
 * Manages the current build configuration and saved custom pizzas.
 * Persisted to localStorage via zustand/middleware/persist.
 *
 * Follows the same patterns as the existing cartStore.ts and authStore.ts:
 * - create() with persist() middleware
 * - Actions return void (mutations via set())
 * - Computed values derived via exported utility selectors (not stored)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  BuilderState,
  BuilderSize,
  BuilderCrustId,
  BuilderSauceId,
  BuilderCheeseId,
  CustomPizzaConfig,
  SavedCustomPizza,
} from '../types/builderTypes';
import {
  DEFAULT_BUILDER_CONFIG,
  calculateUnitPrice,
  getSize,
  getCrust,
  getSauce,
  getCheese,
  getTopping,
  getSeasoning,
} from '../data/builderData';
import { useCartStore } from './cartStore';
import type { Pizza } from '../types';

// ── ID generator ─────────────────────────────────────────────────────────────

const generateId = (): string =>
  `custom-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

// ── Store ────────────────────────────────────────────────────────────────────

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      config: { ...DEFAULT_BUILDER_CONFIG },
      savedPizzas: [],
      editingId: null,

      // ── Single-select actions ──────────────────────────────────────────

      setSize: (size: BuilderSize) =>
        set((state) => ({ config: { ...state.config, size } })),

      setCrust: (crust: BuilderCrustId) =>
        set((state) => ({ config: { ...state.config, crust } })),

      setSauce: (sauce: BuilderSauceId) =>
        set((state) => ({ config: { ...state.config, sauce } })),

      setCheese: (cheese: BuilderCheeseId) =>
        set((state) => ({ config: { ...state.config, cheese } })),

      // ── Topping actions ────────────────────────────────────────────────

      addTopping: (toppingId: string) =>
        set((state) => {
          const existing = state.config.toppings.find((t) => t.toppingId === toppingId);
          if (existing) {
            // Increment quantity (max 3 per topping)
            return {
              config: {
                ...state.config,
                toppings: state.config.toppings.map((t) =>
                  t.toppingId === toppingId
                    ? { ...t, quantity: Math.min(3, t.quantity + 1) }
                    : t
                ),
              },
            };
          }
          return {
            config: {
              ...state.config,
              toppings: [...state.config.toppings, { toppingId, quantity: 1 }],
            },
          };
        }),

      removeTopping: (toppingId: string) =>
        set((state) => ({
          config: {
            ...state.config,
            toppings: state.config.toppings.filter((t) => t.toppingId !== toppingId),
          },
        })),

      setToppingQuantity: (toppingId: string, quantity: number) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              config: {
                ...state.config,
                toppings: state.config.toppings.filter((t) => t.toppingId !== toppingId),
              },
            };
          }
          const clamped = Math.min(3, quantity);
          const exists = state.config.toppings.some((t) => t.toppingId === toppingId);
          if (!exists) {
            return {
              config: {
                ...state.config,
                toppings: [...state.config.toppings, { toppingId, quantity: clamped }],
              },
            };
          }
          return {
            config: {
              ...state.config,
              toppings: state.config.toppings.map((t) =>
                t.toppingId === toppingId ? { ...t, quantity: clamped } : t
              ),
            },
          };
        }),

      // ── Seasoning actions ──────────────────────────────────────────────

      toggleSeasoning: (seasoningId: string) =>
        set((state) => {
          const has = state.config.seasonings.includes(seasoningId);
          return {
            config: {
              ...state.config,
              seasonings: has
                ? state.config.seasonings.filter((s) => s !== seasoningId)
                : [...state.config.seasonings, seasoningId],
            },
          };
        }),

      // ── Meta actions ───────────────────────────────────────────────────

      setName: (name: string) =>
        set((state) => ({ config: { ...state.config, name } })),

      setQuantity: (quantity: number) =>
        set((state) => ({
          config: { ...state.config, quantity: Math.max(1, Math.min(10, quantity)) },
        })),

      resetBuilder: () =>
        set({ config: { ...DEFAULT_BUILDER_CONFIG, toppings: [], seasonings: [] }, editingId: null }),

      // ── Saved pizza actions ────────────────────────────────────────────

      saveCustomPizza: (): string => {
        const { config, editingId, savedPizzas } = get();
        const now = new Date().toISOString();

        if (editingId) {
          // Update existing saved pizza
          set({
            savedPizzas: savedPizzas.map((p) =>
              p.id === editingId
                ? { ...p, ...config, createdAt: p.createdAt }
                : p
            ),
            editingId: null,
          });
          return editingId;
        }

        // Create new saved pizza
        const id = generateId();
        const saved: SavedCustomPizza = {
          ...config,
          id,
          createdAt: now,
          isFavorite: false,
        };
        set({ savedPizzas: [...savedPizzas, saved] });
        return id;
      },

      deleteCustomPizza: (id: string) =>
        set((state) => ({
          savedPizzas: state.savedPizzas.filter((p) => p.id !== id),
          editingId: state.editingId === id ? null : state.editingId,
        })),

      duplicateCustomPizza: (id: string): string => {
        const { savedPizzas } = get();
        const original = savedPizzas.find((p) => p.id === id);
        if (!original) return '';

        const newId = generateId();
        const duplicate: SavedCustomPizza = {
          ...original,
          id: newId,
          name: `${original.name} (Copy)`,
          createdAt: new Date().toISOString(),
          isFavorite: false,
        };
        set({ savedPizzas: [...savedPizzas, duplicate] });
        return newId;
      },

      loadFromSaved: (id: string) => {
        const { savedPizzas } = get();
        const saved = savedPizzas.find((p) => p.id === id);
        if (!saved) return;

        const config: CustomPizzaConfig = {
          ...DEFAULT_BUILDER_CONFIG,
          name: saved.name,
          size: saved.size,
          crust: saved.crust,
          sauce: saved.sauce,
          cheese: saved.cheese,
          toppings: saved.toppings.map((t) => ({ ...t })),
          seasonings: [...saved.seasonings],
          quantity: saved.quantity,
        };
        set({ config, editingId: id });
      },

      toggleFavorite: (id: string) =>
        set((state) => ({
          savedPizzas: state.savedPizzas.map((p) =>
            p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
          ),
        })),

      getShareableConfig: (id: string): string => {
        const { savedPizzas } = get();
        const saved = savedPizzas.find((p) => p.id === id);
        if (!saved) return '';
        const { id: _id, createdAt: _ca, isFavorite: _fav, ...shareable } = saved;
        return JSON.stringify(shareable, null, 2);
      },

      importCustomPizza: (jsonString: string): string | null => {
        try {
          const parsed = JSON.parse(jsonString);
          if (!parsed || typeof parsed !== 'object') {
            return null;
          }

          const { savedPizzas } = get();
          const id = generateId();

          // Validate and sanitize selections against catalog
          const validSize = getSize(parsed.size) ? parsed.size : DEFAULT_BUILDER_CONFIG.size;
          const validCrust = getCrust(parsed.crust) ? parsed.crust : DEFAULT_BUILDER_CONFIG.crust;
          const validSauce = getSauce(parsed.sauce) ? parsed.sauce : DEFAULT_BUILDER_CONFIG.sauce;
          const validCheese = getCheese(parsed.cheese) ? parsed.cheese : DEFAULT_BUILDER_CONFIG.cheese;

          // Filter out any unknown/removed topping IDs and sanitize quantities
          const rawToppings = Array.isArray(parsed.toppings) ? parsed.toppings : [];
          const validToppings = rawToppings
            .filter((t: any) => t && typeof t.toppingId === 'string' && getTopping(t.toppingId))
            .map((t: any) => ({
              toppingId: String(t.toppingId),
              quantity: Math.max(1, Math.min(3, Math.floor(Number(t.quantity) || 1))),
            }));

          // Filter out unknown seasoning IDs
          const rawSeasonings = Array.isArray(parsed.seasonings) ? parsed.seasonings : [];
          const validSeasonings = rawSeasonings
            .filter((s: any) => typeof s === 'string' && getSeasoning(s))
            .map((s: any) => String(s));

          const imported: SavedCustomPizza = {
            ...DEFAULT_BUILDER_CONFIG,
            name: typeof parsed.name === 'string' && parsed.name.trim()
              ? `${parsed.name.trim()} (Imported)`
              : 'Imported Custom Pizza',
            size: validSize,
            crust: validCrust,
            sauce: validSauce,
            cheese: validCheese,
            toppings: validToppings,
            seasonings: validSeasonings,
            quantity: Math.max(1, Math.min(10, Math.floor(Number(parsed.quantity) || 1))),
            id,
            createdAt: new Date().toISOString(),
            isFavorite: false,
          };

          try {
            set({ savedPizzas: [...savedPizzas, imported] });
            return id;
          } catch (e) {
            // LocalStorage quota exceeded fallback
            console.warn('Could not persist imported pizza to localStorage', e);
            return id;
          }
        } catch {
          return null;
        }
      },
    }),
    {
      name: 'pizzahub_builder',
      partialize: (state) => ({
        savedPizzas: state.savedPizzas,
        // Don't persist current config — always start fresh
      }),
    }
  )
);

// ── Cart integration helper ──────────────────────────────────────────────────

/**
 * Converts the current builder config into a CartItem-compatible shape
 * and adds it to the existing cart store.
 * Returns the unit price for confirmation.
 */
export function addBuilderPizzaToCart(config: CustomPizzaConfig): number {
  const unitPrice = calculateUnitPrice(config);
  const sizeOption = getSize(config.size);

  // Map builder size to cart-compatible size (cart only supports small/medium/large)
  const cartSize: 'small' | 'medium' | 'large' =
    config.size === 'personal' ? 'small'
      : config.size === 'family' ? 'large'
        : config.size as 'small' | 'medium' | 'large';

  // Build a synthetic Pizza object for the cart
  const syntheticPizza: Pizza = {
    _id: `custom-${Date.now()}`,
    name: config.name || 'Custom Pizza',
    description: `Custom built pizza — ${sizeOption?.label ?? config.size}, ${config.crust}, ${config.sauce} sauce, ${config.cheese} cheese`,
    category: 'specialty',
    basePrice: unitPrice,
    sizes: [{ size: cartSize, price: unitPrice }],
    crusts: [config.crust],
    toppings: config.toppings.map((t) => ({ name: t.toppingId, price: 0 })),
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80',
    rating: 5.0,
    totalRatings: 0,
    isAvailable: true,
    isFeatured: false,
    tags: ['custom'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Collect topping names for the cart item
  const toppingNames = config.toppings.map((t) => t.toppingId);

  // Add to cart via the existing cart store
  const { addItem } = useCartStore.getState();
  for (let i = 0; i < config.quantity; i++) {
    addItem(syntheticPizza, cartSize, config.crust, toppingNames, unitPrice);
  }

  return unitPrice;
}
