import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu, X, Pizza } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../common/Button';

/**
 * Main navigation header.
 * Responsive — collapses to hamburger menu on mobile.
 */
export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { itemCount } = useCartStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-sticky)' as unknown as number,
        background: scrolled
          ? 'rgba(13,13,15,0.92)'
          : 'rgba(13,13,15,0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'background var(--transition-base)',
      }}
    >
      <nav className="container" style={{ display: 'flex', alignItems: 'center', height: '64px', gap: 'var(--space-4)' }}>
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'var(--text-xl)',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <Pizza size={28} color="var(--color-primary)" />
          <span style={{ background: 'var(--gradient-warm)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            PizzaHub
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginLeft: 'var(--space-4)', flex: 1 }}
             className="desktop-nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>Home</NavLink>
          <NavLink to="/menu" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Menu</NavLink>
          <NavLink to="/build" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Custom Studio ✨</NavLink>
          {isAuthenticated && (
            <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Orders</NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Admin</NavLink>
          )}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginLeft: 'auto' }}>
          {/* Cart */}
          <Link to="/cart" style={{ position: 'relative' }}>
            <Button variant="ghost" size="icon" aria-label="Shopping cart">
              <ShoppingCart size={20} />
            </Button>
            {itemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {/* Auth Actions — Desktop */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} leftIcon={<LayoutDashboard size={16} />}>
                    Dashboard
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => navigate('/profile')} leftIcon={<User size={16} />}>
                  {user?.name.split(' ')[0]}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                  <LogOut size={18} />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Log in</Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/register')}>Sign up</Button>
              </>
            )}
          </div>

          {/* Hamburger — Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="mobile-nav-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ display: 'none' }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-subtle)',
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
          }}
        >
          <NavLink to="/" className="nav-link" onClick={closeMenu} end>🏠 Home</NavLink>
          <NavLink to="/menu" className="nav-link" onClick={closeMenu}>🍕 Menu</NavLink>
          <NavLink to="/build" className="nav-link" onClick={closeMenu}>✨ Custom Studio</NavLink>
          {isAuthenticated && (
            <NavLink to="/orders" className="nav-link" onClick={closeMenu}>📦 My Orders</NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className="nav-link" onClick={closeMenu}>⚙️ Admin Dashboard</NavLink>
          )}
          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className="nav-link" onClick={closeMenu}>👤 Profile</NavLink>
              <button
                className="nav-link"
                onClick={handleLogout}
                style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              <Button variant="secondary" size="sm" fullWidth onClick={() => { navigate('/login'); closeMenu(); }}>Log in</Button>
              <Button variant="primary" size="sm" fullWidth onClick={() => { navigate('/register'); closeMenu(); }}>Sign up</Button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  );
};
