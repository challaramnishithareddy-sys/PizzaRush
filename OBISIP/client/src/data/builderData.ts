/**
 * Builder ingredient data — all sizes, crusts, sauces, cheeses, toppings, and seasonings
 * with complete pricing (INR), nutrition info, and visual metadata.
 *
 * This is the single source of truth for the pizza builder's ingredient catalog.
 * Pure data — no React, no side effects.
 */

import type {
  BuilderSizeOption,
  BuilderCrustOption,
  BuilderSauceOption,
  BuilderCheeseOption,
  BuilderTopping,
  BuilderSeasoning,
  BuilderSize,
  BuilderCrustId,
  BuilderSauceId,
  BuilderCheeseId,
  NutritionInfo,
  CustomPizzaConfig,
} from '../types/builderTypes';

// ── Sizes ────────────────────────────────────────────────────────────────────

export const BUILDER_SIZES: readonly BuilderSizeOption[] = [
  { id: 'personal', label: 'Personal',  diameter: '6″',  serves: '1',   price: 149, baseCalories: 600,  prepTimeMin: 10 },
  { id: 'small',    label: 'Small',     diameter: '8″',  serves: '1–2', price: 199, baseCalories: 800,  prepTimeMin: 12 },
  { id: 'medium',   label: 'Medium',    diameter: '10″', serves: '2–3', price: 349, baseCalories: 1200, prepTimeMin: 15 },
  { id: 'large',    label: 'Large',     diameter: '12″', serves: '3–4', price: 499, baseCalories: 1600, prepTimeMin: 18 },
  { id: 'family',   label: 'Family',    diameter: '14″', serves: '4–6', price: 649, baseCalories: 2200, prepTimeMin: 22 },
] as const;

// ── Crusts ───────────────────────────────────────────────────────────────────

export const BUILDER_CRUSTS: readonly BuilderCrustOption[] = [
  { id: 'thin',         label: 'Thin Crust',    extraPrice: 0,   calorieMultiplier: 0.85, description: 'Light & crispy' },
  { id: 'hand-tossed',  label: 'Hand Tossed',   extraPrice: 0,   calorieMultiplier: 1.0,  description: 'Classic & chewy' },
  { id: 'cheese-burst', label: 'Cheese Burst',  extraPrice: 80,  calorieMultiplier: 1.3,  description: 'Cheese-stuffed edges' },
  { id: 'stuffed',      label: 'Stuffed Crust', extraPrice: 100, calorieMultiplier: 1.35, description: 'Loaded crust ring' },
  { id: 'pan',          label: 'Pan Crust',     extraPrice: 40,  calorieMultiplier: 1.15, description: 'Deep & buttery' },
  { id: 'whole-wheat',  label: 'Whole Wheat',   extraPrice: 30,  calorieMultiplier: 0.95, description: 'Healthier option' },
] as const;

// ── Sauces ───────────────────────────────────────────────────────────────────

export const BUILDER_SAUCES: readonly BuilderSauceOption[] = [
  { id: 'tomato',        label: 'Tomato',        extraPrice: 0,  spiceLevel: 0, calories: 30,  color: '#c0392b', description: 'Classic marinara' },
  { id: 'bbq',           label: 'BBQ',           extraPrice: 20, spiceLevel: 1, calories: 45,  color: '#6b3a2a', description: 'Sweet & smoky' },
  { id: 'white',         label: 'White Sauce',   extraPrice: 30, spiceLevel: 0, calories: 55,  color: '#ecf0f1', description: 'Creamy Alfredo' },
  { id: 'garlic-butter', label: 'Garlic Butter', extraPrice: 25, spiceLevel: 0, calories: 60,  color: '#f1c40f', description: 'Rich & aromatic' },
  { id: 'spicy',         label: 'Spicy Sauce',   extraPrice: 15, spiceLevel: 4, calories: 35,  color: '#e74c3c', description: 'Fiery chilli base' },
] as const;

// ── Cheeses ──────────────────────────────────────────────────────────────────

export const BUILDER_CHEESES: readonly BuilderCheeseOption[] = [
  { id: 'mozzarella', label: 'Mozzarella', extraPrice: 0,  calories: 80,  fat: 6,  description: 'Classic stretch' },
  { id: 'cheddar',    label: 'Cheddar',    extraPrice: 40, calories: 110, fat: 9,  description: 'Sharp & tangy' },
  { id: 'parmesan',   label: 'Parmesan',   extraPrice: 50, calories: 100, fat: 7,  description: 'Aged & nutty' },
  { id: 'extra',      label: 'Extra Cheese', extraPrice: 60, calories: 140, fat: 11, description: 'Double mozzarella' },
  { id: 'double',     label: 'Double Loaded', extraPrice: 90, calories: 200, fat: 16, description: 'Maximum cheese' },
] as const;

