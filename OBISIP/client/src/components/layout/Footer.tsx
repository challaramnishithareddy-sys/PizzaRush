import React from 'react';
import { Link } from 'react-router-dom';
import { Pizza, Github, Linkedin, Heart } from 'lucide-react';

/**
 * Site-wide footer with links, branding, and social icons.
 */
export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: 'auto',
      }}
    >
      <div className="container" style={{ padding: 'var(--space-12) var(--space-6) var(--space-8)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-8)' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <Pizza size={24} color="var(--color-primary)" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xl)',
                background: 'var(--gradient-warm)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                PizzaHub
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.8, maxWidth: '220px' }}>
              Fresh, hand-crafted pizzas delivered hot to your doorstep. Order online & track in real-time.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <a href="https://github.com" target="_blank" rel="noreferrer"
                style={{ color: 'var(--text-muted)', transition: 'color var(--transition-fast)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                <Github size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer"
                style={{ color: 'var(--text-muted)', transition: 'color var(--transition-fast)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-info)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
              Quick Links
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {[['/', 'Home'], ['/menu', 'Our Menu'], ['/orders', 'Track Order'], ['/profile', 'Profile']].map(([to, label]) => (
                <Link key={to} to={to}
                  style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', transition: 'color var(--transition-fast)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
              Categories
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {[['🌿 Vegetarian', 'veg'], ['🍖 Non-Vegetarian', 'non-veg'], ['⭐ Specialty', 'specialty']].map(([label, cat]) => (
                <Link key={cat} to={`/menu?category=${cat}`}
                  style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', transition: 'color var(--transition-fast)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Info */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
              Info
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {[['📍', 'Hyderabad, Telangana'], ['📞', '+91 9876543210'], ['✉️', 'hello@pizzahub.com'], ['🕐', 'Mon–Sun: 10AM – 11PM']].map(([icon, text]) => (
                <p key={text} style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', display: 'flex', gap: 'var(--space-2)' }}>
                  <span>{icon}</span>{text}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="divider" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
            © {new Date().getFullYear()} PizzaHub. All rights reserved.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Built with <Heart size={12} color="var(--color-primary)" fill="var(--color-primary)" /> for Oasis Infobyte Internship
          </p>
        </div>
      </div>
    </footer>
  );
};
