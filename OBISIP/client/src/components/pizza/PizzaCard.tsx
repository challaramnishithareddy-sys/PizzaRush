import React, { useState } from 'react';
import { Star, ShoppingCart, Clock } from 'lucide-react';
import type { Pizza } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { PizzaCustomizer } from './PizzaCustomizer';
import { formatPrice, truncate } from '../../utils/formatters';

interface PizzaCardProps {
  pizza: Pizza;
}

/**
 * Pizza menu card with image, rating, category badge, and "Customize" CTA.
 */
export const PizzaCard: React.FC<PizzaCardProps> = ({ pizza }) => {
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const basePrice = pizza.sizes[0]?.price ?? pizza.basePrice;

  return (
    <>
      <div
      className="pizza-card glass-panel-v2"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform var(--transition-medium), box-shadow var(--transition-medium)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >    {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden', height: '200px', flexShrink: 0 }}>
          <img
            src={imgError ? 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80' : pizza.image}
            alt={pizza.name}
            onError={() => setImgError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform var(--transition-slow)',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
          {/* Badges overlay */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <Badge category={pizza.category} />
            {pizza.isFeatured && (
              <span className="badge" style={{ background: 'rgba(250,204,21,0.2)', color: '#fbbf24', border: '1px solid rgba(250,204,21,0.3)' }}>
                ⭐ Featured
              </span>
            )}
          </div>
          {!pizza.isAvailable && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                Currently Unavailable
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-1)' }}>
              {pizza.name}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
              {truncate(pizza.description, 80)}
            </p>
          </div>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
              <Star size={14} fill="#fbbf24" />
              <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                {pizza.rating.toFixed(1)}
              </span>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
              ({pizza.totalRatings.toLocaleString()} reviews)
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
              <Clock size={12} /> 30–45 min
            </div>
          </div>

          {/* Tags */}
          {pizza.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {pizza.tags.slice(0, 3).map(tag => (
                <span key={tag} style={{
                  padding: '2px 8px', borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-elevated)', color: 'var(--text-muted)',
                  fontSize: '11px', border: '1px solid var(--border-subtle)',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>Starting from</p>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--color-primary)' }}>
                {formatPrice(basePrice)}
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCustomizerOpen(true)}
              disabled={!pizza.isAvailable}
              leftIcon={<ShoppingCart size={14} />}
            >
              Order Now
            </Button>
          </div>
        </div>
      </div>

      {/* Customizer Modal */}
      <Modal
        isOpen={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
        title={`Customize ${pizza.name}`}
        maxWidth="560px"
      >
        <PizzaCustomizer pizza={pizza} onClose={() => setCustomizerOpen(false)} />
      </Modal>
    </>
  );
};
