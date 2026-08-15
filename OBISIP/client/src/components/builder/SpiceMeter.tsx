import React from 'react';
import { Flame } from 'lucide-react';
import { useBuilderMetrics } from '../../hooks/useBuilderMetrics';

/**
 * Animated spice level meter (0-5 rating) with color gradient flames.
 */
export const SpiceMeter: React.FC = React.memo(() => {
  const { spiceLevel } = useBuilderMetrics();

  // Helper to determine flame color based on level
  const getSpiceColor = (level: number) => {
    if (level === 0) return 'var(--text-muted)';
    if (level <= 1.5) return '#fbbf24'; // Mild yellow
    if (level <= 3) return '#f97316';   // Medium orange
    if (level <= 4) return '#ef4444';   // Hot red
    return '#dc2626';                   // Fiery dark red
  };

  const spiceColor = getSpiceColor(spiceLevel);

  return (
    <div
      className="spice-meter-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-3) var(--space-4)',
        background: 'var(--bg-subtle)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <Flame size={18} color={spiceColor} />
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Spice Level
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((level) => {
          const isActive = level <= Math.round(spiceLevel);
          return (
            <Flame
              key={level}
              size={14}
              color={isActive ? spiceColor : 'var(--border-default)'}
              style={{
                opacity: isActive ? 1 : 0.4,
                transition: 'color var(--transition-fast), opacity var(--transition-fast)',
              }}
            />
          );
        })}
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, marginLeft: '6px', color: spiceColor }}>
          {spiceLevel > 0 ? `${spiceLevel}/5` : 'Mild'}
        </span>
      </div>
    </div>
  );
});

SpiceMeter.displayName = 'SpiceMeter';
