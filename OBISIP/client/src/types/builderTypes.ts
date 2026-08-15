/**
 * Type definitions for the Premium Pizza Builder feature.
 *
 * These types are separate from the main types/index.ts because the builder
 * introduces domain concepts (5 sizes, sauces, cheeses, nutrition data,
 * saved custom pizzas) that don't apply to existing menu pizzas.
 */

// ── Size ────────────────────────────────────────────────────────────────────

export type BuilderSize = 'personal' | 'small' | 'medium' | 'large' | 'family';

export interface BuilderSizeOption {
  readonly id: BuilderSize;
  readonly label: string;
  readonly diameter: string;
  readonly serves: string;
  readonly price: number;
  readonly baseCalories: number;
  readonly prepTimeMin: number;
}

// ── Crust ───────────────────────────────────────────────────────────────────

export type BuilderCrustId =
  | 'thin'
  | 'hand-tossed'
  | 'cheese-burst'
  | 'stuffed'
  | 'pan'
  | 'whole-wheat';

export interface BuilderCrustOption {
  readonly id: BuilderCrustId;
  readonly label: string;
  readonly extraPrice: number;
  readonly calorieMultiplier: number;
  readonly description: string;
}

// ── Sauce ───────────────────────────────────────────────────────────────────

export type BuilderSauceId = 'tomato' | 'bbq' | 'white' | 'garlic-butter' | 'spicy';

export interface BuilderSauceOption {
  readonly id: BuilderSauceId;
  readonly label: string;
  readonly extraPrice: number;
  readonly spiceLevel: number; // 0–5
  readonly calories: number;
  readonly color: string;
  readonly description: string;
}

// ── Cheese ──────────────────────────────────────────────────────────────────

export type BuilderCheeseId = 'mozzarella' | 'cheddar' | 'parmesan' | 'extra' | 'double';

export interface BuilderCheeseOption {
  readonly id: BuilderCheeseId;
  readonly label: string;
  readonly extraPrice: number;
  readonly calories: number;
  readonly fat: number;
  readonly description: string;
}

// ── Toppings ────────────────────────────────────────────────────────────────

export type ToppingCategory = 'veg' | 'non-veg';

export interface BuilderTopping {
  readonly id: string;
  readonly name: string;
  readonly category: ToppingCategory;
  readonly price: number;
  readonly calories: number;
  readonly protein: number;
  readonly carbs: number;
  readonly fat: number;
  readonly spiceLevel: number; // 0–5
  readonly color: string;      // CSS color for preview dot
  readonly accentColor: string; // lighter shade for glow
  readonly popularity?: number; // 1-100 score
  readonly flavorIntensity?: 'mild' | 'savory' | 'zesty' | 'smoky' | 'fiery';
  readonly textureType?: 'crispy' | 'chewy' | 'juicy' | 'tender' | 'melted';
  readonly recommendedPairing?: string;
}

// ── Seasonings ──────────────────────────────────────────────────────────────

export interface BuilderSeasoning {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly calories: number;
}

// ── Topping with quantity (used in builder state) ───────────────────────────

export interface SelectedTopping {
  readonly toppingId: string;
  quantity: number;
}

// ── Nutrition ───────────────────────────────────────────────────────────────

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// ── Custom Pizza Config (builder working state) ─────────────────────────────

export interface CustomPizzaConfig {
  name: string;
  size: BuilderSize;
  crust: BuilderCrustId;
  sauce: BuilderSauceId;
  cheese: BuilderCheeseId;
  toppings: SelectedTopping[];
  seasonings: string[]; // seasoning IDs
  quantity: number;
}

// ── Saved Custom Pizza ──────────────────────────────────────────────────────

export interface SavedCustomPizza extends CustomPizzaConfig {
  readonly id: string;
  readonly createdAt: string; // ISO string
  isFavorite: boolean;
}

// ── Builder Store State ─────────────────────────────────────────────────────

export interface BuilderState {
  // Current build
  config: CustomPizzaConfig;
  savedPizzas: SavedCustomPizza[];
  editingId: string | null; // ID of saved pizza being edited, or null

  // Computed (derived in store selectors / component)
  // — not stored, calculated via utility functions

  // Actions — single-select
  setSize: (size: BuilderSize) => void;
  setCrust: (crust: BuilderCrustId) => void;
  setSauce: (sauce: BuilderSauceId) => void;
  setCheese: (cheese: BuilderCheeseId) => void;

  // Actions — toppings
  addTopping: (toppingId: string) => void;
  removeTopping: (toppingId: string) => void;
  setToppingQuantity: (toppingId: string, quantity: number) => void;

  // Actions — seasonings
  toggleSeasoning: (seasoningId: string) => void;

  // Actions — meta
  setName: (name: string) => void;
  setQuantity: (quantity: number) => void;
  resetBuilder: () => void;

  // Actions — saved pizzas
  saveCustomPizza: () => string;         // returns ID
  deleteCustomPizza: (id: string) => void;
  duplicateCustomPizza: (id: string) => string; // returns new ID
  loadFromSaved: (id: string) => void;
  toggleFavorite: (id: string) => void;
  getShareableConfig: (id: string) => string; // returns JSON string
  importCustomPizza: (jsonString: string) => string | null; // returns new ID or null if invalid
}
