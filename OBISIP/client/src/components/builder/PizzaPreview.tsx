import React, { useState } from 'react';
import type {
  BuilderSize,
  BuilderCrustId,
  BuilderSauceId,
  BuilderCheeseId,
  SelectedTopping,
} from '../../types/builderTypes';
import {
  SIZE_DIMENSIONS,
  CAMERA_PRESETS,
  AMBIANCE_PRESETS,
} from '../../data/pizzaVisualTokens';
import { BoardLayer } from './layers/BoardLayer';
import { ShadowLayer } from './layers/ShadowLayer';
import { CrustLayer } from './layers/CrustLayer';
import { SauceLayer } from './layers/SauceLayer';
import { CheeseLayer } from './layers/CheeseLayer';
import { OilReflectionLayer } from './layers/OilReflectionLayer';
import { ToppingLayer } from './layers/ToppingLayer';
import { LightingLayer } from './layers/LightingLayer';
import { SteamLayer } from './layers/SteamLayer';
import { CameraControls } from './CameraControls';

export interface PizzaPreviewProps {
  size: BuilderSize;
  crust: BuilderCrustId;
  sauce: BuilderSauceId;
  cheese: BuilderCheeseId;
  toppings: readonly SelectedTopping[];
}

/**
 * Commercial 3D Pizza Studio Preview Component.
 * Features 700ms Chef Camera angle switching, wooden board stage, multi-layer depth lighting,
 * and dynamic environment backgrounds.
 */
export const PizzaPreview: React.FC<PizzaPreviewProps> = React.memo(
  ({ size, crust, sauce, cheese, toppings }) => {
    const [cameraPreset, setCameraPreset] = useState<'top' | 'angle30' | 'angle45' | 'macro' | 'cinematic'>('top');
    const [ambiance, setAmbiance] = useState<'pizzeria' | 'night' | 'kitchen' | 'minimal'>('pizzeria');

    const dimensions = SIZE_DIMENSIONS[size] || SIZE_DIMENSIONS.medium;
    const camera = CAMERA_PRESETS[cameraPreset] || CAMERA_PRESETS.top;
    const env = AMBIANCE_PRESETS[ambiance] || AMBIANCE_PRESETS.pizzeria;

    return (
      <div
        className="pizza-preview-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--elevation-3)',
        }}
      >
        {/* Top Chef Camera & Environment Control Bar */}
        <CameraControls
          activePreset={cameraPreset}
          activeAmbiance={ambiance}
          onSelectPreset={setCameraPreset}
          onSelectAmbiance={setAmbiance}
        />

        {/* Interactive Pizza Visual Stage */}
        <div
          className="pizza-preview-wrapper"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-8) var(--space-6)',
            minHeight: '450px',
            background: env.background,
            transition: 'background var(--ease-panel)',
            overflow: 'hidden',
          }}
        >
          {/* Floating Flour Dust Particles */}
          <div className="flour-dust-particle" style={{ top: '20%', left: '15%', animationDelay: '0s' }} />
          <div className="flour-dust-particle" style={{ top: '65%', left: '80%', animationDelay: '2s' }} />
          <div className="flour-dust-particle" style={{ top: '40%', left: '85%', animationDelay: '4s' }} />
          <div className="flour-dust-particle" style={{ top: '80%', left: '25%', animationDelay: '1s' }} />
          {/* Ambient Lighting Environment Glow Overlay */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at 50% 40%, ${env.glowColor} 0%, transparent 65%)`,
              pointerEvents: 'none',
              transition: 'background var(--ease-panel)',
            }}
          />

          {/* 3D Camera Transformed Pizza Stage */}
          <div
            className="pizza-stage"
            style={{
              position: 'relative',
              width: `${dimensions.desktopPx}px`,
              height: `${dimensions.desktopPx}px`,
              transform: camera.transform,
              transition: 'transform var(--ease-camera), width var(--ease-panel), height var(--ease-panel)',
              willChange: 'transform, width, height',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Layer 0: Wooden Pizza Board */}
            <BoardLayer />

            {/* Layer 1: Ambient Drop Shadow */}
            <ShadowLayer />

            {/* Layer 2: Outer Crust Ring */}
            <CrustLayer crust={crust}>
              {/* Layer 3: Sauce Base */}
              <SauceLayer sauce={sauce}>
                {/* Layer 4: Cheese Melt */}
                <CheeseLayer cheese={cheese}>
                  {/* Layer 4.5: Glossy Oil Reflection Sheen */}
                  <OilReflectionLayer cheese={cheese} />

                  {/* Layer 5: Dynamic Topping Pieces */}
                  {toppings.map((t) => (
                    <ToppingLayer
                      key={t.toppingId}
                      toppingId={t.toppingId}
                      quantity={t.quantity}
                      size={size}
                      crust={crust}
                      sauce={sauce}
                      cheese={cheese}
                    />
                  ))}

                  {/* Layer 6: Ambient Oven Lighting Highlight */}
                  <LightingLayer />
                </CheeseLayer>
              </SauceLayer>
            </CrustLayer>

            {/* Layer 7: Hot Steam Particles */}
            <SteamLayer />
          </div>
        </div>
      </div>
    );
  }
);

PizzaPreview.displayName = 'PizzaPreview';

