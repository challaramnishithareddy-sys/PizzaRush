import React from 'react';
import { Activity } from 'lucide-react';
import { useBuilderMetrics } from '../../hooks/useBuilderMetrics';

/**
 * Nutrition Information panel displaying total calories, protein, carbs, and fat.
 */
export const NutritionPanel: React.FC = React.memo(() => {
  const { nutrition } = useBuilderMetrics();

  return (
    <div
      className="nutrition-panel-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        background: 'var(--bg-subtle)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <Activity size={16} color="var(--color-primary)" />
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
          Nutritional Breakdown
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-2)', textAlign: 'center' }}>
        <div style={{ padding: 'var(--space-2)', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Calories</div>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {nutrition.calories} <span style={{ fontSize: '10px' }}>kcal</span>
          </div>
        </div>

        <div style={{ padding: 'var(--space-2)', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Protein</div>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {nutrition.protein}g
          </div>
        </div>

        <div style={{ padding: 'var(--space-2)', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Carbs</div>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {nutrition.carbs}g
          </div>
        </div>

        <div style={{ padding: 'var(--space-2)', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Fat</div>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {nutrition.fat}g
          </div>
        </div>
      </div>
    </div>
  );
});

NutritionPanel.displayName = 'NutritionPanel';
