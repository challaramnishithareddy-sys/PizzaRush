import React, { useState } from 'react';
import { Plus, Minus, Flame, Check, Sparkles, Info } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import {
  BUILDER_SIZES,
  BUILDER_CRUSTS,
  BUILDER_SAUCES,
  BUILDER_CHEESES,
  VEG_TOPPINGS,
  NON_VEG_TOPPINGS,
  BUILDER_SEASONINGS,
} from '../../data/builderData';
import { formatPrice } from '../../utils/formatters';
import type {
  BuilderSize,
  BuilderCrustId,
  BuilderSauceId,
  BuilderCheeseId,
  BuilderTopping,
} from '../../types/builderTypes';
import { ToppingMiniPreview } from './ToppingMiniPreview';

type TabCategory = 'size' | 'crust' | 'sauce' | 'cheese' | 'toppings' | 'seasonings';

/**
 * Interactive selector panel with hover inspector and rich ingredient metadata.
 */
export const IngredientSelector: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabCategory>('size');
  const [hoveredTopping, setHoveredTopping] = useState<BuilderTopping | null>(null);

  // Atomic selectors for current state
  const configSize = useBuilderStore((s) => s.config.size);
  const configCrust = useBuilderStore((s) => s.config.crust);
  const configSauce = useBuilderStore((s) => s.config.sauce);
  const configCheese = useBuilderStore((s) => s.config.cheese);
  const selectedToppings = useBuilderStore((s) => s.config.toppings);
  const selectedSeasonings = useBuilderStore((s) => s.config.seasonings);

  // Actions
  const setSize = useBuilderStore((s) => s.setSize);
  const setCrust = useBuilderStore((s) => s.setCrust);
  const setSauce = useBuilderStore((s) => s.setSauce);
  const setCheese = useBuilderStore((s) => s.setCheese);
  const addTopping = useBuilderStore((s) => s.addTopping);
  const setToppingQuantity = useBuilderStore((s) => s.setToppingQuantity);
  const toggleSeasoning = useBuilderStore((s) => s.toggleSeasoning);

  const getToppingQty = (id: string) =>
    selectedToppings.find((t) => t.toppingId === id)?.quantity || 0;

  return (
    <div
      className="ingredient-selector glass-panel-v2"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-5)',
      }}
    >
      {/* Category Tabs */}
      <div
        className="tab-bar"
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          overflowX: 'auto',
          paddingBottom: 'var(--space-2)',
          borderBottom: '1px solid var(--glass-border)',
        }}
      >
        {(['size', 'crust', 'sauce', 'cheese', 'toppings', 'seasonings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeTab === tab ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === tab ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all var(--ease-hover)',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === tab ? '0 4px 12px rgba(230, 57, 70, 0.35)' : 'none',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panel Content */}
      <div className="tab-content" style={{ marginTop: 'var(--space-2)' }}>
        {/* SIZE TAB */}
        {activeTab === 'size' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 'var(--space-3)' }}>
            {BUILDER_SIZES.map((s, idx) => {
              const isSelected = configSize === s.id;
              const circlePx = 28 + idx * 8; // Visual size circle scaling
              return (
                <div
                  key={s.id}
                  onClick={() => setSize(s.id as BuilderSize)}
                  style={{
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)',
                    background: isSelected ? 'rgba(230, 57, 70, 0.12)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '6px',
                    transition: 'all var(--ease-selection)',
                  }}
                >
                  <div
                    style={{
                      width: `${circlePx}px`,
                      height: `${circlePx}px`,
                      borderRadius: '50%',
                      border: `2px dashed ${isSelected ? 'var(--color-primary)' : 'var(--border-default)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: 'var(--text-muted)',
                      transition: 'all var(--ease-hover)',
                    }}
                  >
                    {s.diameter}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>{s.label}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>Serves {s.serves}</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>
                    {formatPrice(s.price)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* CRUST TAB */}
        {activeTab === 'crust' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-3)' }}>
            {BUILDER_CRUSTS.map((c) => {
              const isSelected = configCrust === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setCrust(c.id as BuilderCrustId)}
                  style={{
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)',
                    background: isSelected ? 'rgba(230, 57, 70, 0.12)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    transition: 'all var(--ease-selection)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{c.label}</span>
                    {isSelected && <Check size={16} color="var(--color-primary)" />}
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{c.description}</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: 'var(--text-xs)', marginTop: 'auto' }}>
                    {c.extraPrice > 0 ? `+${formatPrice(c.extraPrice)}` : 'Included'}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* SAUCE TAB */}
        {activeTab === 'sauce' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-3)' }}>
            {BUILDER_SAUCES.map((s) => {
              const isSelected = configSauce === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSauce(s.id as BuilderSauceId)}
                  style={{
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)',
                    background: isSelected ? 'rgba(230, 57, 70, 0.12)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    transition: 'all var(--ease-selection)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: s.color }} />
                    <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{s.label}</span>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{s.description}</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: 'var(--text-xs)' }}>
                      {s.extraPrice > 0 ? `+${formatPrice(s.extraPrice)}` : 'Included'}
                    </span>
                    {s.spiceLevel > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#ef4444', fontSize: '10px' }}>
                        <Flame size={12} /> {s.spiceLevel}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CHEESE TAB */}
        {activeTab === 'cheese' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-3)' }}>
            {BUILDER_CHEESES.map((ch) => {
              const isSelected = configCheese === ch.id;
              return (
                <div
                  key={ch.id}
                  onClick={() => setCheese(ch.id as BuilderCheeseId)}
                  style={{
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)',
                    background: isSelected ? 'rgba(230, 57, 70, 0.12)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    transition: 'all var(--ease-selection)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{ch.label}</span>
                    {isSelected && <Check size={16} color="var(--color-primary)" />}
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{ch.description}</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: 'var(--text-xs)', marginTop: 'auto' }}>
                    {ch.extraPrice > 0 ? `+${formatPrice(ch.extraPrice)}` : 'Included'}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* TOPPINGS TAB WITH MINI HOVER INSPECTOR */}
        {activeTab === 'toppings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {/* Hover Inspector Banner */}
            {hoveredTopping && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'rgba(230, 57, 70, 0.1)',
                  border: '1px solid var(--color-primary-glow)',
                  borderRadius: 'var(--radius-lg)',
                  animation: 'fadeIn var(--ease-hover) both',
                }}
              >
                <ToppingMiniPreview topping={hoveredTopping} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{hoveredTopping.name}</span>
                    {hoveredTopping.popularity && (
                      <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: 'var(--radius-full)', background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', fontWeight: 700 }}>
                        ★ {hoveredTopping.popularity}% Popular
                      </span>
                    )}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', margin: '2px 0 0 0' }}>
                    Pairing: <strong style={{ color: 'var(--color-primary-light)' }}>{hoveredTopping.recommendedPairing}</strong> · {hoveredTopping.flavorIntensity} flavor · {hoveredTopping.textureType}
                  </p>
                </div>
              </div>
            )}

            {/* Veg section */}
            <div>
              <h5 style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>
                Vegetarian Toppings
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-3)' }}>
                {VEG_TOPPINGS.map((t) => {
                  const qty = getToppingQty(t.id);
                  return (
                    <div
                      key={t.id}
                      onMouseEnter={() => setHoveredTopping(t)}
                      onMouseLeave={() => setHoveredTopping(null)}
                      style={{
                        padding: 'var(--space-3)',
                        borderRadius: 'var(--radius-lg)',
                        border: qty > 0 ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                        background: qty > 0 ? 'rgba(230, 57, 70, 0.1)' : 'rgba(255,255,255,0.02)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all var(--ease-selection)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.color }} />
                          <span style={{ fontWeight: 600, fontSize: 'var(--text-xs)' }}>{t.name}</span>
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>+{formatPrice(t.price)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {qty > 0 ? (
                          <>
                            <button
                              onClick={() => setToppingQuantity(t.id, qty - 1)}
                              style={{ width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                            >
                              <Minus size={12} />
                            </button>
                            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, minWidth: '14px', textAlign: 'center' }}>{qty}</span>
                            <button
                              onClick={() => addTopping(t.id)}
                              style={{ width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: 'var(--color-primary)', color: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                            >
                              <Plus size={12} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => addTopping(t.id)}
                            style={{ padding: '4px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-primary)', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Non-Veg section */}
            <div>
              <h5 style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>
                Non-Vegetarian Toppings
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-3)' }}>
                {NON_VEG_TOPPINGS.map((t) => {
                  const qty = getToppingQty(t.id);
                  return (
                    <div
                      key={t.id}
                      onMouseEnter={() => setHoveredTopping(t)}
                      onMouseLeave={() => setHoveredTopping(null)}
                      style={{
                        padding: 'var(--space-3)',
                        borderRadius: 'var(--radius-lg)',
                        border: qty > 0 ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                        background: qty > 0 ? 'rgba(230, 57, 70, 0.1)' : 'rgba(255,255,255,0.02)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all var(--ease-selection)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.color }} />
                          <span style={{ fontWeight: 600, fontSize: 'var(--text-xs)' }}>{t.name}</span>
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>+{formatPrice(t.price)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {qty > 0 ? (
                          <>
                            <button
                              onClick={() => setToppingQuantity(t.id, qty - 1)}
                              style={{ width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                            >
                              <Minus size={12} />
                            </button>
                            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, minWidth: '14px', textAlign: 'center' }}>{qty}</span>
                            <button
                              onClick={() => addTopping(t.id)}
                              style={{ width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: 'var(--color-primary)', color: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                            >
                              <Plus size={12} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => addTopping(t.id)}
                            style={{ padding: '4px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-primary)', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SEASONINGS TAB */}
        {activeTab === 'seasonings' && (
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            {BUILDER_SEASONINGS.map((s) => {
              const isSelected = selectedSeasonings.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSeasoning(s.id)}
                  style={{
                    padding: 'var(--space-3) var(--space-5)',
                    borderRadius: 'var(--radius-full)',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)',
                    background: isSelected ? 'rgba(230, 57, 70, 0.12)' : 'rgba(255,255,255,0.02)',
                    color: isSelected ? 'var(--color-primary)' : 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    transition: 'all var(--ease-selection)',
                  }}
                >
                  {isSelected && <Check size={16} />}
                  <span>{s.name}</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>+{formatPrice(s.price)}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

