import React from 'react';
import { ShoppingBag, Bookmark, Clock, Sparkles, Award, Truck, Plus, Minus } from 'lucide-react';
import { useBuilderStore, addBuilderPizzaToCart } from '../../store/builderStore';
import { useCartStore } from '../../store/cartStore';
import { useBuilderMetrics } from '../../hooks/useBuilderMetrics';
import { NutritionPanel } from './NutritionPanel';
import { SpiceMeter } from './SpiceMeter';
import { AssemblyTimeline } from './AssemblyTimeline';
import { PersonalityBadge } from './PersonalityBadge';
import { FlavorRadarGauges } from './FlavorRadarGauges';
import { QualityRingGauge } from './QualityRingGauge';
import { Button } from '../common/Button';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';

export const BuilderSidebar: React.FC = () => {
  const config = useBuilderStore((s) => s.config);
  const editingId = useBuilderStore((s) => s.editingId);
  const setName = useBuilderStore((s) => s.setName);
  const setQuantity = useBuilderStore((s) => s.setQuantity);
  const saveCustomPizza = useBuilderStore((s) => s.saveCustomPizza);

  const addItem = useCartStore((s) => s.addItem);

  const {
    unitPrice,
    totalPrice,
    spiceLevel,
    prepTimeMin,
    deliveryEstimate,
    qualityScore,
    aiRecommendation,
    personality,
    flavors,
  } = useBuilderMetrics();

  const handleAddToCart = () => {
    addBuilderPizzaToCart(config);
    toast.success(`Added "${config.name || 'Custom Pizza'}" to cart!`, {
      className: 'custom-toast',
      duration: 3000,
    });
  };

  const handleSavePizza = () => {
    const savedId = saveCustomPizza();
    toast.success(editingId ? 'Custom pizza updated!' : 'Saved to your custom pizzas!', {
      className: 'custom-toast',
    });
  };

  return (
    <aside
      className="builder-sidebar glass-panel-v2"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-5)',
      }}
    >
      {/* Pizza Name Input & Personality Badge */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Pizza Name
          </label>
          <PersonalityBadge personality={personality} />
        </div>
        <input
          type="text"
          value={config.name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Custom Pizza"
          maxLength={30}
          className="input"
          style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}
        />
      </div>

      {/* Assembly Sequence Timeline */}
      <AssemblyTimeline config={config} />

      {/* Animated Circular SVG Quality Ring Gauge */}
      <QualityRingGauge score={qualityScore} />

      {/* Flavor Profile Radar Gauges */}
      <FlavorRadarGauges flavors={flavors} />

      {/* AI Pairing Recommendation Explanation */}
      <div
        style={{
          padding: 'var(--space-3) var(--space-4)',
          background: 'rgba(46, 196, 182, 0.08)',
          border: '1px solid rgba(46, 196, 182, 0.25)',
          borderRadius: 'var(--radius-lg)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent)', fontWeight: 700, marginBottom: '2px' }}>
          <Sparkles size={14} /> AI Pairing ({aiRecommendation.confidence}% Match)
        </div>
        <p style={{ margin: 0 }}>{aiRecommendation.explanation}</p>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
          <Clock size={16} color="var(--color-primary)" />
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Prep Time</div>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>~{prepTimeMin} mins</div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
          <Truck size={16} color="var(--color-success)" />
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Est. Delivery</div>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>{deliveryEstimate}</div>
          </div>
        </div>
      </div>

      {/* Spice Meter */}
      <SpiceMeter />

      {/* Nutrition Breakdown */}
      <NutritionPanel />

      {/* Quantity & Total Price */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>Qty</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--bg-subtle)', padding: '4px 8px', borderRadius: 'var(--radius-full)' }}>
            <button
              onClick={() => setQuantity(config.quantity - 1)}
              style={{ width: '24px', height: '24px', borderRadius: '50%', border: 'none', background: 'var(--bg-card)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
            >
              <Minus size={12} />
            </button>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>{config.quantity}</span>
            <button
              onClick={() => setQuantity(config.quantity + 1)}
              style={{ width: '24px', height: '24px', borderRadius: '50%', border: 'none', background: 'var(--color-primary)', color: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
            >
              <Plus size={12} />
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{formatPrice(unitPrice)} each</div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>
            {formatPrice(totalPrice)}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
        <Button variant="primary" size="lg" onClick={handleAddToCart} style={{ width: '100%', justifyContent: 'center' }}>
          <ShoppingBag size={18} />
          Add to Order · {formatPrice(totalPrice)}
        </Button>

        <Button variant="secondary" size="md" onClick={handleSavePizza} style={{ width: '100%', justifyContent: 'center' }}>
          <Bookmark size={16} />
          {editingId ? 'Update Saved Pizza' : 'Save Creation'}
        </Button>
      </div>
    </aside>
  );
};
