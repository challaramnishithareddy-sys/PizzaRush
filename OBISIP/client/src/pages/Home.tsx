import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Truck, Clock, ShieldCheck, Star, Sparkles, RotateCcw, Flame } from 'lucide-react';
import { pizzaApi } from '../api/pizza.api';
import type { Pizza } from '../types';
import type { SavedCustomPizza } from '../types/builderTypes';
import { PizzaCard } from '../components/pizza/PizzaCard';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { useBuilderStore } from '../store/builderStore';
import { formatPrice } from '../utils/formatters';

/**
 * Home page — Hero section, Activity Hub (Recently Built, Chef Picks), features & bestsellers.
 */
const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);

  // Recently built custom pizzas from local builder store
  const savedPizzas = useBuilderStore((s) => s.savedPizzas);
  const loadFromSaved = useBuilderStore((s) => s.loadFromSaved);

  useEffect(() => {
    pizzaApi.getFeatured()
      .then(({ data }) => setFeatured(data.data?.pizzas ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleBuildAgain = (saved: SavedCustomPizza) => {
    loadFromSaved(saved.id);
    navigate('/build');
  };

  const features = [
    { icon: <Truck size={28} color="var(--color-primary)" />, title: 'Fast Delivery', desc: 'Hot pizza at your door in 30–45 minutes, guaranteed.' },
    { icon: <Clock size={28} color="var(--color-secondary)" />, title: 'Live Tracking', desc: 'Real-time order status from kitchen to your door.' },
    { icon: <ShieldCheck size={28} color="var(--color-accent)" />, title: 'Secure Payments', desc: 'Pay safely with Razorpay — cards, UPI, net banking.' },
    { icon: <Star size={28} color="#fbbf24" />, title: 'Premium Quality', desc: 'Fresh ingredients sourced daily. No compromises.' },
  ];

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: '88vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--env-bg-pizzeria)',
        }}
      >
        {/* Background Glow Halo */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '650px', height: '650px', borderRadius: '50%', background: 'var(--env-glow-primary)', pointerEvents: 'none' }} />

        <div className="container" style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-12)', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', animation: 'fadeIn var(--ease-panel) both' }}>
            {/* Pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)', background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.3)', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)', animation: 'pulse 1.5s infinite' }} />
              Custom Pizza Studio V2.0 Live
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1, marginBottom: 'var(--space-6)', letterSpacing: '-0.03em' }}>
              Pizza That{' '}
              <span style={{ background: 'var(--gradient-warm)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Makes You
              </span>
              {' '}Come Back
            </h1>

            <p style={{ fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', marginBottom: 'var(--space-8)', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto var(--space-8)' }}>
              Craft your pie in 3D perspective with real-time nutrition & AI recommendations, delivered hot in under 45 mins.
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="primary" size="lg" onClick={() => navigate('/build')} leftIcon={<Sparkles size={18} />} rightIcon={<ArrowRight size={18} />}>
                Launch Pizza Studio ✨
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/menu')}>
                View Menu
              </Button>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 'var(--space-8)', justifyContent: 'center', marginTop: 'var(--space-12)', flexWrap: 'wrap' }}>
              {[['10K+', 'Happy Customers'], ['4.8★', 'Average Rating'], ['30min', 'Avg Delivery'], ['25+', 'Pizza Varieties']].map(([num, label]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-2xl)', color: 'var(--color-primary)' }}>{num}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Activity Hub: Recently Built & Build Again ───────────── */}
      {savedPizzas.length > 0 && (
        <section className="section-sm" style={{ background: 'rgba(255,255,255,0.015)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <RotateCcw color="var(--color-primary)" size={22} /> Recently Built Creations
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginTop: '2px', margin: 0 }}>
                  Re-open or order your previous custom recipes with one click.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
              {savedPizzas.slice(0, 3).map((saved) => (
                <div
                  key={saved.id}
                  className="glass-panel-v2"
                  style={{
                    padding: 'var(--space-4)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 'var(--space-3)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>{saved.name}</span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{saved.size}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', marginTop: '4px', margin: 0 }}>
                      {saved.crust} · {saved.sauce} sauce · {saved.toppings.length} toppings
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => handleBuildAgain(saved)} leftIcon={<RotateCcw size={14} />}>
                    Build Again
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Features ──────────────────────────────────────────────── */}
      <section className="section-sm" style={{ background: 'var(--bg-surface)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)' }}>
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="glass-panel-v2" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
                  {icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Bestsellers ───────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Our <span>Bestsellers</span></h2>
          <p className="section-subtitle">Hand-picked favourites loved by thousands of customers</p>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="pizza-grid">
                {featured.map(pizza => <PizzaCard key={pizza._id} pizza={pizza} />)}
              </div>
              <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
                <Button variant="secondary" size="lg" onClick={() => navigate('/menu')} rightIcon={<ChevronRight size={18} />}>
                  View Full Menu
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;

