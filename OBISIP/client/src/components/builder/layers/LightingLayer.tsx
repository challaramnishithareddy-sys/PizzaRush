import React from 'react';

/**
 * Pure presentation layer rendering ambient oven highlight gradient overlay over pizza.
 */
export const LightingLayer: React.FC = React.memo(() => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 65%)',
        pointerEvents: 'none',
        zIndex: 6,
      }}
    />
  );
});

LightingLayer.displayName = 'LightingLayer';
