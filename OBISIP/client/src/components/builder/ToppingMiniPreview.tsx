import React from 'react';
import type { BuilderTopping } from '../../types/builderTypes';

interface ToppingMiniPreviewProps {
  topping: BuilderTopping;
}

/**
 * Mini 50px CSS pizza inspector rendered on ingredient card hover.
 * Highlights the exact visual piece shape, color, and texture of the hovered ingredient.
 */
export const ToppingMiniPreview: React.FC<ToppingMiniPreviewProps> = React.memo(({ topping }) => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #dfa55b 0%, #b87c33 100%)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
        padding: '5px',
        boxSizing: 'border-box',
        flexShrink: 0,
      }}
    >
      {/* Cheese Base */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fef9c3 0%, #fde047 100%)',
          position: 'relative',
        }}
      >
        {/* Render 4 sample pieces of hovered topping */}
        {[
          { top: '25%', left: '30%', rot: 15 },
          { top: '25%', left: '60%', rot: -20 },
          { top: '60%', left: '35%', rot: 45 },
          { top: '55%', left: '65%', rot: -10 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              width: '10px',
              height: '10px',
              borderRadius: topping.id === 'pepperoni' || topping.id === 'corn' ? '50%' : '3px',
              backgroundColor: topping.color,
              border: `1px solid ${topping.accentColor}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
              transform: `translate(-50%, -50%) rotate(${pos.rot}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
});

ToppingMiniPreview.displayName = 'ToppingMiniPreview';
