import React from 'react';
import type { BuilderCrustId } from '../../../types/builderTypes';
import { CRUST_VISUALS } from '../../../data/pizzaVisualTokens';

interface CrustLayerProps {
  crust: BuilderCrustId;
  children?: React.ReactNode;
}

/**
 * Outer crust layer rendering the golden crust border and texture.
 */
export const CrustLayer: React.FC<CrustLayerProps> = React.memo(({ crust, children }) => {
  const token = CRUST_VISUALS[crust] || CRUST_VISUALS['hand-tossed'];

  return (
    <div
      aria-label={`${crust} crust`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: token.textureGradient,
        boxShadow: token.shadow,
        padding: token.borderWidth,
        transition: 'padding var(--ease-panel), background var(--ease-panel)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        zIndex: 2,
      }}
    >
      {/* Baked Crust Browned Spots Overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          backgroundImage: `
            radial-gradient(circle at 15% 20%, rgba(85, 35, 10, 0.45) 0px, transparent 14px),
            radial-gradient(circle at 85% 30%, rgba(95, 40, 12, 0.4) 0px, transparent 16px),
            radial-gradient(circle at 70% 85%, rgba(75, 30, 8, 0.5) 0px, transparent 12px),
            radial-gradient(circle at 25% 75%, rgba(90, 38, 11, 0.45) 0px, transparent 15px)
          `,
          pointerEvents: 'none',
        }}
      />
      {/* Top-Left Light Reflection Rim */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 25% 20%, rgba(255, 255, 255, 0.18) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />
      {children}
    </div>
  );
});

CrustLayer.displayName = 'CrustLayer';
