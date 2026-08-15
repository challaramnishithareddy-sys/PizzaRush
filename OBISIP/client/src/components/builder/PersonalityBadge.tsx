import React from 'react';
import { Sparkles } from 'lucide-react';

interface PersonalityBadgeProps {
  personality: {
    title: string;
    icon: string;
    description: string;
    color: string;
  };
}

/**
 * Dynamic Pizza Personality Archetype Badge.
 * Purely cosmetic feedback based on selected recipe configuration.
 */
export const PersonalityBadge: React.FC<PersonalityBadgeProps> = React.memo(({ personality }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-3)',
        borderRadius: 'var(--radius-full)',
        background: `rgba(${personality.color}, 0.12)`,
        border: `1px solid rgba(${personality.color}, 0.35)`,
        color: `rgb(${personality.color})`,
        fontSize: 'var(--text-xs)',
        fontWeight: 700,
        fontFamily: 'var(--font-display)',
        animation: 'fadeIn var(--ease-selection) both',
      }}
      title={personality.description}
    >
      <Sparkles size={14} />
      <span>{personality.icon} {personality.title}</span>
    </div>
  );
});

PersonalityBadge.displayName = 'PersonalityBadge';
