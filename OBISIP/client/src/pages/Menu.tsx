import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { pizzaApi } from '../api/pizza.api';
import type { Pizza } from '../types';
import { PizzaCard } from '../components/pizza/PizzaCard';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { CATEGORY_LABELS } from '../utils/constants';

/**
 * Menu page — full pizza catalog with search, category filter, and sort.
 */
const Menu: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState('-rating');

  const LIMIT = 12;

  const fetchPizzas = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await pizzaApi.getAll({
        search: search || undefined,
        category: category === 'all' ? undefined : category,
        sort,
        page,
        limit: LIMIT,
      });
      setPizzas(data.data?.pizzas ?? []);
      setTotal(data.data?.pagination.total ?? 0);
    } catch {
      setPizzas([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => { fetchPizzas(); }, [fetchPizzas]);

  // Sync category from URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const clearSearch = () => { setSearch(''); setSearchInput(''); setPage(1); };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setPage(1);
    setSearchParams(cat !== 'all' ? { category: cat } : {});
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <main>
      {/* Page Header */}
      <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', padding: 'var(--space-10) 0 var(--space-6)' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 900, marginBottom: 'var(--space-2)' }}>
            Our <span style={{ background: 'var(--gradient-warm)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Menu</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {total} delicious options crafted with love
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)', maxWidth: '520px' }}>
            <div style={{ flex: 1 }}>
              <Input
                placeholder="Search pizzas…"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                leftIcon={<Search size={16} />}
                rightIcon={searchInput && (
                  <button type="button" onClick={clearSearch} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}>
                    <X size={16} color="var(--text-muted)" />
                  </button>
                )}
              />
            </div>
            <Button variant="primary" type="submit" leftIcon={<Search size={16} />}>Search</Button>
          </form>
        </div>
      </div>

      <div className="container section-sm">
        {/* Filters Row */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
          {/* Category Pills */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                style={{
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${category === key ? 'var(--color-primary)' : 'var(--border-default)'}`,
                  background: category === key ? 'rgba(230,57,70,0.15)' : 'var(--bg-elevated)',
                  color: category === key ? 'var(--color-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: category === key ? 600 : 400,
                  transition: 'all var(--transition-fast)',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <SlidersHorizontal size={16} color="var(--text-muted)" />
            <select
              value={sort}
              onChange={e => { setSort(e.target.value); setPage(1); }}
              className="input"
              style={{ width: 'auto', paddingTop: 'var(--space-2)', paddingBottom: 'var(--space-2)' }}
            >
              <option value="-rating">Top Rated</option>
              <option value="basePrice">Price: Low to High</option>
              <option value="-basePrice">Price: High to Low</option>
              <option value="-createdAt">Newest</option>
            </select>
          </div>
        </div>

        {/* Active search indicator */}
        {search && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', padding: 'var(--space-2) var(--space-4)', background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.2)', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
            <Search size={14} color="var(--color-primary)" />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)' }}>
              Results for "{search}"
            </span>
            <button onClick={clearSearch} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
              <X size={14} color="var(--color-primary)" />
            </button>
          </div>
        )}

        {/* Pizza Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)' }}>
            <Spinner size="lg" />
          </div>
        ) : pizzas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🍕</div>
            <h3>No pizzas found</h3>
            <p>Try a different search or category</p>
            <Button variant="secondary" size="sm" onClick={clearSearch} style={{ marginTop: 'var(--space-4)' }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="pizza-grid">
              {pizzas.map(pizza => <PizzaCard key={pizza._id} pizza={pizza} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-10)' }}>
                <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</Button>
                <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Page {page} of {totalPages}</span>
                <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Menu;
