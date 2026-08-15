import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, UserPlus } from 'lucide-react';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import toast from 'react-hot-toast';

/**
 * Registration page with name, email, phone, password, and confirm-password fields.
 */
const Register: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loading, setLoading] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (form.phone && !/^\d{10}$/.test(form.phone)) e.phone = 'Enter a 10-digit phone number';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await authApi.register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone || undefined,
      });
      const { token, user } = data.data!;
      setAuth(user, token);
      toast.success(`Welcome to PizzaHub, ${user.name.split(' ')[0]}! 🍕`, { className: 'custom-toast' });
      navigate('/menu');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg, { className: 'custom-toast' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8) var(--space-4)', background: 'radial-gradient(ellipse at 50% 0%, rgba(230,57,70,0.08) 0%, transparent 60%)' }}>
      <div className="form-card animate-scale-in">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>🍕</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Join PizzaHub and order your favourite pizza</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input id="reg-name" label="Full Name *" placeholder="John Doe" value={form.name} onChange={set('name')} error={errors.name} leftIcon={<User size={16} />} autoComplete="name" />
          <Input id="reg-email" label="Email Address *" type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} error={errors.email} leftIcon={<Mail size={16} />} autoComplete="email" />
          <Input id="reg-phone" label="Phone Number" placeholder="10-digit mobile (optional)" value={form.phone} onChange={set('phone')} error={errors.phone} leftIcon={<Phone size={16} />} maxLength={10} />
          <Input id="reg-password" label="Password *" type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} error={errors.password} leftIcon={<Lock size={16} />} autoComplete="new-password" />
          <Input id="reg-confirm" label="Confirm Password *" type="password" placeholder="Repeat your password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} leftIcon={<Lock size={16} />} autoComplete="new-password" />

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} leftIcon={<UserPlus size={18} />} style={{ marginTop: 'var(--space-2)' }}>
            Create Account
          </Button>
        </form>

        <div className="divider" />
        <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
