import React, { useState } from 'react';
import { PizzaPreviewContainer } from '../components/builder/PizzaPreviewContainer';
import { IngredientSelector } from '../components/builder/IngredientSelector';
import { BuilderSidebar } from '../components/builder/BuilderSidebar';
import { SavedPizzas } from '../components/builder/SavedPizzas';
import { Sparkles, RotateCcw, ShoppingBag, ChevronUp, ChevronDown } from 'lucide-react';
import { useBuilderStore, addBuilderPizzaToCart } from '../store/builderStore';
import { useBuilderMetrics } from '../hooks/useBuilderMetrics';
import { soundManager } from '../utils/soundManager';
import { formatPrice } from '../utils/formatters';
import { Button } from '../components/common/Button';
import toast from 'react-hot-toast';

/**
 * Premium Pizza Builder Page.
 * Full-page 3D Pizza Studio with Chef Camera controls, glassmorphism UI,
 * Assembly Timeline, AI pairing engine, and 3-stage native mobile sheet.
 */
const PizzaBuilderPage: React.FC = () => {
  const [sheetState, setSheetState] = useState<'half' | 'full' | 'dismissed'>('half');
  const config = useBuilderStore((s) => s.config);
  const resetBuilder = useBuilderStore((s) => s.resetBuilder);
  const { totalPrice } = useBuilderMetrics();

  const handleStartOver = () => {
    soundManager.play('click');
    resetBuilder();
  };

  const handleAddToCart = () => {
    addBuilderPizzaToCart(config);
    toast.success(`Added "${config.name || 'Custom Pizza'}" to cart!`, {
      className: 'custom-toast',
      duration: 3000,
    });
  };

  const toggleSheet = () => {
    setSheetState((prev) => (prev === 'half' ? 'full' : prev === 'full' ? 'dismissed' : 'half'));
  };

  return (
    <div className="pizza-builder-page container" style={{ padding: 'var(--space-6) var(--space-4) var(--space-16)' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Sparkles color="var(--color-primary)" />
            Custom Pizza Studio
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: '4px', margin: 0 }}>
            Craft your culinary masterpiece layer by layer with 3D perspective & nutrition info.
          </p>
        </div>

        <button
          onClick={handleStartOver}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--glass-border)',
            background: 'var(--surface-glass)',
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all var(--ease-hover)',
          }}
        >
          <RotateCcw size={14} /> Start Over
        </button>
      </div>

      {/* Main Artisan Workstation 3-Column Studio Grid */}
      <div className="artisan-workstation-grid">
        {/* Left Column (30%): Ingredient Workstation Browser */}
        <div className={`mobile-sheet-${sheetState}`}>
          <div className="mobile-sheet-handle" onClick={toggleSheet} title="Toggle Sheet Height" />
          <IngredientSelector />
        </div>

        {/* Center Column (42%): Hero Pizza Visual Stage centerpiece */}
        <div style={{ minWidth: 0, position: 'sticky', top: 'var(--space-6)' }}>
          <PizzaPreviewContainer />
          <SavedPizzas />
        </div>

        {/* Right Column (28%): Chef Intelligence Panel */}
        <div style={{ position: 'sticky', top: 'var(--space-6)' }}>
          <BuilderSidebar />
        </div>
      </div>

      {/* Sticky Mobile Bar for Screens <= 768px */}
      <div className="mobile-sticky-cta" style={{ display: 'none' }}>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{config.name || 'Custom Pizza'}</div>
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>
            {formatPrice(totalPrice)}
          </div>
        </div>
        <Button variant="primary" size="md" onClick={handleAddToCart}>
          <ShoppingBag size={16} /> Add to Cart
        </Button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-sticky-cta { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default PizzaBuilderPage;

