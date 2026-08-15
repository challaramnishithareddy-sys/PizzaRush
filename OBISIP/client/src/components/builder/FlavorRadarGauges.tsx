import React from 'react';
import { Activity } from 'lucide-react';

interface FlavorRadarGaugesProps {
  flavors: {
    savory: number;
    zesty: number;
    creaminess: number;
    smokiness: number;
  };
}

/**
 * Animated SVG / Progress Ring Flavor Radar Gauges.
 * Visualizes Savory, Zesty, Creaminess, and Smokiness profiles.
 */
export const FlavorRadarGauges: React.FC<FlavorRadarGaugesProps> = React.memo(({ flavors }) => {
  const metrics = [
    { label: 'Savory', value: flavors.savory, color: '#f59e0b' },
    { label: 'Zesty', value: flavors.zesty, color: '#ef4444' },
    { label: 'Creaminess', value: flavors.creaminess, color: '#fbbf24' },
    { label: 'Smokiness', value: flavors.smokiness, color: '#3b82f6' },
  ];

  return (
    <div
      style={{
        padding: 'var(--space-3) var(--space-4)',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)' }}>
        <Activity size={14} color="var(--color-accent)" /> Flavor Profile Radar:
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
        {metrics.map((m) => (
          <div key={m.label} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
              <span style={{ fontWeight: 700, color: m.color }}>{m.value}%</span>
            </div>
            <div style={{ width: '100%', height: '4px', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${m.value}%`,
                  borderRadius: 'var(--radius-full)',
                  background: m.color,
                  transition: 'width var(--ease-panel)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

FlavorRadarGauges.displayName = 'FlavorRadarGauges';
