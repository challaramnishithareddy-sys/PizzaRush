/**
 * Visual design system & design tokens for the layered CSS pizza preview.
 *
 * Centralized color palettes, gradients, shape styles, sizes, and animations
 * for realistic, high-performance (60fps) pizza rendering without emojis or canvas.
 */

import type {
  BuilderSize,
  BuilderCrustId,
  BuilderSauceId,
  BuilderCheeseId,
} from '../types/builderTypes';

// ── Crust Visual Tokens ──────────────────────────────────────────────────────

export interface CrustVisualToken {
  borderWidth: string; // Crust edge thickness
  color: string;
  shadow: string;
  textureGradient: string;
}

export const CRUST_VISUALS: Record<BuilderCrustId, CrustVisualToken> = {
  thin: {
    borderWidth: '12px',
    color: '#d9a768',
    shadow: 'inset 0 0 10px rgba(139, 69, 19, 0.4)',
    textureGradient: 'radial-gradient(circle, #e6b87d 0%, #c49152 100%)',
  },
  'hand-tossed': {
    borderWidth: '18px',
    color: '#cd9348',
    shadow: 'inset 0 0 14px rgba(101, 48, 11, 0.5)',
    textureGradient: 'radial-gradient(circle, #dfa55b 0%, #b87c33 100%)',
  },
  'cheese-burst': {
    borderWidth: '22px',
    color: '#f3b043',
    shadow: 'inset 0 0 16px rgba(180, 83, 9, 0.6), 0 0 8px rgba(251, 191, 36, 0.4)',
    textureGradient: 'radial-gradient(circle, #fbbf24 0%, #d97706 100%)',
  },
  stuffed: {
    borderWidth: '24px',
    color: '#c28338',
    shadow: 'inset 0 0 18px rgba(120, 53, 15, 0.6)',
    textureGradient: 'radial-gradient(circle, #d99748 0%, #a16207 100%)',
  },
  pan: {
    borderWidth: '20px',
    color: '#b47328',
    shadow: 'inset 0 0 16px rgba(88, 38, 8, 0.6)',
    textureGradient: 'radial-gradient(circle, #ca8a34 0%, #92400e 100%)',
  },
  'whole-wheat': {
    borderWidth: '18px',
    color: '#9a6432',
    shadow: 'inset 0 0 14px rgba(69, 36, 12, 0.5)',
    textureGradient: 'radial-gradient(circle, #b07842 0%, #78350f 100%)',
  },
};

// ── Sauce Visual Tokens ──────────────────────────────────────────────────────

export interface SauceVisualToken {
  color: string;
  gradient: string;
  opacity: number;
}

export const SAUCE_VISUALS: Record<BuilderSauceId, SauceVisualToken> = {
  tomato: {
    color: '#b91c1c',
    gradient: 'radial-gradient(circle, #dc2626 0%, #991b1b 100%)',
    opacity: 0.95,
  },
  bbq: {
    color: '#451a03',
    gradient: 'radial-gradient(circle, #78350f 0%, #451a03 100%)',
    opacity: 0.92,
  },
  white: {
    color: '#fef3c7',
    gradient: 'radial-gradient(circle, #fffbeb 0%, #fde68a 100%)',
    opacity: 0.9,
  },
  'garlic-butter': {
    color: '#facc15',
    gradient: 'radial-gradient(circle, #fef08a 0%, #eab308 100%)',
    opacity: 0.85,
  },
  spicy: {
    color: '#ef4444',
    gradient: 'radial-gradient(circle, #f87171 0%, #b91c1c 100%)',
    opacity: 0.95,
  },
};

// ── Cheese Visual Tokens ─────────────────────────────────────────────────────

export interface CheeseVisualToken {
  color: string;
  gradient: string;
  opacity: number;
  meltDots: boolean;
}

