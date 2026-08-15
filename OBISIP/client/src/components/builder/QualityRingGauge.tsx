import React from 'react';
import { Award } from 'lucide-react';

interface QualityRingGaugeProps {
  score: number;
}

/**
 * Ultra-Premium SVG Radial Ring Gauge for Pizza Quality Balance.
 * Features animated stroke-dashoffset, ambient glow, and high-contrast numerical core.
 */
export const QualityRingGauge: React.FC<QualityRingGaugeProps> = React.memo(({ score }) => {
  const radius = 36;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      className="glass-panel-v2"
      style={{
        padding: 'var(--space-3) var(--space-4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-4)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <Award size={14} color="#fbbf24" /> Quality Balance Score
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {score >= 90 ? 'Master Artisan' : score >= 75 ? 'Balanced Flavor' : 'Custom Blend'}
        </span>
      </div>

      <div style={{ position: 'relative', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="70" height="70" viewBox="0 0 88 88" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background Ring Track */}
          <circle
            cx="44"
            cy="44"
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Progress Ring */}
          <circle
            cx="44"
            cy="44"
            r={radius}
            stroke="url(#qualityGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 800ms cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          />
          <defs>
            <linearGradient id="qualityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
        </svg>

        <span
          style={{
            position: 'absolute',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'var(--text-base)',
            color: '#fbbf24',
          }}
        >
          {score}
        </span>
      </div>
    </div>
  );
});

QualityRingGauge.displayName = 'QualityRingGauge';
