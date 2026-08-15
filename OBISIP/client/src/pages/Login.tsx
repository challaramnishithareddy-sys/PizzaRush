import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import toast from 'react-hot-toast';

/**
 * Login page with email/password authentication form.
 */
const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const from = (location.state as { from?: string })?.from || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email address';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await authApi.login({ email, password });
      const { token, user } = data.data!;
      setAuth(user, token);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 🍕`, { className: 'custom-toast' });
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg, { className: 'custom-toast' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8) var(--space-4)', background: 'radial-gradient(ellipse at 50% 0%, rgba(230,57,70,0.08) 0%, transparent 60%)' }}>
      <div className="form-card animate-scale-in">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>🍕</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Sign in to your PizzaHub account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input id="login-email" label="Email Address" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} leftIcon={<Mail size={16} />} autoComplete="email" />
          <Input id="login-password" label="Password" type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} error={errors.password} leftIcon={<Lock size={16} />} autoComplete="current-password" />

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} leftIcon={<LogIn size={18} />} style={{ marginTop: 'var(--space-2)' }}>
            Sign In
          </Button>
        </form>

        <div className="divider" />
        <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" state={{ from }} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