// ── Veg Toppings ─────────────────────────────────────────────────────────────

export const VEG_TOPPINGS: readonly BuilderTopping[] = [
  { id: 'onion',       name: 'Onion',       category: 'veg', price: 25, calories: 10,  protein: 0.3, carbs: 2.5, fat: 0,   spiceLevel: 0, color: '#c084fc', accentColor: '#e9d5ff', popularity: 94, flavorIntensity: 'savory', textureType: 'crispy', recommendedPairing: 'Capsicum & Paneer' },
  { id: 'capsicum',    name: 'Capsicum',    category: 'veg', price: 25, calories: 8,   protein: 0.3, carbs: 1.5, fat: 0,   spiceLevel: 0, color: '#4ade80', accentColor: '#bbf7d0', popularity: 91, flavorIntensity: 'zesty', textureType: 'crispy', recommendedPairing: 'Onion & Sweet Corn' },
  { id: 'tomato',      name: 'Tomato',      category: 'veg', price: 20, calories: 5,   protein: 0.2, carbs: 1.0, fat: 0,   spiceLevel: 0, color: '#f87171', accentColor: '#fecaca', popularity: 82, flavorIntensity: 'zesty', textureType: 'juicy', recommendedPairing: 'Black Olives & Spinach' },
  { id: 'mushroom',    name: 'Mushroom',    category: 'veg', price: 35, calories: 7,   protein: 1.0, carbs: 1.0, fat: 0,   spiceLevel: 0, color: '#d4a574', accentColor: '#e8d5b7', popularity: 88, flavorIntensity: 'savory', textureType: 'tender', recommendedPairing: 'White Sauce & Chicken' },
  { id: 'corn',        name: 'Sweet Corn',  category: 'veg', price: 20, calories: 18,  protein: 0.5, carbs: 4.0, fat: 0.2, spiceLevel: 0, color: '#fbbf24', accentColor: '#fde68a', popularity: 95, flavorIntensity: 'mild', textureType: 'juicy', recommendedPairing: 'Paneer & Cheese Burst' },
  { id: 'jalapeno',    name: 'Jalapeños',   category: 'veg', price: 30, calories: 4,   protein: 0.1, carbs: 0.7, fat: 0,   spiceLevel: 4, color: '#16a34a', accentColor: '#86efac', popularity: 86, flavorIntensity: 'fiery', textureType: 'crispy', recommendedPairing: 'BBQ Sauce & Pepperoni' },
  { id: 'olive',       name: 'Black Olives', category: 'veg', price: 35, calories: 15, protein: 0.2, carbs: 0.8, fat: 1.4, spiceLevel: 0, color: '#1e293b', accentColor: '#64748b', popularity: 84, flavorIntensity: 'savory', textureType: 'tender', recommendedPairing: 'Tomato & Mushroom' },
  { id: 'spinach',     name: 'Spinach',     category: 'veg', price: 25, calories: 5,   protein: 0.7, carbs: 0.8, fat: 0,   spiceLevel: 0, color: '#15803d', accentColor: '#86efac', popularity: 76, flavorIntensity: 'mild', textureType: 'tender', recommendedPairing: 'Garlic Butter & Parmesan' },
  { id: 'baby-corn',   name: 'Baby Corn',   category: 'veg', price: 30, calories: 12,  protein: 0.4, carbs: 2.5, fat: 0.1, spiceLevel: 0, color: '#fde047', accentColor: '#fef9c3', popularity: 80, flavorIntensity: 'mild', textureType: 'crispy', recommendedPairing: 'Capsicum & Paneer' },
  { id: 'paneer',      name: 'Paneer',      category: 'veg', price: 50, calories: 52,  protein: 3.6, carbs: 1.2, fat: 4.0, spiceLevel: 0, color: '#fef3c7', accentColor: '#fffbeb', popularity: 97, flavorIntensity: 'savory', textureType: 'chewy', recommendedPairing: 'Spicy Sauce & Sweet Corn' },
  { id: 'broccoli',    name: 'Broccoli',    category: 'veg', price: 35, calories: 6,   protein: 0.6, carbs: 1.2, fat: 0,   spiceLevel: 0, color: '#166534', accentColor: '#bbf7d0', popularity: 72, flavorIntensity: 'mild', textureType: 'crispy', recommendedPairing: 'White Sauce & Mushroom' },
] as const;

// ── Non-Veg Toppings ─────────────────────────────────────────────────────────

