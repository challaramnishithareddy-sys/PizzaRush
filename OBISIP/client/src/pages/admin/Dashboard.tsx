import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Package, DollarSign, Calendar, ChevronRight } from 'lucide-react';
import { orderApi } from '../../api/order.api';
import type { AdminStats } from '../../types';
import { Spinner } from '../../components/common/Spinner';
import { formatPrice } from '../../utils/formatters';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * Admin dashboard with revenue chart, stat cards, and quick links.
 */
const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getAdminStats()
      .then(({ data }) => setStats(data.data!))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner fullScreen label="Loading dashboard…" />;

  const statCards = [
    { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: <Package size={22} />, color: 'var(--color-primary)' },
    { label: "Today's Orders", value: stats?.todayOrders ?? 0, icon: <Calendar size={22} />, color: 'var(--color-accent)' },
    { label: 'Total Revenue', value: formatPrice(stats?.totalRevenue ?? 0), icon: <DollarSign size={22} />, color: 'var(--color-secondary)' },
    { label: 'Active Orders', value: (stats?.statusCounts?.pending ?? 0) + (stats?.statusCounts?.confirmed ?? 0) + (stats?.statusCounts?.preparing ?? 0), icon: <TrendingUp size={22} />, color: '#818cf8' },
  ];

  const chartData = stats?.revenueData.map(d => ({ date: d._id, revenue: d.revenue, orders: d.orders })) ?? [];

  return (
    <main>
      <div className="container section-sm">
        <div className="page-header">
          <h1>⚙️ Admin Dashboard</h1>
          <p>PizzaHub operations overview</p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-8)' }}>
          {statCards.map(({ label, value, icon, color }) => (
            <div key={label} className="card" style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: `${color}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
                {icon}
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginBottom: '4px' }}>{label}</p>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-2xl)', color }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-6)' }}>
            📈 Revenue (Last 30 Days)
          </h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e63946" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#e63946" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px' }} formatter={(v: number) => [formatPrice(v), 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#e63946" strokeWidth={2} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>No revenue data yet</div>
          )}
        </div>

        {/* Order Status Breakdown */}
        {stats?.statusCounts && (
          <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-5)' }}>📦 Order Status Breakdown</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-3)' }}>
              {Object.entries(stats.statusCounts).map(([status, count]) => (
                <div key={status} style={{ padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-2xl)', marginBottom: '4px' }}>{count}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', textTransform: 'capitalize' }}>{status.replace('_', ' ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
          {[{ to: '/admin/orders', label: 'Manage Orders', icon: '📦', desc: 'View and update order statuses' }, { to: '/admin/pizzas', label: 'Manage Pizzas', icon: '🍕', desc: 'Add, edit, or remove menu items' }].map(({ to, label, icon, desc }) => (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <span style={{ fontSize: '1.8rem' }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '2px' }}>{label}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{desc}</p>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
