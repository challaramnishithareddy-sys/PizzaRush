import React, { useEffect, useState } from 'react';
import { orderApi } from '../../api/order.api';
import { useSocketContext } from '../../context/SocketContext';
import type { Order, OrderStatus, OrderStatusUpdate } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { formatPrice, formatRelativeTime } from '../../utils/formatters';
import { ORDER_STATUS_LABELS } from '../../utils/constants';
import toast from 'react-hot-toast';

const STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

/**
 * Admin order management — view all orders and update status with real-time notifications.
 */
const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [updating, setUpdating] = useState<string | null>(null);
  const { joinAdminRoom, onOrderStatusUpdate } = useSocketContext();

  useEffect(() => { joinAdminRoom(); }, [joinAdminRoom]);

  useEffect(() => {
    // Listen for new orders from other admin sessions
    const cleanup = onOrderStatusUpdate((update: OrderStatusUpdate) => {
      setOrders(prev => prev.map(o =>
        o._id === update.orderId ? { ...o, status: update.status } : o
      ));
    });
    return cleanup;
  }, [onOrderStatusUpdate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await orderApi.getAllOrders({ status: filter === 'all' ? undefined : filter, limit: 50 });
      setOrders(data.data?.orders ?? []);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setUpdating(orderId);
    try {
      const { data } = await orderApi.updateStatus(orderId, status);
      setOrders(prev => prev.map(o => o._id === orderId ? data.data!.order : o));
      toast.success(`Order status → ${ORDER_STATUS_LABELS[status]}`, { className: 'custom-toast' });
    } catch { toast.error('Failed to update status'); }
    finally { setUpdating(null); }
  };

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <main>
      <div className="container section-sm">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)' }}>📦 Manage Orders</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>{filtered.length} orders</p>
          </div>
          <button onClick={fetchOrders} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-4)', cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', transition: 'all var(--transition-fast)' }}>
            🔄 Refresh
          </button>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
          {['all', ...STATUS_FLOW, 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s as OrderStatus | 'all')}
              style={{ padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-full)', border: `1px solid ${filter === s ? 'var(--color-primary)' : 'var(--border-default)'}`, background: filter === s ? 'rgba(230,57,70,0.15)' : 'var(--bg-elevated)', color: filter === s ? 'var(--color-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-body)', fontWeight: filter === s ? 600 : 400, transition: 'all var(--transition-fast)', textTransform: 'capitalize' }}>
              {s === 'all' ? 'All' : ORDER_STATUS_LABELS[s as OrderStatus]}
            </button>
          ))}
        </div>

        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)' }}><Spinner size="lg" /></div> : filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">📦</div><h3>No orders found</h3></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {filtered.map(order => {
              const user = typeof order.user === 'object' ? order.user : null;
              const nextStatus = getNextStatus(order.status);
              return (
                <div key={order._id} className="card" style={{ padding: 'var(--space-5)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                    {/* Order Info */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)' }}>#{order.orderNumber}</span>
                        <Badge status={order.status} />
                        {order.isPaid && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>✓ Paid</span>}
                      </div>
                      {user && (
                        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                          👤 {user.name} · {user.email}
                          {user.phone ? ` · ${user.phone}` : ''}
                        </p>
                      )}
                      <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginTop: '2px' }}>
                        📍 {order.deliveryAddress.street}, {order.deliveryAddress.city}
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginTop: '2px' }}>
                        🕐 {formatRelativeTime(order.createdAt)}
                      </p>
                    </div>

                    {/* Amount + Action */}
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-2)' }}>
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--color-primary)' }}>{formatPrice(order.totalAmount)}</p>
                      {nextStatus && order.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusChange(order._id, nextStatus)}
                          disabled={updating === order._id}
                          style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--gradient-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 600, opacity: updating === order._id ? 0.7 : 1, whiteSpace: 'nowrap', transition: 'opacity var(--transition-fast)' }}>
                          {updating === order._id ? '⏳ Updating…' : `→ Mark as ${ORDER_STATUS_LABELS[nextStatus]}`}
                        </button>
                      )}
                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <button onClick={() => handleStatusChange(order._id, 'cancelled')}
                          style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-body)' }}>
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)' }}>
                    {order.items.map((item, idx) => (
                      <span key={idx} style={{ padding: '2px 10px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                        {item.quantity}× {item.pizzaName} ({item.size})
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default ManageOrders;
