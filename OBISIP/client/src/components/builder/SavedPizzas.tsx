import React, { useState } from 'react';
import { Heart, Copy, Trash2, Play, ShoppingBag, Share2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBuilderStore, addBuilderPizzaToCart } from '../../store/builderStore';
import { formatPrice } from '../../utils/formatters';
import { calculateUnitPrice } from '../../data/builderData';

/**
 * Component for listing and managing saved custom pizzas.
 * Includes load, duplicate, delete, favorite, direct add-to-cart, export, and import.
 */
export const SavedPizzas: React.FC = () => {
  const [importJson, setImportJson] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  const savedPizzas = useBuilderStore((s) => s.savedPizzas);
  const loadFromSaved = useBuilderStore((s) => s.loadFromSaved);
  const deleteCustomPizza = useBuilderStore((s) => s.deleteCustomPizza);
  const duplicateCustomPizza = useBuilderStore((s) => s.duplicateCustomPizza);
  const toggleFavorite = useBuilderStore((s) => s.toggleFavorite);
  const getShareableConfig = useBuilderStore((s) => s.getShareableConfig);
  const importCustomPizza = useBuilderStore((s) => s.importCustomPizza);

  const handleShare = async (id: string, name: string) => {
    const json = getShareableConfig(id);
    if (!json) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(json);
        toast.success(`Copied "${name}" configuration to clipboard!`);
      } else {
        // Fallback for older browsers or restricted permissions
        const textarea = document.createElement('textarea');
        textarea.value = json;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        toast.success(`Copied "${name}" configuration to clipboard!`);
      }
    } catch {
      toast.error('Failed to copy to clipboard. Please copy manually from export JSON.');
    }
  };

  const handleImport = () => {
    if (!importJson.trim()) {
      toast.error('Please paste a valid JSON string');
      return;
    }
    const newId = importCustomPizza(importJson);
    if (newId) {
      toast.success('Custom pizza imported successfully!');
      setImportJson('');
      setShowImportModal(false);
    } else {
      toast.error('Invalid custom pizza JSON format');
    }
  };

  if (savedPizzas.length === 0 && !showImportModal) {
    return (
      <div
        className="saved-pizzas-empty"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-8)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          textAlign: 'center',
          gap: 'var(--space-3)',
        }}
      >
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          No saved custom pizzas yet. Build your dream pizza and save it!
        </p>
        <button
          onClick={() => setShowImportModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-subtle)',
            color: 'var(--text-primary)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Upload size={14} /> Import Custom Pizza JSON
        </button>
      </div>
    );
  }

  return (
    <div
      className="saved-pizzas-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-5)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0 }}>
          Saved Creations ({savedPizzas.length})
        </h3>
        <button
          onClick={() => setShowImportModal(!showImportModal)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-subtle)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Upload size={14} /> {showImportModal ? 'Cancel' : 'Import JSON'}
        </button>
      </div>

      {/* Import Modal / Input box */}
      {showImportModal && (
        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>Paste Pizza JSON Configuration:</label>
          <textarea
            rows={4}
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            placeholder='{"size":"medium","crust":"thin","sauce":"spicy",...}'
            style={{
              width: '100%',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              fontSize: '11px',
              fontFamily: 'monospace',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={handleImport}
            style={{
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'var(--color-primary)',
              color: '#fff',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Import Pizza
          </button>
        </div>
      )}

      {/* Saved Pizzas Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-3)' }}>
        {savedPizzas.map((pizza) => {
          const price = calculateUnitPrice(pizza);
          return (
            <div
              key={pizza.id}
              style={{
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {pizza.name}
                </span>
                <button
                  onClick={() => toggleFavorite(pizza.id)}
                  aria-label="Toggle favorite"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <Heart size={16} color={pizza.isFavorite ? '#ef4444' : 'var(--text-muted)'} fill={pizza.isFavorite ? '#ef4444' : 'none'} />
                </button>
              </div>

              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                {pizza.size} · {pizza.crust} crust · {pizza.sauce} sauce
                {pizza.toppings.length > 0 && ` · ${pizza.toppings.length} toppings`}
              </div>

              <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)', marginTop: 'auto' }}>
                {formatPrice(price)}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '6px', marginTop: 'var(--space-2)' }}>
                <button
                  onClick={() => loadFromSaved(pizza.id)}
                  title="Load into Builder"
                  style={{ padding: '6px 10px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--color-primary)', color: '#fff', fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', flex: 1, justifyContent: 'center' }}
                >
                  <Play size={12} /> Edit
                </button>
                <button
                  onClick={() => {
                    addBuilderPizzaToCart(pizza);
                    toast.success(`Added "${pizza.name}" to cart!`);
                  }}
                  title="Add to Cart"
                  style={{ padding: '6px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-card)', cursor: 'pointer' }}
                >
                  <ShoppingBag size={14} />
                </button>
                <button
                  onClick={() => handleShare(pizza.id, pizza.name)}
                  title="Share JSON"
                  style={{ padding: '6px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-card)', cursor: 'pointer' }}
                >
                  <Share2 size={14} />
                </button>
                <button
                  onClick={() => duplicateCustomPizza(pizza.id)}
                  title="Duplicate"
                  style={{ padding: '6px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-card)', cursor: 'pointer' }}
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={() => deleteCustomPizza(pizza.id)}
                  title="Delete"
                  style={{ padding: '6px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-card)', color: '#ef4444', cursor: 'pointer' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
