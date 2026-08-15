import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { orderApi } from '../api/order.api';
import { RazorpayButton } from '../components/payment/RazorpayButton';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { formatPrice } from '../utils/formatters';
import { SIZE_LABELS } from '../utils/constants';
import toast from 'react-hot-toast';
import type { DeliveryAddress } from '../types';

/**
 * Checkout page — delivery address form, order summary, and Razorpay payment.
 */
const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, deliveryFee, discount, total, couponCode, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const defaultAddr = user?.addresses?.find(a => a.isDefault) ?? user?.addresses?.[0];

  const [address, setAddress] = useState<DeliveryAddress>({
    street: defaultAddr?.street ?? '',
    city: defaultAddr?.city ?? '',
    state: defaultAddr?.state ?? 'Telangana',
    pincode: defaultAddr?.pincode ?? '',
  });
  const [errors, setErrors] = useState<Partial<DeliveryAddress>>({});
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [orderCreating, setOrderCreating] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const validate = (): boolean => {
    const e: Partial<DeliveryAddress> = {};
    if (!address.street.trim()) e.street = 'Street address is required';
    if (!address.city.trim()) e.city = 'City is required';
    if (!address.state.trim()) e.state = 'State is required';
    if (!/^\d{6}$/.test(address.pincode)) e.pincode = 'Enter a valid 6-digit pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreateOrder = async () => {
    if (!validate()) return;
    setOrderCreating(true);
    try {
      const payload = {
        items: items.map(i => ({
          pizzaId: i.pizza._id,
          pizzaName: i.isCustom && i.customName ? i.customName : i.pizza.name,
          unitPrice: i.unitPrice,
          size: i.size,
          crust: i.crust,
          toppings: i.toppings,
          quantity: i.quantity,
        })),
        deliveryAddress: address,
        couponCode: couponCode || undefined,
      };
      const { data } = await orderApi.create(payload);
      setCreatedOrderId(data.data!.order._id);
      toast.success('Order created! Proceed to payment.', { className: 'custom-toast' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create order. Please retry.');
    } finally {
      setOrderCreating(false);
    }
  };

  const handlePaymentSuccess = (paymentId: string) => {
    clearCart();
    toast.success('🎉 Order placed successfully!', { duration: 4000, className: 'custom-toast' });
    navigate(`/orders/${createdOrderId}`);
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <main>
      <div className="container section-sm">
        <div className="page-header">
          <h1>Checkout</h1>
          <p>Review your order and complete payment</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-8)', alignItems: 'start' }}>
          {/* Left: Delivery + Payment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Step 1: Address */}
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-sm)', color: '#fff', fontWeight: 700, flexShrink: 0 }}>1</span>
                <MapPin size={20} color="var(--color-primary)" /> Delivery Address
              </h2>

              {/* Saved addresses */}
              {user?.addresses && user.addresses.length > 0 && (
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
                  {user.addresses.map((addr) => (
                    <button key={addr._id}
                      onClick={() => setAddress({ street: addr.street, city: addr.city, state: addr.state, pincode: addr.pincode })}
                      style={{
                        padding: 'var(--space-2) var(--space-3)',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${address.street === addr.street ? 'var(--color-primary)' : 'var(--border-default)'}`,
                        background: address.street === addr.street ? 'rgba(230,57,70,0.1)' : 'var(--bg-elevated)',
                        color: address.street === addr.street ? 'var(--color-primary)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: 'var(--text-xs)',
                        fontFamily: 'var(--font-body)',
                        transition: 'all var(--transition-fast)',
                      }}>
                      📍 {addr.label}
                    </button>
                  ))}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-4)' }}>
                <Input label="Street Address *" placeholder="123 Main Street, Apartment 4B" value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} error={errors.street} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <Input label="City *" placeholder="Hyderabad" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} error={errors.city} />
                  <Input label="State *" placeholder="Telangana" value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} error={errors.state} />
                </div>
                <Input label="Pincode *" placeholder="500001" value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} error={errors.pincode} maxLength={6} />
              </div>
            </div>

            {/* Step 2: Payment */}
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: createdOrderId ? 'var(--gradient-primary)' : 'var(--bg-elevated)', border: createdOrderId ? 'none' : '2px solid var(--border-default)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-sm)', color: createdOrderId ? '#fff' : 'var(--text-muted)', fontWeight: 700, flexShrink: 0 }}>2</span>
                <CreditCard size={20} color="var(--color-primary)" /> Payment
              </h2>

              {!createdOrderId ? (
                <Button variant="primary" size="lg" fullWidth loading={orderCreating} onClick={handleCreateOrder}>
                  Confirm Delivery & Proceed to Pay
                </Button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div style={{ padding: 'var(--space-3)', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--color-success)' }}>
                    ✅ Order confirmed! Complete payment to place your order.
                  </div>
                  <RazorpayButton amount={total} orderId={createdOrderId} onSuccess={handlePaymentSuccess} />
                  <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    💡 Test Card: 4111 1111 1111 1111 | CVV: Any | Expiry: Any future date
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="card" style={{ padding: 'var(--space-6)', position: 'sticky', top: '80px' }}>
            <button onClick={() => setSummaryOpen(!summaryOpen)} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>Order Summary</h3>
              {summaryOpen ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
            </button>

            {summaryOpen && (
              <div style={{ marginBottom: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {items.map(item => (
                  <div key={`${item.pizza._id}-${item.size}`} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                    <img src={item.pizza.image} alt={item.pizza.name} style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }}
                      onError={e => (e.currentTarget.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&q=80')} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.pizza.name}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{SIZE_LABELS[item.size]} · {item.crust} · ×{item.quantity}</p>
                    </div>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, flexShrink: 0 }}>{formatPrice(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="divider" />
            {[['Subtotal', formatPrice(subtotal)], ['Delivery', deliveryFee === 0 ? 'Free 🆓' : formatPrice(deliveryFee)], ...(discount > 0 ? [['Discount', `-${formatPrice(discount)}`]] : [])].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)', color: l === 'Discount' ? 'var(--color-success)' : 'var(--text-secondary)' }}>
                <span>{l}</span><span>{v}</span>
              </div>
            ))}
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xl)' }}>
              <span>Total</span>
              <span style={{ color: 'var(--color-primary)' }}>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .container > div[style*='grid-template-columns'] { display: flex !important; flex-direction: column !important; }
          .card[style*='sticky'] { position: static !important; }
        }
      `}</style>
    </main>
  );
};

export default Checkout;
