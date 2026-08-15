import React, { useState } from 'react';
import { User, Phone, MapPin, Plus, Trash2, Save } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth.api';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import type { Address } from '../types';
import toast from 'react-hot-toast';

/**
 * Profile management page — update name, phone, and address book.
 */
const Profile: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [addresses, setAddresses] = useState<Address[]>(user?.addresses ?? []);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await authApi.updateProfile({ name, phone, addresses });
      updateUser(data.data!);
      toast.success('Profile updated successfully!', { className: 'custom-toast' });
    } catch {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addAddress = () => {
    setAddresses(prev => [...prev, { label: 'Home', street: '', city: '', state: '', pincode: '', isDefault: prev.length === 0 }]);
  };

  const removeAddress = (idx: number) => {
    setAddresses(prev => prev.filter((_, i) => i !== idx));
  };

  const updateAddress = (idx: number, field: keyof Address, value: string | boolean) => {
    setAddresses(prev => prev.map((addr, i) => i === idx ? { ...addr, [field]: value } : addr));
  };

  const setDefault = (idx: number) => {
    setAddresses(prev => prev.map((addr, i) => ({ ...addr, isDefault: i === idx })));
  };

  return (
    <main>
      <div className="container section-sm" style={{ maxWidth: '760px' }}>
        <div className="page-header">
          <h1><User size={28} style={{ display: 'inline', marginRight: '12px', verticalAlign: 'middle', color: 'var(--color-primary)' }} />My Profile</h1>
          <p>Manage your account details and saved addresses</p>
        </div>

        {/* Personal Info */}
        <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <User size={18} color="var(--color-primary)" /> Personal Information
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" leftIcon={<User size={14} />} />
            <Input label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit mobile number" leftIcon={<Phone size={14} />} maxLength={10} />
            <Input label="Email Address" value={user?.email ?? ''} disabled hint="Email cannot be changed" style={{ gridColumn: '1 / -1' }} />
          </div>
        </div>

        {/* Addresses */}
        <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <MapPin size={18} color="var(--color-primary)" /> Saved Addresses
            </h2>
            <Button variant="secondary" size="sm" onClick={addAddress} leftIcon={<Plus size={14} />}>Add Address</Button>
          </div>

          {addresses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
              <p>No saved addresses. Add one to speed up checkout!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {addresses.map((addr, idx) => (
                <div key={idx} style={{ padding: 'var(--space-5)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: `1px solid ${addr.isDefault ? 'var(--color-primary)' : 'var(--border-subtle)'}`, position: 'relative' }}>
                  {addr.isDefault && (
                    <span style={{ position: 'absolute', top: '12px', right: '12px', padding: '2px 8px', background: 'rgba(230,57,70,0.15)', color: 'var(--color-primary)', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: 600 }}>Default</span>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    <Input label="Label" value={addr.label} onChange={e => updateAddress(idx, 'label', e.target.value)} placeholder="Home, Office…" />
                    <Input label="Pincode" value={addr.pincode} onChange={e => updateAddress(idx, 'pincode', e.target.value)} placeholder="500001" maxLength={6} />
                    <Input label="Street" value={addr.street} onChange={e => updateAddress(idx, 'street', e.target.value)} placeholder="123 Main St" style={{ gridColumn: '1 / -1' }} />
                    <Input label="City" value={addr.city} onChange={e => updateAddress(idx, 'city', e.target.value)} placeholder="Hyderabad" />
                    <Input label="State" value={addr.state} onChange={e => updateAddress(idx, 'state', e.target.value)} placeholder="Telangana" />
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                    {!addr.isDefault && (
                      <Button variant="ghost" size="sm" onClick={() => setDefault(idx)}>Set as Default</Button>
                    )}
                    <Button variant="danger" size="sm" onClick={() => removeAddress(idx)} leftIcon={<Trash2 size={14} />} style={{ marginLeft: 'auto' }}>Remove</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <Button variant="primary" size="lg" fullWidth loading={saving} onClick={handleSave} leftIcon={<Save size={18} />}>
          Save Changes
        </Button>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .card div[style*='grid-template-columns: 1fr 1fr'] { display: flex !important; flex-direction: column !important; }
        }
      `}</style>
    </main>
  );
};

export default Profile;
