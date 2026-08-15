import React from 'react';
import { SHADOW_VALUES } from '../../../data/pizzaVisualTokens';

/**
 * Pure presentation layer: Renders realistic 3D drop shadow beneath pizza base.
 * Memoized to avoid unnecessary re-renders.
 */
export const ShadowLayer: React.FC = React.memo(() => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: '-10px',
        borderRadius: '50%',
        boxShadow: SHADOW_VALUES.dropShadow,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
});

ShadowLayer.displayName = 'ShadowLayer';
