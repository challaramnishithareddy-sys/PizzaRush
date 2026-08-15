import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Order } from '../../types';
import { Badge } from '../common/Badge';
import { formatPrice, formatDate } from '../../utils/formatters';

interface OrderCardProps {
  order: Order;
}

/**
 * Order summary card for the order history list.
 */
export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <Link
      to={`/orders/${order._id}`}
      style={{ textDecoration: 'none' }}
    >
      <div
        className="card"
        style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
      >
        {/* Header Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)' }}>
              #{order.orderNumber}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginTop: '2px' }}>
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Badge status={order.status} />
            <ChevronRight size={16} color="var(--text-muted)" />
          </div>
        </div>

        {/* Items Summary */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {order.items.map((item, idx) => (
            <span key={idx}
              style={{ padding: '4px 10px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
              {item.quantity}× {item.pizzaName} ({item.size})
            </span>
          ))}
        </div>

        {/* Footer Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            {order.items.reduce((s, i) => s + i.quantity, 0)} item{order.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
          </p>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--color-primary)' }}>
              {formatPrice(order.totalAmount)}
            </p>
            {order.isPaid && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>✓ Paid</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
