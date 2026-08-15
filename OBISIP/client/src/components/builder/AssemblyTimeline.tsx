import React from 'react';
import { Layers } from 'lucide-react';
import type { CustomPizzaConfig } from '../../types/builderTypes';
import { getSauce, getCheese, getTopping, getCrust } from '../../data/builderData';

interface AssemblyTimelineProps {
  config: CustomPizzaConfig;
}

/**
 * Interactive build assembly timeline.
 * Displays step-by-step assembly sequence of the current custom pizza.
 */
export const AssemblyTimeline: React.FC<AssemblyTimelineProps> = React.memo(({ config }) => {
  const crust = getCrust(config.crust);
  const sauce = getSauce(config.sauce);
  const cheese = getCheese(config.cheese);

  const steps = [
    { id: 'crust', label: crust?.label || 'Hand Tossed', icon: '🌾' },
    { id: 'sauce', label: `${sauce?.label || 'Tomato'} Sauce`, icon: '🍅' },
    { id: 'cheese', label: `${cheese?.label || 'Mozzarella'} Cheese`, icon: '🧀' },
    ...config.toppings.map((t) => {
      const toppingData = getTopping(t.toppingId);
      return {
        id: t.toppingId,
        label: `${toppingData?.name || t.toppingId} (x${t.quantity})`,
        icon: toppingData?.category === 'veg' ? '🌿' : '🥩',
      };
    }),
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        padding: 'var(--space-3) var(--space-4)',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-muted)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
        <Layers size={14} color="var(--color-primary)" /> Assembly Sequence:
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          overflowX: 'auto',
          paddingBottom: '2px',
        }}
      >
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                fontSize: '11px',
                whiteSpace: 'nowrap',
                color: 'var(--text-primary)',
              }}
            >
              <span>{step.icon}</span> {step.label}
            </span>
            {idx < steps.length - 1 && (
              <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>→</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
});

AssemblyTimeline.displayName = 'AssemblyTimeline';
