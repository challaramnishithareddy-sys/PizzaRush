import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Star } from 'lucide-react';
import { pizzaApi } from '../../api/pizza.api';
import type { Pizza } from '../../types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  name: '', description: '', category: 'veg' as Pizza['category'],
  basePrice: 0,
  sizes: [{ size: 'small' as const, price: 199 }, { size: 'medium' as const, price: 299 }, { size: 'large' as const, price: 399 }],
  crusts: ['thin', 'thick', 'stuffed'],
  toppings: [] as { name: string; price: number }[],
  image: '', isFeatured: false, isAvailable: true, tags: [] as string[],
};

/**
 * Admin pizza management — full CRUD with toggle availability.
 */
const ManagePizzas: React.FC = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPizza, setEditingPizza] = useState<Pizza | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  const fetchPizzas = async () => {
    setLoading(true);
    try {
      const { data } = await pizzaApi.getAll({ available: 'false', limit: 50 });
      setPizzas(data.data?.pizzas ?? []);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchPizzas(); }, []);

  const openCreate = () => {
    setEditingPizza(null);
    setForm(EMPTY_FORM);
    setTagsInput('');
    setModalOpen(true);
  };

  const openEdit = (pizza: Pizza) => {
    setEditingPizza(pizza);
    setForm({
      name: pizza.name, description: pizza.description, category: pizza.category,
      basePrice: pizza.basePrice, sizes: pizza.sizes as typeof EMPTY_FORM['sizes'],
      crusts: pizza.crusts, toppings: pizza.toppings,
      image: pizza.image, isFeatured: pizza.isFeatured,
      isAvailable: pizza.isAvailable, tags: pizza.tags,
    });
    setTagsInput(pizza.tags.join(', '));
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.description.trim()) {
      toast.error('Name and description are required'); return;
    }
    setSaving(true);
    try {
      const payload = { ...form, tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean), basePrice: form.sizes[0]?.price ?? form.basePrice };
      if (editingPizza) {
        const { data } = await pizzaApi.update(editingPizza._id, payload);
        setPizzas(prev => prev.map(p => p._id === editingPizza._id ? data.data!.pizza : p));
        toast.success('Pizza updated!', { className: 'custom-toast' });
      } else {
        const { data } = await pizzaApi.create(payload);
        setPizzas(prev => [data.data!.pizza, ...prev]);
        toast.success('Pizza created!', { className: 'custom-toast' });
      }
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save pizza');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this pizza?')) return;
    try {
      await pizzaApi.delete(id);
      setPizzas(prev => prev.filter(p => p._id !== id));
      toast.success('Pizza deleted', { className: 'custom-toast' });
    } catch { toast.error('Failed to delete pizza'); }
  };

  const handleToggle = async (id: string) => {
    try {
      const { data } = await pizzaApi.toggleAvailability(id);
      setPizzas(prev => prev.map(p => p._id === id ? data.data!.pizza : p));
      toast.success('Availability updated', { className: 'custom-toast' });
    } catch { toast.error('Failed to toggle availability'); }
  };

  const updateSize = (idx: number, price: number) => {
    setForm(f => ({ ...f, sizes: f.sizes.map((s, i) => i === idx ? { ...s, price } : s) }));
  };

  return (
    <main>
      <div className="container section-sm">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)' }}>🍕 Manage Pizzas</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>{pizzas.length} pizzas in the menu</p>
          </div>
          <Button variant="primary" size="md" onClick={openCreate} leftIcon={<Plus size={16} />}>Add Pizza</Button>
        </div>

        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)' }}><Spinner size="lg" /></div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {pizzas.map(pizza => (
              <div key={pizza._id} className="card" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <img src={pizza.image} alt={pizza.name} style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }}
                  onError={e => (e.currentTarget.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&q=80')} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)' }}>{pizza.name}</h3>
                    <Badge category={pizza.category} />
                    {pizza.isFeatured && <Badge label="⭐ Featured" className="badge-confirming" />}
                    {!pizza.isAvailable && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)', padding: '2px 8px', background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--radius-full)' }}>Unavailable</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                    {pizza.sizes.map(s => (
                      <span key={s.size} style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{s.size}: <strong>{formatPrice(s.price)}</strong></span>
                    ))}
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={10} fill="#fbbf24" color="#fbbf24" /> {pizza.rating}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
                  <Button variant="ghost" size="icon" onClick={() => handleToggle(pizza._id)} aria-label="Toggle availability">
                    {pizza.isAvailable ? <ToggleRight size={18} color="var(--color-success)" /> : <ToggleLeft size={18} color="var(--text-muted)" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(pizza)} aria-label="Edit pizza">
                    <Pencil size={16} color="var(--color-info)" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(pizza._id)} aria-label="Delete pizza">
                    <Trash2 size={16} color="var(--color-error)" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingPizza ? `Edit: ${editingPizza.name}` : 'Add New Pizza'} maxWidth="640px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxHeight: '70vh', overflowY: 'auto', paddingRight: 'var(--space-1)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <Input label="Pizza Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Margherita Classic" style={{ gridColumn: '1 / -1' }} />
          </div>
          <div className="input-group">
            <label className="input-label">Description *</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="input" rows={3} placeholder="Describe this pizza…" style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="input-group">
              <label className="input-label">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Pizza['category'] }))} className="input">
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
                <option value="specialty">Specialty</option>
              </select>
            </div>
            <Input label="Image URL" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://…" />
          </div>

          {/* Size Prices */}
          <div>
            <p className="input-label" style={{ marginBottom: 'var(--space-2)' }}>Size Prices (₹)</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
              {form.sizes.map((s, idx) => (
                <Input key={s.size} label={s.size.charAt(0).toUpperCase() + s.size.slice(1)} type="number" value={s.price} onChange={e => updateSize(idx, Number(e.target.value))} />
              ))}
            </div>
          </div>

          <Input label="Tags (comma-separated)" value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="spicy, vegetarian, bestseller" />

          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            {[['isFeatured', '⭐ Featured'], ['isAvailable', '✅ Available']].map(([key, label]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={form[key as 'isFeatured' | 'isAvailable']} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }} />
                {label}
              </label>
            ))}
          </div>

          <Button variant="primary" size="lg" fullWidth loading={saving} onClick={handleSave}>
            {editingPizza ? 'Save Changes' : 'Create Pizza'}
          </Button>
        </div>
      </Modal>
    </main>
  );
};

export default ManagePizzas;