export const NON_VEG_TOPPINGS: readonly BuilderTopping[] = [
  { id: 'chicken',   name: 'Chicken',   category: 'non-veg', price: 60, calories: 45,  protein: 5.5, carbs: 0,   fat: 2.5, spiceLevel: 1, color: '#fb923c', accentColor: '#fed7aa', popularity: 98, flavorIntensity: 'savory', textureType: 'tender', recommendedPairing: 'BBQ Sauce & Jalapeños' },
  { id: 'pepperoni', name: 'Pepperoni', category: 'non-veg', price: 70, calories: 55,  protein: 2.4, carbs: 0.2, fat: 5.0, spiceLevel: 2, color: '#dc2626', accentColor: '#fca5a5', popularity: 99, flavorIntensity: 'smoky', textureType: 'crispy', recommendedPairing: 'Extra Cheese & Jalapeños' },
  { id: 'sausage',   name: 'Sausage',   category: 'non-veg', price: 65, calories: 60,  protein: 3.0, carbs: 0.5, fat: 5.0, spiceLevel: 1, color: '#b45309', accentColor: '#fcd34d', popularity: 89, flavorIntensity: 'savory', textureType: 'chewy', recommendedPairing: 'Onion & Capsicum' },
  { id: 'bacon',     name: 'Bacon',     category: 'non-veg', price: 75, calories: 70,  protein: 3.5, carbs: 0,   fat: 6.0, spiceLevel: 0, color: '#991b1b', accentColor: '#fca5a5', popularity: 92, flavorIntensity: 'smoky', textureType: 'crispy', recommendedPairing: 'Cheddar & Chicken' },
] as const;

/** All toppings combined */
export const ALL_TOPPINGS: readonly BuilderTopping[] = [...VEG_TOPPINGS, ...NON_VEG_TOPPINGS];

// ── Seasonings ───────────────────────────────────────────────────────────────

export const BUILDER_SEASONINGS: readonly BuilderSeasoning[] = [
  { id: 'oregano',      name: 'Oregano',      price: 10, calories: 3 },
  { id: 'mixed-herbs',  name: 'Mixed Herbs',  price: 15, calories: 4 },
  { id: 'chilli-flakes', name: 'Chilli Flakes', price: 10, calories: 2 },
] as const;

// ── Default builder config ───────────────────────────────────────────────────

export const DEFAULT_BUILDER_CONFIG: Readonly<CustomPizzaConfig> = Object.freeze({
  name: 'My Custom Pizza',
  size: 'medium',
  crust: 'hand-tossed',
  sauce: 'tomato',
  cheese: 'mozzarella',
  toppings: [],
  seasonings: [],
  quantity: 1,
});

// ── Lookup helpers (O(1) maps built once) ────────────────────────────────────

const sizeMap = new Map(BUILDER_SIZES.map(s => [s.id, s]));
const crustMap = new Map(BUILDER_CRUSTS.map(c => [c.id, c]));
const sauceMap = new Map(BUILDER_SAUCES.map(s => [s.id, s]));
const cheeseMap = new Map(BUILDER_CHEESES.map(c => [c.id, c]));
const toppingMap = new Map(ALL_TOPPINGS.map(t => [t.id, t]));
const seasoningMap = new Map(BUILDER_SEASONINGS.map(s => [s.id, s]));

export const getSize = (id: BuilderSize): BuilderSizeOption | undefined => sizeMap.get(id);
export const getCrust = (id: BuilderCrustId): BuilderCrustOption | undefined => crustMap.get(id);
export const getSauce = (id: BuilderSauceId): BuilderSauceOption | undefined => sauceMap.get(id);
export const getCheese = (id: BuilderCheeseId): BuilderCheeseOption | undefined => cheeseMap.get(id);
export const getTopping = (id: string): BuilderTopping | undefined => toppingMap.get(id);
export const getSeasoning = (id: string): BuilderSeasoning | undefined => seasoningMap.get(id);

// ── Price calculator ─────────────────────────────────────────────────────────

/**
 * Calculates the total unit price for a custom pizza configuration.
 * Unit price = size base + crust extra + sauce extra + cheese extra + toppings + seasonings
 */
export function calculateUnitPrice(config: CustomPizzaConfig): number {
  const size = getSize(config.size);
  const crust = getCrust(config.crust);
  const sauce = getSauce(config.sauce);
  const cheese = getCheese(config.cheese);

  let price = (size?.price ?? 349)
    + (crust?.extraPrice ?? 0)
    + (sauce?.extraPrice ?? 0)
    + (cheese?.extraPrice ?? 0);

  for (const st of config.toppings) {
    const topping = getTopping(st.toppingId);
    if (topping) price += topping.price * st.quantity;
  }

  for (const sid of config.seasonings) {
    const seasoning = getSeasoning(sid);
    if (seasoning) price += seasoning.price;
  }

  return price;
}

// ── Nutrition calculator ─────────────────────────────────────────────────────

