import { useMemo } from 'react';
import { useBuilderStore } from '../store/builderStore';
import {
  calculateUnitPrice,
  calculateNutrition,
  calculateSpiceLevel,
  calculatePrepTime,
  calculateDeliveryEstimate,
  getSauce,
} from '../data/builderData';
import type { NutritionInfo } from '../types/builderTypes';

export interface BuilderMetrics {
  unitPrice: number;
  totalPrice: number;
  nutrition: NutritionInfo;
  spiceLevel: number;
  prepTimeMin: number;
  deliveryEstimate: string;
  toppingCount: number;
  qualityScore: number;
  aiRecommendation: {
    confidence: number;
    explanation: string;
  };
  personality: {
    title: string;
    icon: string;
    description: string;
    color: string;
  };
  flavors: {
    savory: number;
    zesty: number;
    creaminess: number;
    smokiness: number;
  };
}

/**
 * Pure memoized custom hook deriving price, nutrition, spice, and prep time metrics
 * for the current pizza builder configuration.
 *
 * Ensures all Phase 1C components (NutritionPanel, SpiceMeter, BuilderSidebar)
 * consume identical derived metrics without duplicating calculations or polluting Zustand.
 */
export function useBuilderMetrics(): BuilderMetrics {
  const config = useBuilderStore((s) => s.config);

  return useMemo(() => {
    const unitPrice = calculateUnitPrice(config);
    const totalPrice = unitPrice * config.quantity;
    const nutrition = calculateNutrition(config);
    const spiceLevel = calculateSpiceLevel(config);
    const prepTimeMin = calculatePrepTime(config);
    const deliveryEstimate = calculateDeliveryEstimate(config);

    // Pizza Quality Score heuristic (0–100)
    const toppingCount = config.toppings.reduce((sum, t) => sum + t.quantity, 0);
    const balance = toppingCount >= 2 && toppingCount <= 6 ? 95 : toppingCount === 1 ? 85 : 78;
    const texture = config.crust === 'cheese-burst' || config.crust === 'pan' ? 92 : 88;
    const spiceHarmony = spiceLevel <= 3 ? 96 : 84;
    const qualityScore = Math.round((balance * 0.4 + texture * 0.3 + spiceHarmony * 0.3));

    // Dynamic AI Recommendation Explanation
    const sauce = getSauce(config.sauce);
    let recConfidence = 96;
    let recExplanation = `${sauce?.label || 'Tomato'} sauce creates a balanced flavor baseline.`;

    if (config.toppings.some((t) => t.toppingId === 'chicken') && config.sauce === 'bbq') {
      recConfidence = 98;
      recExplanation = 'BBQ sauce balances grilled chicken and enhances smoky flavor.';
    } else if (config.toppings.some((t) => t.toppingId === 'paneer') && config.sauce === 'spicy') {
      recConfidence = 97;
      recExplanation = 'Fiery chilli base enhances rich grilled paneer cubes.';
    } else if (toppingCount >= 4) {
      recConfidence = 94;
      recExplanation = 'Rich ingredient variety delivers a satisfying multi-texture feast.';
    }

    // Dynamic Pizza Personality Archetype
    let personality = {
      title: 'Balanced Artisan',
      icon: '⚖️',
      description: 'Harmonious blend of flavors and textures',
      color: '46, 196, 182',
    };

    if (spiceLevel >= 3.5) {
      personality = {
        title: 'Fiery Inferno',
        icon: '🔥',
        description: 'Bold, spicy heat with kick',
        color: '239, 68, 68',
      };
    } else if (config.cheese === 'extra' || config.cheese === 'double' || config.crust === 'cheese-burst') {
      personality = {
        title: 'Cheesy Monster',
        icon: '🧀',
        description: 'Gooey, extra melted cheese bliss',
        color: '245, 158, 11',
      };
    } else if (config.toppings.some((t) => t.toppingId === 'pepperoni' || t.toppingId === 'bacon')) {
      personality = {
        title: 'Meat Lovers Loaded',
        icon: '🥓',
        description: 'Savory, smoky cured meats',
        color: '220, 38, 38',
      };
    } else if (config.toppings.length >= 3 && config.toppings.every((t) => ['onion', 'capsicum', 'tomato', 'mushroom', 'corn'].includes(t.toppingId))) {
      personality = {
        title: 'Garden Fresh',
        icon: '🌿',
        description: 'Crisp, wholesome vegetarian toppings',
        color: '34, 197, 94',
      };
    }

    // Dynamic Flavor Radar Metrics (0-100)
    let savory = 50 + (config.toppings.length * 8);
    let zesty = config.sauce === 'spicy' || config.sauce === 'tomato' ? 75 : 45;
    let creaminess = config.cheese === 'extra' || config.cheese === 'double' ? 90 : config.cheese === 'mozzarella' ? 70 : 50;
    let smokiness = config.sauce === 'bbq' || config.toppings.some((t) => t.toppingId === 'bacon' || t.toppingId === 'pepperoni') ? 85 : 30;

    savory = Math.min(100, savory);
    zesty = Math.min(100, zesty);
    creaminess = Math.min(100, creaminess);
    smokiness = Math.min(100, smokiness);

    return {
      unitPrice,
      totalPrice,
      nutrition,
      spiceLevel,
      prepTimeMin,
      deliveryEstimate,
      toppingCount,
      qualityScore,
      aiRecommendation: {
        confidence: recConfidence,
        explanation: recExplanation,
      },
      personality,
      flavors: {
        savory,
        zesty,
        creaminess,
        smokiness,
      },
    };
  }, [config]);
}
