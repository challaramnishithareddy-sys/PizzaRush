import React from 'react';
import { Check } from 'lucide-react';
import type { Order, OrderStatus } from '../../types';
import { ORDER_STATUS_STEPS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

const STEP_ICONS: Record<string, string> = {
  pending: '📋',
  confirmed: '✅',
  preparing: '👨‍🍳',
  out_for_delivery: '🚴',
  delivered: '🎉',
};

const STEP_LABELS: Record<string, string> = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};

interface OrderTimelineProps {
  order: Order;
}

/**
 * Visual step-by-step order status timeline.
 * Highlights the current step and marks completed ones in green.
 */
export const OrderTimeline: React.FC<OrderTimelineProps> = ({ order }) => {
  const currentStepIndex = ORDER_STATUS_STEPS.indexOf(order.status as typeof ORDER_STATUS_STEPS[number]);
  const isCancelled = order.status === 'cancelled';

  if (isCancelled) {
    return (
      <div style={{ padding: 'var(--space-5)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>❌</p>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-error)', marginBottom: '4px' }}>Order Cancelled</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>This order has been cancelled.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Step Progress */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)', overflowX: 'auto', paddingBottom: 'var(--space-2)' }}>
        {ORDER_STATUS_STEPS.map((step, idx) => {
          const isCompleted = currentStepIndex > idx;
          const isActive = currentStepIndex === idx;
          return (
            <React.Fragment key={step}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0, minWidth: '72px' }}>
                {/* Dot */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: isCompleted ? 'var(--color-success)' : isActive ? 'var(--color-primary)' : 'var(--bg-elevated)',
                  border: `2px solid ${isCompleted ? 'var(--color-success)' : isActive ? 'var(--color-primary)' : 'var(--border-default)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem',
                  boxShadow: isActive ? '0 0 16px var(--color-primary-glow)' : isCompleted ? '0 0 12px rgba(34,197,94,0.3)' : 'none',
                  transition: 'all var(--transition-base)',
                  animation: isActive ? 'pulse 1.5s infinite' : 'none',
                }}>
                  {isCompleted ? <Check size={18} color="#fff" /> : STEP_ICONS[step]}
                </div>
                <p style={{ fontSize: '11px', color: isActive ? 'var(--color-primary)' : isCompleted ? 'var(--color-success)' : 'var(--text-muted)', fontWeight: isActive || isCompleted ? 600 : 400, textAlign: 'center', lineHeight: 1.3 }}>
                  {STEP_LABELS[step]}
                </p>
              </div>
              {idx < ORDER_STATUS_STEPS.length - 1 && (
                <div style={{ flex: 1, height: '2px', background: isCompleted ? 'var(--color-success)' : 'var(--border-default)', margin: '0 var(--space-2)', marginBottom: 'var(--space-6)', transition: 'background var(--transition-slow)', minWidth: '20px' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Status History */}
      <div className="timeline">
        {[...order.statusHistory].reverse().map((event, idx) => (
          <div key={idx} className={`timeline-item ${idx === 0 ? 'active' : 'completed'}`} style={{ paddingBottom: 'var(--space-5)' }}>
            <div className="timeline-dot">
              {idx === 0 ? <span style={{ fontSize: '12px' }}>{STEP_ICONS[event.status] || '📌'}</span> : <Check size={12} color="#fff" />}
            </div>
            <div className="timeline-body">
              <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: '2px' }}>{event.message}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{formatDate(event.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
