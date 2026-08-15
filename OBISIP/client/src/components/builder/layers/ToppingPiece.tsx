import React from 'react';
import type {
  BuilderSize,
  BuilderCrustId,
  BuilderSauceId,
  BuilderCheeseId,
} from '../../../types/builderTypes';
import { TOPPING_VISUALS, DEFAULT_TOPPING_VISUAL } from '../../../data/pizzaVisualTokens';
import { getTopping } from '../../../data/builderData';

interface ToppingPieceProps {
  toppingId: string;
  pieceIndex: number;
  size: BuilderSize;
  crust: BuilderCrustId;
  sauce: BuilderSauceId;
  cheese: BuilderCheeseId;
}

/**
 * Deterministic hash function using all 6 variables:
 * seed = hash(size + crust + sauce + cheese + toppingId + pieceIndex)
 */
function computePieceHash(
  size: BuilderSize,
  crust: BuilderCrustId,
  sauce: BuilderSauceId,
  cheese: BuilderCheeseId,
  toppingId: string,
  pieceIndex: number
): number {
  const seedString = `${size}-${crust}-${sauce}-${cheese}-${toppingId}-${pieceIndex}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = ((hash << 5) - hash + seedString.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Renders a single topping piece using pure CSS vector styling (no emojis).
 * Uses transform & opacity animations for 60fps performance budget.
 */
export const ToppingPiece: React.FC<ToppingPieceProps> = React.memo(
  ({ toppingId, pieceIndex, size, crust, sauce, cheese }) => {
    const toppingData = getTopping(toppingId);
    const visual = TOPPING_VISUALS[toppingId] || DEFAULT_TOPPING_VISUAL;

    const seed = computePieceHash(size, crust, sauce, cheese, toppingId, pieceIndex);

    // Placement Heuristic Rules:
    // Large toppings stay closer to center (15% - 32% radius) to avoid crust overlap
    // Small toppings can spread further (12% - 42% radius)
    const isLarge = ['pepperoni', 'paneer', 'chicken', 'bacon', 'capsicum'].includes(toppingId);
    const minRadius = isLarge ? 15 : 12;
    const maxRadius = isLarge ? 32 : 42;
    const radiusRange = maxRadius - minRadius;

    const angle = ((seed % 360) * Math.PI) / 180;
    const radius = minRadius + ((seed >> 3) % radiusRange);
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    const rotation = (seed >> 5) % 360;
    const scale = 0.82 + ((seed >> 8) % 30) / 100;

    const color = toppingData?.color || '#ef4444';
    const accentColor = toppingData?.accentColor || '#fca5a5';

    // Specialized visual enhancements per ingredient type
    const isPepperoni = toppingId === 'pepperoni';
    const isPaneer = toppingId === 'paneer';
    const isCorn = toppingId === 'corn';
    const isOnion = toppingId === 'onion';

    return (
      <div
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          width: `${visual.width}px`,
          height: `${visual.height}px`,
          borderRadius: visual.borderRadius,
          backgroundColor: isPaneer
            ? undefined
            : isCorn
            ? color
            : isPepperoni
            ? color
            : isOnion
            ? 'rgba(192, 132, 252, 0.25)'
            : color,
          backgroundImage: isPaneer
            ? 'repeating-linear-gradient(45deg, #fef3c7, #fef3c7 4px, #d97706 4px, #d97706 6px)'
            : isPepperoni
            ? 'radial-gradient(circle at 35% 35%, #ef4444 0%, #991b1b 100%)'
            : undefined,
          border: visual.border || `1px solid ${accentColor}`,
          boxShadow: isPepperoni
            ? '0 3px 6px rgba(0,0,0,0.5), inset 0 2px 3px rgba(0,0,0,0.4)'
            : `0 2px 5px rgba(0,0,0,0.35), inset 0 1px 2px ${accentColor}`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
          transition: 'transform var(--ease-selection), opacity var(--ease-selection)',
          animation: 'toppingDrop 320ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          willChange: 'transform, opacity',
          pointerEvents: 'none',
        }}
      />
    );
  }
);

ToppingPiece.displayName = 'ToppingPiece';
