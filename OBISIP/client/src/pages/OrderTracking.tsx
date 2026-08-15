import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Receipt, Clock } from 'lucide-react';
import { orderApi } from '../api/order.api';
import { useSocketContext } from '../context/SocketContext';
import type { Order, OrderStatusUpdate } from '../types';
import { OrderTimeline } from '../components/order/OrderTimeline';
import { Spinner } from '../components/common/Spinner';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { formatPrice, formatDate } from '../utils/formatters';
import { SIZE_LABELS } from '../utils/constants';
import toast from 'react-hot-toast';

/**
 * Real-time order tracking page.
 * Joins the order's Socket.IO room and listens for status updates.
 */
const OrderTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { joinOrderRoom, leaveOrderRoom, onOrderStatusUpdate, isConnected } = useSocketContext();

  useEffect(() => {
    if (!id) return;
    orderApi.getById(id)
      .then(({ data }) => setOrder(data.data?.order ?? null))
      .catch(() => toast.error('Order not found'))
      .finally(() => setLoading(false));
  }, [id]);

  // Join Socket.IO room for live updates
  useEffect(() => {
    if (!id || !isConnected) return;
    joinOrderRoom(id);
    return () => { leaveOrderRoom(id); };
  }, [id, isConnected, joinOrderRoom, leaveOrderRoom]);

  // Listen for status updates
  useEffect(() => {
    const cleanup = onOrderStatusUpdate((update: OrderStatusUpdate) => {
      if (update.orderId !== id) return;
      setOrder(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          status: update.status,
          statusHistory: [
            ...prev.statusHistory,
            { status: update.status, timestamp: update.timestamp, message: update.message },
          ],
        };
      });
      toast(`📦 ${update.message}`, { className: 'custom-toast', duration: 4000 });
    });
    return cleanup;
  }, [id, onOrderStatusUpdate]);

  if (loading) return <Spinner fullScreen label="Loading your order..." />;

  if (!order) {
    return (
      <div className="page-loader">
        <p style={{ color: 'var(--text-secondary)' }}>Order not found.</p>
        <Link to="/orders"><Button variant="secondary">← Back to Orders</Button></Link>
      </div>
    );
  }

  return (
    <main>
      <div className="container section-sm">
        {/* Back */}
        <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)', transition: 'color var(--transition-fast)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
          <ArrowLeft size={16} /> Back to Orders
        </Link>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>
              Order #{order.orderNumber}
            </h1>
            <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
              <Clock size={14} /> Placed {formatDate(order.createdAt)}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {isConnected && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: 'var(--space-1) var(--space-3)', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)', animation: 'pulse 1.5s infinite' }} />
                Live Tracking Active
              </div>
            )}
            <Badge status={order.status} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-8)', alignItems: 'start' }}>
          {/* Left: Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-6)' }}>
                Order Status
              </h2>
              <OrderTimeline order={order} />
            </div>

            {/* Delivery Address */}
            <div className="card" style={{ padding: 'var(--space-5)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-base)' }}>
                <MapPin size={18} color="var(--color-primary)" /> Delivery Address
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
                {order.deliveryAddress.street},<br />
                {order.deliveryAddress.city}, {order.deliveryAddress.state} — {order.deliveryAddress.pincode}
              </p>
            </div>
          </div>

          {/* Right: Order Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="card" style={{ padding: 'var(--space-5)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-base)' }}>
                <Receipt size={18} color="var(--color-primary)" /> Your Items
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 'var(--space-3)', borderBottom: idx < order.items.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: '2px' }}>
                        {item.quantity}× {item.pizzaName}
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                        {SIZE_LABELS[item.size]} · {item.crust}
                        {item.toppings.length > 0 && ` · +${item.toppings.join(', ')}`}
                      </p>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              {/* Bill */}
              <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
                {[['Subtotal', formatPrice(order.subtotal)], ['Delivery', order.deliveryFee === 0 ? 'Free' : formatPrice(order.deliveryFee)], ...(order.discount > 0 ? [['Discount', `-${formatPrice(order.discount)}`]] : [])].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>
                    <span>{l}</span><span>{v}</span>
                  </div>
                ))}
                <div className="divider" />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--color-primary)' }}>{formatPrice(order.totalAmount)}</span>
                </div>
                {order.isPaid && (
                  <p style={{ color: 'var(--color-success)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)', textAlign: 'right' }}>
                    ✓ Paid via Razorpay
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .container > div[style*='grid-template-columns'] { display: flex !important; flex-direction: column !important; }
        }
      `}</style>
    </main>
  );
};

export default OrderTracking;
