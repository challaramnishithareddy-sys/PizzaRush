import React from 'react';
import type { BuilderSauceId } from '../../../types/builderTypes';
import { SAUCE_VISUALS } from '../../../data/pizzaVisualTokens';

interface SauceLayerProps {
  sauce: BuilderSauceId;
  children?: React.ReactNode;
}

/**
 * Base sauce layer rendered directly inside the crust ring.
 */
export const SauceLayer: React.FC<SauceLayerProps> = React.memo(({ sauce, children }) => {
  const token = SAUCE_VISUALS[sauce] || SAUCE_VISUALS.tomato;

  return (
    <div
      aria-label={`${sauce} sauce`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: token.gradient,
        opacity: token.opacity,
        boxShadow: 'inset 0 0 12px rgba(0, 0, 0, 0.3)',
        transition: 'background var(--transition-normal), opacity var(--transition-normal)',
        boxSizing: 'border-box',
        zIndex: 3,
      }}
    >
      {children}
    </div>
  );
});

SauceLayer.displayName = 'SauceLayer';
