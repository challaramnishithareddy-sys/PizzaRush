import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../utils/formatters';
import { SIZE_LABELS } from '../../utils/constants';
import { Button } from '../common/Button';

interface CartItemProps {
  item: CartItemType;
}

/**
 * Single cart line item — shows pizza details, quantity stepper, and remove button.
 */
export const CartItemRow: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();

  const handleRemove = () => removeItem(item.pizza._id, item.size, item.crust);
  const handleQty = (qty: number) => updateQuantity(item.pizza._id, item.size, item.crust, qty);

  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        alignItems: 'center',
        transition: 'border-color var(--transition-fast)',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
    >
      {/* Image */}
      <img
        src={item.pizza.image}
        alt={item.pizza.name}
        style={{ width: '72px', height: '72px', borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }}
        onError={e => (e.currentTarget.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80')}
      />

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.pizza.name}
        </h4>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
          {SIZE_LABELS[item.size]} · {item.crust.charAt(0).toUpperCase() + item.crust.slice(1)} Crust
          {item.toppings.length > 0 && ` · +${item.toppings.join(', ')}`}
        </p>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
          {formatPrice(item.unitPrice)} each
        </p>
      </div>

      {/* Quantity Stepper */}
      <div className="qty-stepper" style={{ flexShrink: 0 }}>
        <button onClick={() => handleQty(item.quantity - 1)} aria-label="Decrease">
          <Minus size={12} />
        </button>
        <span style={{ fontSize: 'var(--text-sm)' }}>{item.quantity}</span>
        <button onClick={() => handleQty(item.quantity + 1)} aria-label="Increase">
          <Plus size={12} />
        </button>
      </div>

      {/* Item Total */}
      <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '72px' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)' }}>
          {formatPrice(item.unitPrice * item.quantity)}
        </p>
      </div>

      {/* Remove */}
      <Button variant="ghost" size="icon" onClick={handleRemove} aria-label="Remove item">
        <Trash2 size={16} color="var(--color-error)" />
      </Button>
    </div>
  );
};
