import React from 'react';
import type { BuilderCheeseId } from '../../../types/builderTypes';
import { CHEESE_VISUALS } from '../../../data/pizzaVisualTokens';

interface CheeseLayerProps {
  cheese: BuilderCheeseId;
  children?: React.ReactNode;
}

/**
 * Melted cheese layer rendered over sauce with subtle texture dots.
 */
export const CheeseLayer: React.FC<CheeseLayerProps> = React.memo(({ cheese, children }) => {
  const token = CHEESE_VISUALS[cheese] || CHEESE_VISUALS.mozzarella;

  return (
    <div
      aria-label={`${cheese} cheese`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: token.gradient,
        opacity: token.opacity,
        boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.45)',
        transition: 'background var(--ease-panel), opacity var(--ease-panel)',
        boxSizing: 'border-box',
        zIndex: 4,
      }}
    >
      {/* Melted Cheese Bubble Clusters */}
      {token.meltDots && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.7) 3px, transparent 3px),
              radial-gradient(circle at 65% 25%, rgba(255, 255, 255, 0.6) 4px, transparent 4px),
              radial-gradient(circle at 40% 70%, rgba(255, 255, 255, 0.65) 3px, transparent 3px),
              radial-gradient(circle at 80% 60%, rgba(255, 255, 255, 0.7) 4px, transparent 4px)
            `,
            pointerEvents: 'none',
          }}
        />
      )}
      {/* Browned Cheese Oven Patches */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          backgroundImage: `
            radial-gradient(circle at 45% 35%, rgba(180, 100, 20, 0.25) 0px, transparent 18px),
            radial-gradient(circle at 75% 65%, rgba(180, 100, 20, 0.2) 0px, transparent 15px),
            radial-gradient(circle at 30% 75%, rgba(180, 100, 20, 0.22) 0px, transparent 16px)
          `,
          pointerEvents: 'none',
        }}
      />
      {children}
    </div>
  );
});

CheeseLayer.displayName = 'CheeseLayer';
