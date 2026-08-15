import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Tag, Truck, ArrowRight, Trash2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { CartItemRow } from '../components/pizza/CartItem';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { formatPrice } from '../utils/formatters';
import { COUPON_CODES, FREE_DELIVERY_THRESHOLD, DELIVERY_FEE } from '../utils/constants';
import toast from 'react-hot-toast';

/**
 * Cart page — shows items, coupon input, and order summary with checkout CTA.
 */
const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, deliveryFee, discount, total, couponCode, clearCart, applyCoupon, removeCoupon } = useCartStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const DISCOUNTS: Record<string, number> = { PIZZA10: 10, SAVE20: 20, WELCOME15: 15 };

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const pct = DISCOUNTS[code];
    if (!pct) {
      setCouponError('Invalid coupon code');
      return;
    }
    const discountAmt = Math.round((subtotal * pct) / 100);
    applyCoupon(code, discountAmt);
    setCouponInput('');
    setCouponError('');
    toast.success(`Coupon applied! You saved ${formatPrice(discountAmt)} 🎉`, { className: 'custom-toast' });
  };

  if (items.length === 0) {
    return (
      <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="empty-state animate-fade-in">
          <div style={{ fontSize: '5rem', marginBottom: 'var(--space-4)' }}>🛒</div>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-6)' }}>Add some delicious pizzas to get started!</p>
          <Button variant="primary" size="lg" onClick={() => navigate('/menu')} rightIcon={<ArrowRight size={18} />}>
            Browse Menu
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container section-sm">
        <div className="page-header">
          <h1><ShoppingCart size={28} style={{ display: 'inline', marginRight: '12px', verticalAlign: 'middle', color: 'var(--color-primary)' }} />Your Cart</h1>
          <p>{items.reduce((s, i) => s + i.quantity, 0)} item{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-8)', alignItems: 'start' }}>
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="ghost" size="sm" onClick={() => { clearCart(); toast('Cart cleared', { className: 'custom-toast' }); }}
                leftIcon={<Trash2 size={14} color="var(--color-error)" />}
                style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)' }}>
                Clear All
              </Button>
            </div>
            {items.map(item => (
              <CartItemRow key={`${item.pizza._id}-${item.size}-${item.crust}`} item={item} />
            ))}

            {/* Free Delivery Progress */}
            {subtotal < FREE_DELIVERY_THRESHOLD && (
              <div style={{ padding: 'var(--space-4)', background: 'rgba(244,162,97,0.1)', border: '1px solid rgba(244,162,97,0.2)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  <Truck size={16} color="var(--color-secondary)" />
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-secondary)' }}>
                    Add <strong>{formatPrice(FREE_DELIVERY_THRESHOLD - subtotal)}</strong> more for FREE delivery!
                  </p>
                </div>
                <div style={{ height: '4px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%`, background: 'var(--color-secondary)', borderRadius: 'var(--radius-full)', transition: 'width var(--transition-slow)' }} />
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="card" style={{ padding: 'var(--space-6)', position: 'sticky', top: '80px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-5)' }}>
              Order Summary
            </h3>

            {/* Coupon */}
            {!couponCode ? (
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
                <div style={{ flex: 1 }}>
                  <Input
                    placeholder="Coupon code"
                    value={couponInput}
                    onChange={e => { setCouponInput(e.target.value); setCouponError(''); }}
                    error={couponError}
                    leftIcon={<Tag size={14} />}
                  />
                </div>
                <Button variant="secondary" size="sm" onClick={handleApplyCoupon} style={{ marginTop: couponError ? '-20px' : 0 }}>
                  Apply
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-2) var(--space-3)', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-5)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-success)', fontWeight: 600 }}>✓ {couponCode}</span>
                <button onClick={removeCoupon} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>Remove</button>
              </div>
            )}

            {/* Price Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
              {[
                ['Subtotal', formatPrice(subtotal)],
                ['Delivery', deliveryFee === 0 ? '🆓 Free' : formatPrice(deliveryFee)],
                ...(discount > 0 ? [['Discount', `-${formatPrice(discount)}`]] : []),
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: label === 'Discount' ? 'var(--color-success)' : 'var(--text-secondary)' }}>
                  <span>{label}</span>
                  <span style={{ fontWeight: 500 }}>{value}</span>
                </div>
              ))}
              <div className="divider" style={{ margin: 0 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)' }}>
                <span>Total</span>
                <span style={{ color: 'var(--color-primary)' }}>{formatPrice(total)}</span>
              </div>
            </div>

            <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/checkout')} rightIcon={<ArrowRight size={18} />}>
              Proceed to Checkout
            </Button>

            <p style={{ textAlign: 'center', marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              🔒 Secured by Razorpay
            </p>

            {/* Valid coupons hint */}
            <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Available Coupons:</p>
              {COUPON_CODES.map(c => (
                <p key={c} style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>• <code style={{ color: 'var(--color-primary)' }}>{c}</code></p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container > div[style*='grid-template-columns'] { display: flex !important; flex-direction: column !important; }
          .card[style*='position: sticky'] { position: static !important; }
        }
      `}</style>
    </main>
  );
};

export default Cart;
