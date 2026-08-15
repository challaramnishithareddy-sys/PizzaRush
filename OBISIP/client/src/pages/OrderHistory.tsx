import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { orderApi } from '../api/order.api';
import type { Order } from '../types';
import { OrderCard } from '../components/order/OrderCard';
import { Spinner } from '../components/common/Spinner';
import { Button } from '../components/common/Button';

/**
 * Order history page — shows all past orders for the authenticated user.
 */
const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getMyOrders()
      .then(({ data }) => setOrders(data.data?.orders ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <div className="container section-sm">
        <div className="page-header">
          <h1>
            <Package size={28} style={{ display: 'inline', marginRight: '12px', verticalAlign: 'middle', color: 'var(--color-primary)' }} />
            My Orders
          </h1>
          <p>{orders.length} total orders</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)' }}>
            <Spinner size="lg" />
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state animate-fade-in">
            <div style={{ fontSize: '5rem' }}>📦</div>
            <h3>No orders yet</h3>
            <p>Order your first pizza and it will show up here.</p>
            <Button variant="primary" onClick={() => navigate('/menu')} style={{ marginTop: 'var(--space-6)' }}>
              Order Now 🍕
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {orders.map(order => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default OrderHistory;
