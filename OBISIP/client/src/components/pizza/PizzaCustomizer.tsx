import React, { useState, useMemo } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Pizza } from '../../types';
import { Button } from '../common/Button';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../utils/formatters';
import { SIZE_LABELS } from '../../utils/constants';

interface PizzaCustomizerProps {
  pizza: Pizza;
  onClose: () => void;
}

/**
 * Pizza customizer — lets the user pick size, crust, toppings, and quantity
 * before adding to cart. Price updates live as selections change.
 */
export const PizzaCustomizer: React.FC<PizzaCustomizerProps> = ({ pizza, onClose }) => {
  const { addItem } = useCartStore();

  const defaultSize = pizza.sizes[0]?.size ?? 'medium';
  const defaultCrust = pizza.crusts[0] ?? 'thin';

  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>(defaultSize);
  const [selectedCrust, setSelectedCrust] = useState(defaultCrust);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  /** Compute the live unit price */
  const unitPrice = useMemo(() => {
    const sizePrice = pizza.sizes.find(s => s.size === selectedSize)?.price ?? pizza.basePrice;
    const toppingsCost = selectedToppings.reduce((sum, name) => {
      const t = pizza.toppings.find(t => t.name === name);
      return sum + (t?.price ?? 0);
    }, 0);
    return sizePrice + toppingsCost;
  }, [selectedSize, selectedToppings, pizza]);

  const totalPrice = unitPrice * quantity;

  const toggleTopping = (name: string) => {
    setSelectedToppings(prev =>
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]
    );
  };

  const handleAddToCart = () => {
    addItem(pizza, selectedSize, selectedCrust, selectedToppings, unitPrice);
    toast.success(`${pizza.name} added to cart! 🍕`, { className: 'custom-toast' });
    onClose();
  };

  const optionStyle = (selected: boolean): React.CSSProperties => ({
    padding: 'var(--space-2) var(--space-3)',
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${selected ? 'var(--color-primary)' : 'var(--border-default)'}`,
    background: selected ? 'rgba(230,57,70,0.15)' : 'var(--bg-elevated)',
    color: selected ? 'var(--color-primary)' : 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: 'var(--text-sm)',
    fontWeight: selected ? 600 : 400,
    transition: 'all var(--transition-fast)',
    fontFamily: 'var(--font-body)',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Pizza Image */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
        <img src={pizza.image} alt={pizza.name}
          style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }}
          onError={e => (e.currentTarget.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80')}
        />
        <div>
          <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{pizza.name}</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', lineHeight: 1.6 }}>{pizza.description.slice(0, 80)}…</p>
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
          Choose Size
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {pizza.sizes.map(({ size, price }) => (
            <button key={size} style={optionStyle(selectedSize === size)} onClick={() => setSelectedSize(size)}>
              <div style={{ fontWeight: 600 }}>{SIZE_LABELS[size]}</div>
              <div style={{ fontSize: 'var(--text-xs)', marginTop: '2px', color: selectedSize === size ? 'var(--color-primary)' : 'var(--text-muted)' }}>
                {formatPrice(price)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Crust Selection */}
      <div>
        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
          Choose Crust
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {pizza.crusts.map(crust => (
            <button key={crust} style={optionStyle(selectedCrust === crust)} onClick={() => setSelectedCrust(crust)}>
              {crust.charAt(0).toUpperCase() + crust.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Toppings */}
      {pizza.toppings.length > 0 && (
        <div>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
            Extra Toppings <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--space-2)' }}>
            {pizza.toppings.map(({ name, price }) => {
              const selected = selectedToppings.includes(name);
              return (
                <button key={name} style={{ ...optionStyle(selected), display: 'flex', justifyContent: 'space-between' }}
                  onClick={() => toggleTopping(name)}>
                  <span>{name}</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: selected ? 'var(--color-primary)' : 'var(--text-muted)' }}>
                    +{formatPrice(price)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>Quantity</p>
        <div className="qty-stepper">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="Decrease quantity">
            <Minus size={14} />
          </button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(q => Math.min(20, q + 1))} aria-label="Increase quantity">
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Total + Add to Cart */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
        <div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Total Price</p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-2xl)', color: 'var(--color-primary)' }}>
            {formatPrice(totalPrice)}
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={handleAddToCart} leftIcon={<ShoppingCart size={18} />}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
};