export const CHEESE_VISUALS: Record<BuilderCheeseId, CheeseVisualToken> = {
  mozzarella: {
    color: '#fef9c3',
    gradient: 'radial-gradient(circle, rgba(254,252,232,0.92) 0%, rgba(254,240,138,0.85) 100%)',
    opacity: 0.88,
    meltDots: true,
  },
  cheddar: {
    color: '#fde047',
    gradient: 'radial-gradient(circle, rgba(254,224,71,0.92) 0%, rgba(202,138,4,0.85) 100%)',
    opacity: 0.9,
    meltDots: true,
  },
  parmesan: {
    color: '#fef3c7',
    gradient: 'radial-gradient(circle, rgba(254,243,199,0.85) 0%, rgba(253,230,138,0.75) 100%)',
    opacity: 0.8,
    meltDots: false,
  },
  extra: {
    color: '#fef08a',
    gradient: 'radial-gradient(circle, rgba(254,252,232,0.96) 0%, rgba(250,204,21,0.9) 100%)',
    opacity: 0.95,
    meltDots: true,
  },
  double: {
    color: '#facc15',
    gradient: 'radial-gradient(circle, rgba(254,240,138,0.98) 0%, rgba(234,179,8,0.92) 100%)',
    opacity: 0.98,
    meltDots: true,
  },
};

// ── Size Dimension Tokens ────────────────────────────────────────────────────

export const SIZE_DIMENSIONS: Record<BuilderSize, { desktopPx: number; mobilePx: number }> = {
  personal: { desktopPx: 220, mobilePx: 180 },
  small:    { desktopPx: 260, mobilePx: 210 },
  medium:   { desktopPx: 300, mobilePx: 240 },
  large:    { desktopPx: 340, mobilePx: 270 },
  family:   { desktopPx: 380, mobilePx: 300 },
};

// ── Topping Shape & Visual Tokens ───────────────────────────────────────────

export type ToppingShapeType = 'ring' | 'circle' | 'wedge' | 'cube' | 'leaf' | 'strip';

export interface ToppingVisualToken {
  shape: ToppingShapeType;
  width: number;  // px
  height: number; // px
  borderRadius: string;
  border?: string;
  innerHighlight?: string;
}

export const TOPPING_VISUALS: Record<string, ToppingVisualToken> = {
  onion: {
    shape: 'ring',
    width: 22,
    height: 22,
    borderRadius: '50%',
    border: '3px solid #e9d5ff',
  },
  capsicum: {
    shape: 'strip',
    width: 24,
    height: 10,
    borderRadius: '4px',
    border: '1px solid #166534',
  },
  tomato: {
    shape: 'wedge',
    width: 18,
    height: 18,
    borderRadius: '50% 0 50% 50%',
    border: '1px solid #991b1b',
  },
  mushroom: {
    shape: 'wedge',
    width: 20,
    height: 16,
    borderRadius: '10px 10px 4px 4px',
    innerHighlight: '#78350f',
  },
  corn: {
    shape: 'circle',
    width: 10,
    height: 10,
    borderRadius: '50%',
    border: '1px solid #d97706',
  },
  jalapeno: {
    shape: 'ring',
    width: 18,
    height: 18,
    borderRadius: '50%',
    border: '4px solid #14532d',
  },
  olive: {
    shape: 'ring',
    width: 16,
    height: 16,
    borderRadius: '50%',
    border: '5px solid #0f172a',
  },
  spinach: {
    shape: 'leaf',
    width: 26,
    height: 14,
    borderRadius: '80% 0 80% 0',
  },
  'baby-corn': {
    shape: 'strip',
    width: 20,
    height: 8,
    borderRadius: '3px',
    border: '1px solid #ca8a04',
  },
  paneer: {
    shape: 'cube',
    width: 16,
    height: 16,
    borderRadius: '3px',
    border: '1px solid #fef3c7',
  },
  broccoli: {
    shape: 'leaf',
    width: 20,
    height: 20,
    borderRadius: '40%',
    border: '1px solid #14532d',
  },
  chicken: {
    shape: 'cube',
    width: 18,
    height: 14,
    borderRadius: '6px',
    border: '1px solid #c2410c',
  },
  pepperoni: {
    shape: 'circle',
    width: 26,
    height: 26,
    borderRadius: '50%',
    border: '2px dashed #7f1d1d',
  },
  sausage: {
    shape: 'circle',
    width: 18,
    height: 18,
    borderRadius: '50%',
    border: '1px solid #78350f',
  },
  bacon: {
    shape: 'strip',
    width: 28,
    height: 10,
    borderRadius: '2px',
    border: '1px solid #7f1d1d',
  },
};

