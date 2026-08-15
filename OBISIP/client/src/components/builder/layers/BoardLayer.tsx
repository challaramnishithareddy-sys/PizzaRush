import React from 'react';
import { BOARD_VISUALS } from '../../../data/pizzaVisualTokens';

/**
 * Wooden pizza board layer rendered beneath the pizza stage.
 * Provides a warm, authentic pizzeria tabletop aesthetic.
 */
export const BoardLayer: React.FC = React.memo(() => {
  const token = BOARD_VISUALS.oak;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: '-28px',
        borderRadius: '50%',
        background: token.background,
        boxShadow: token.shadow,
        border: `2px solid ${token.borderColor}`,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Wood Ring Pattern Texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          backgroundImage: token.ringGradient,
          opacity: 0.65,
        }}
      />
      {/* Subtle Board Edge Light Highlight */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)',
        }}
      />
    </div>
  );
});

BoardLayer.displayName = 'BoardLayer';
