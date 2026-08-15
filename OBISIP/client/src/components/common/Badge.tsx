import React from 'react';
import type { OrderStatus } from '../../types';

interface BadgeProps {
  status?: OrderStatus;
  category?: 'veg' | 'non-veg' | 'specialty';
  label?: string;
  className?: string;
}

const DOT_COLORS: Partial<Record<string, string>> = {
  veg: '#22c55e',
  'non-veg': '#ef4444',
};

/**
 * Badge component for category and order status displays.
 */
export const Badge: React.FC<BadgeProps> = ({ status, category, label, className = '' }) => {
  if (category) {
    const cls =
      category === 'veg'
        ? 'badge-veg'
        : category === 'non-veg'
        ? 'badge-nonveg'
        : 'badge-specialty';
    const dot = DOT_COLORS[category];
    return (
      <span className={`badge ${cls} ${className}`}>
        {dot && (
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: dot,
              flexShrink: 0,
            }}
          />
        )}
        {category === 'veg' ? 'Veg' : category === 'non-veg' ? 'Non-Veg' : 'Specialty'}
      </span>
    );
  }

  if (status) {
    const cls = `badge-${status}`;
    const text =
      status === 'out_for_delivery'
        ? 'Out for Delivery'
        : status.charAt(0).toUpperCase() + status.slice(1);
    return <span className={`badge ${cls} ${className}`}>{label || text}</span>;
  }

  return <span className={`badge ${className}`}>{label}</span>;
};
