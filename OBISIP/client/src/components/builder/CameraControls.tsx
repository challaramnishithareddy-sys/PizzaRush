import React from 'react';
import { Camera, SunMedium } from 'lucide-react';
import { CAMERA_PRESETS, AMBIANCE_PRESETS } from '../../data/pizzaVisualTokens';

interface CameraControlsProps {
  activePreset: string;
  activeAmbiance: string;
  onSelectPreset: (id: 'top' | 'angle30' | 'angle45' | 'macro' | 'cinematic') => void;
  onSelectAmbiance: (id: 'pizzeria' | 'night' | 'kitchen' | 'minimal') => void;
}

/**
 * 700ms Chef Camera Perspective & Ambiance Toolbar.
 * Allows users to inspect their pizza creation in 3D perspective & environment lighting.
 */
export const CameraControls: React.FC<CameraControlsProps> = React.memo(
  ({ activePreset, activeAmbiance, onSelectPreset, onSelectAmbiance }) => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-2) var(--space-4)',
          background: 'rgba(15, 15, 18, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--glass-border)',
          gap: 'var(--space-3)',
          flexWrap: 'wrap',
        }}
      >
        {/* Camera Angle Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
            <Camera size={14} color="var(--color-primary)" /> Camera:
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {Object.values(CAMERA_PRESETS).map((preset) => {
              const isSelected = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset.id as any)}
                  title={preset.description}
                  style={{
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'rgba(230, 57, 70, 0.2)' : 'transparent',
                    color: isSelected ? 'var(--color-primary-light)' : 'var(--text-secondary)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all var(--ease-hover)',
                  }}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ambiance Environment Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
            <SunMedium size={14} color="var(--color-secondary)" /> Lighting:
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {Object.values(AMBIANCE_PRESETS).map((amb) => {
              const isSelected = activeAmbiance === amb.id;
              return (
                <button
                  key={amb.id}
                  onClick={() => onSelectAmbiance(amb.id as any)}
                  title={amb.label}
                  style={{
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    border: isSelected ? '1px solid var(--color-secondary)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'rgba(244, 162, 97, 0.2)' : 'transparent',
                    color: isSelected ? 'var(--color-secondary)' : 'var(--text-secondary)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all var(--ease-hover)',
                  }}
                >
                  {amb.icon} {amb.label.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

CameraControls.displayName = 'CameraControls';