// Fallback visual token for any unknown topping
export const DEFAULT_TOPPING_VISUAL: ToppingVisualToken = {
  shape: 'circle',
  width: 16,
  height: 16,
  borderRadius: '50%',
};

// ── Animation & Performance Budget Tokens ────────────────────────────────────

export const ANIMATION_DURATIONS = {
  toppingDrop: '350ms',
  sizeChange: '400ms',
  steamFloat: '4s',
  cheeseMelt: '300ms',
} as const;

export const SHADOW_VALUES = {
  dropShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 8px 16px rgba(0, 0, 0, 0.25)',
  ambientGlow: '0 0 50px rgba(234, 88, 12, 0.15)',
} as const;

// ── V2.0 Wooden Pizza Board Tokens ───────────────────────────────────────────

export interface BoardVisualToken {
  background: string;
  ringGradient: string;
  shadow: string;
  borderColor: string;
}

export const BOARD_VISUALS: Record<string, BoardVisualToken> = {
  oak: {
    background: 'radial-gradient(circle, #3d2314 0%, #24140b 100%)',
    ringGradient: 'repeating-radial-gradient(circle at 50% 50%, rgba(200, 130, 80, 0.08) 0px, rgba(200, 130, 80, 0.08) 6px, transparent 6px, transparent 18px)',
    shadow: '0 24px 48px rgba(0, 0, 0, 0.7), inset 0 2px 4px rgba(255, 255, 255, 0.1)',
    borderColor: '#54321d',
  },
};

// ── V2.0 700ms Chef Camera Presets ───────────────────────────────────────────

export interface CameraPreset {
  id: 'top' | 'angle30' | 'angle45' | 'macro' | 'cinematic';
  label: string;
  transform: string;
  description: string;
}

export const CAMERA_PRESETS: Record<string, CameraPreset> = {
  top: {
    id: 'top',
    label: 'Top View (0°)',
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
    description: 'Classic overhead view',
  },
  angle30: {
    id: 'angle30',
    label: 'Chef View (30°)',
    transform: 'perspective(1000px) rotateX(30deg) rotateY(0deg) scale(0.96)',
    description: 'Subtle 3D warmth',
  },
  angle45: {
    id: 'angle45',
    label: 'Dining (45°)',
    transform: 'perspective(1000px) rotateX(45deg) rotateY(-8deg) scale(0.92)',
    description: 'Dynamic 3D perspective',
  },
  macro: {
    id: 'macro',
    label: 'Macro Zoom',
    transform: 'perspective(1000px) rotateX(20deg) rotateY(0deg) scale(1.22)',
    description: 'Detailed ingredient view',
  },
  cinematic: {
    id: 'cinematic',
    label: 'Cinematic Low',
    transform: 'perspective(800px) rotateX(55deg) rotateY(12deg) scale(0.88)',
    description: 'Low-angle workstation view',
  },
};

// ── V2.0 Ambiance Environment Tokens ─────────────────────────────────────────

export interface AmbiancePreset {
  id: 'pizzeria' | 'night' | 'kitchen' | 'minimal';
  label: string;
  icon: string;
  background: string;
  glowColor: string;
}

export const AMBIANCE_PRESETS: Record<string, AmbiancePreset> = {
  pizzeria: {
    id: 'pizzeria',
    label: 'Warm Pizzeria',
    icon: '🍕',
    background: 'var(--env-bg-pizzeria)',
    glowColor: 'rgba(230, 57, 70, 0.25)',
  },
  night: {
    id: 'night',
    label: 'Cozy Night',
    icon: '🌙',
    background: 'var(--env-bg-night)',
    glowColor: 'rgba(59, 130, 246, 0.2)',
  },
  kitchen: {
    id: 'kitchen',
    label: 'Kitchen Studio',
    icon: '🍳',
    background: 'var(--env-bg-kitchen)',
    glowColor: 'rgba(245, 158, 11, 0.2)',
  },
  minimal: {
    id: 'minimal',
    label: 'Minimal Dark',
    icon: '✨',
    background: 'var(--env-bg-minimal)',
    glowColor: 'rgba(255, 255, 255, 0.1)',
  },
};