/**
 * Calculates approximate nutrition info for a custom pizza configuration.
 * Base calories come from size, modified by crust multiplier, then
 * sauce, cheese, toppings, and seasonings add their individual values.
 */
export function calculateNutrition(config: CustomPizzaConfig): NutritionInfo {
  const size = getSize(config.size);
  const crust = getCrust(config.crust);
  const sauce = getSauce(config.sauce);
  const cheese = getCheese(config.cheese);

  const baseCalories = (size?.baseCalories ?? 1200) * (crust?.calorieMultiplier ?? 1.0);

  let calories = baseCalories + (sauce?.calories ?? 0) + (cheese?.calories ?? 0);
  // Base macros scale with size (medium = 1x)
  const sizeScale = (size?.baseCalories ?? 1200) / 1200;
  let protein = 12 * sizeScale; // base dough protein
  let carbs = 36 * sizeScale;   // base dough carbs
  let fat = 8 * sizeScale + (cheese?.fat ?? 0);

  for (const st of config.toppings) {
    const topping = getTopping(st.toppingId);
    if (topping) {
      calories += topping.calories * st.quantity;
      protein += topping.protein * st.quantity;
      carbs += topping.carbs * st.quantity;
      fat += topping.fat * st.quantity;
    }
  }

  for (const sid of config.seasonings) {
    const seasoning = getSeasoning(sid);
    if (seasoning) calories += seasoning.calories;
  }

  return {
    calories: Math.round(calories),
    protein: Math.round(protein * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    fat: Math.round(fat * 10) / 10,
  };
}

// ── Spice level calculator ───────────────────────────────────────────────────

/**
 * Returns overall spice level (0–5) based on sauce + toppings.
 * Uses a weighted average: sauce contributes 40%, toppings 60%.
 */
export function calculateSpiceLevel(config: CustomPizzaConfig): number {
  const sauce = getSauce(config.sauce);
  const sauceSpice = sauce?.spiceLevel ?? 0;

  if (config.toppings.length === 0) return sauceSpice;

  let toppingSpiceSum = 0;
  let toppingCount = 0;
  for (const st of config.toppings) {
    const topping = getTopping(st.toppingId);
    if (topping && topping.spiceLevel > 0) {
      toppingSpiceSum += topping.spiceLevel * st.quantity;
      toppingCount += st.quantity;
    }
  }

  const avgToppingSpice = toppingCount > 0 ? toppingSpiceSum / toppingCount : 0;
  const combined = sauceSpice * 0.4 + avgToppingSpice * 0.6;

  return Math.min(5, Math.round(combined * 10) / 10);
}

// ── Prep & delivery estimates ────────────────────────────────────────────────

/**
 * Returns preparation time in minutes based on size + number of toppings.
 */
export function calculatePrepTime(config: CustomPizzaConfig): number {
  const size = getSize(config.size);
  const base = size?.prepTimeMin ?? 15;
  const toppingCount = config.toppings.reduce((sum, t) => sum + t.quantity, 0);
  // Each topping adds ~30 seconds, max +5 minutes
  const toppingTime = Math.min(5, Math.ceil(toppingCount * 0.5));
  return base + toppingTime;
}

/**
 * Returns estimated delivery time range string.
 */
export function calculateDeliveryEstimate(config: CustomPizzaConfig): string {
  const prep = calculatePrepTime(config);
  const deliveryBase = 15; // base delivery minutes
  const min = prep + deliveryBase;
  const max = min + 10;
  return `${min}–${max} min`;
}

// ── Topping position generator (deterministic pseudo-random) ─────────────────

/**
 * Generates deterministic positions for toppings on the pizza preview.
 * Uses a seeded hash to ensure same topping always appears in the same spots.
 * Returns an array of { x, y, rotation } values (percentages, 0–100).
 */
export function generateToppingPositions(
  toppingId: string,
  quantity: number,
  index: number
): Array<{ x: number; y: number; rotation: number; scale: number }> {
  // Simple hash function for deterministic positioning
  const hash = (str: string, seed: number): number => {
    let h = seed;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  };

  const positions: Array<{ x: number; y: number; rotation: number; scale: number }> = [];
  const count = Math.min(quantity * 3, 12); // max 12 pieces per topping

  for (let i = 0; i < count; i++) {
    const seed = hash(toppingId, i + index * 100);
    // Place within a circle (avoid edges): radius 10–40% from center
    const angle = ((seed % 360) * Math.PI) / 180;
    const radius = 12 + (seed % 28); // 12–40% from center
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    const rotation = seed % 360;
    const scale = 0.7 + (seed % 40) / 100; // 0.7–1.1

    positions.push({ x, y, rotation, scale });
  }

  return positions;
}
