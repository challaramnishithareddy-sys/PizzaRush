import React from 'react';
import type { BuilderCheeseId } from '../../../types/builderTypes';

interface OilReflectionLayerProps {
  cheese: BuilderCheeseId;
}

/**
 * Glossy oil reflection sheen rendered above melted cheese.
 * Opacity scales naturally with cheese richness (e.g. double cheese = more sheen).
 */
export const OilReflectionLayer: React.FC<OilReflectionLayerProps> = React.memo(({ cheese }) => {
  const opacity = cheese === 'double' ? 0.45 : cheese === 'extra' ? 0.35 : 0.25;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: `
          radial-gradient(circle at 35% 30%, rgba(255, 255, 255, ${opacity}) 0%, transparent 45%),
          radial-gradient(circle at 65% 70%, rgba(255, 255, 255, ${opacity * 0.7}) 0%, transparent 40%)
        `,
        pointerEvents: 'none',
        transition: 'opacity var(--ease-panel)',
        zIndex: 4.5,
      }}
    />
  );
});

OilReflectionLayer.displayName = 'OilReflectionLayer';
