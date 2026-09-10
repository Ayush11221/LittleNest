import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Drawer from '../components/ui/drawer.jsx';
import {
  fetchProducts,
  fetchCategories,
  fetchAgeGroups,
} from '../services/productService.js';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
];

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] rounded-md bg-muted" />
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-4 bg-muted rounded w-1/3" />
      </div>
    </div>
  );
}

/** Plain option list used inside the filter drawer. */
function FilterGroup({ title, options, activeValue, onSelect, getLabel = (o) => o, getValue = (o) => o }) {
  if (!options.length) return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-foreground mb-3">{title}</h3>
      <ul className="space-y-2">
        <li>
          <button
            type="button"
            onClick={() => onSelect(null)}
            className={`text-sm transition-colors ${
              activeValue == null
                ? 'text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All
          </button>
        </li>
        {options.map((option) => {
          const value = getValue(option);
          const isActive = activeValue === value;
          return (
            <li key={value}>
              <button
                type="button"
                onClick={() => onSelect(value)}
                className={`text-sm transition-colors ${
                  isActive
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {getLabel(option)}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get('q') || '';
  const categorySlug = searchParams.get('category') || null;
  const ageGroup = searchParams.get('age') || null;
  const sort = searchParams.get('sort') || 'newest';
  const inStockOnly = searchParams.get('instock') === '1';
  const minPrice = searchParams.get('min') || '';
  const maxPrice = searchParams.get('max') || '';

  const [searchInput, setSearchInput] = useState(urlSearch);
  const debounceRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [ageGroups, setAgeGroups] = useState([]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryToken, setRetryToken] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  /* Keep the search input in sync if the URL changes externally (back/forward). */
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  /* Load filter option lists once. */
  useEffect(() => {
    fetchCategories().then((data) => {
      setCategories(data);
      setCategoriesLoaded(true);
    });
    fetchAgeGroups().then(setAgeGroups);
  }, []);

  /* Debounce free-text search into the URL. */
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const trimmed = searchInput.trim();
      if (trimmed === urlSearch) return;

      const next = new URLSearchParams(searchParams);
      if (trimmed) {
        next.set('q', trimmed);
      } else {
        next.delete('q');
      }
      setSearchParams(next, { replace: true });
    }, 300);

    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  /* Fetch products whenever filters change. */
  useEffect(() => {
    // A category filter is present but the category list hasn't
    // loaded yet — wait rather than fetching with an unresolved
    // (and therefore ignored) category filter.
    if (categorySlug && !categoriesLoaded) return;

    let cancelled = false;
    setLoading(true);
    setError(false);

    const categoryId = categorySlug
      ? categories.find((c) => c.slug === categorySlug)?.id ?? null
      : null;

    fetchProducts({
      search: urlSearch,
      categoryId,
      ageGroup,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      sort,
    }).then(
      ({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) {
          setError(true);
          setProducts([]);
        } else {
          setProducts(data);
        }
        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [urlSearch, categorySlug, ageGroup, minPrice, maxPrice, sort, categoriesLoaded, categories, retryToken]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters = Boolean(
    urlSearch || categorySlug || ageGroup || inStockOnly || minPrice || maxPrice
  );

  const visibleProducts = inStockOnly ? products.filter((p) => p.in_stock !== false) : products;

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  const filterDrawerContent = (
    <div className="space-y-8">
      <FilterGroup
        title="Age Group"
        options={ageGroups}
        activeValue={ageGroup}
        onSelect={(value) => updateParam('age', value)}
      />

      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Price</h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={minPrice}
            onChange={(e) => updateParam('min', e.target.value || null)}
            placeholder="Min"
            aria-label="Minimum price"
            className="w-full h-9 rounded-full border border-border bg-background text-sm text-foreground px-3 focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors"
          />
          <span className="text-muted-foreground text-sm">–</span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={maxPrice}
            onChange={(e) => updateParam('max', e.target.value || null)}
            placeholder="Max"
            aria-label="Maximum price"
            className="w-full h-9 rounded-full border border-border bg-background text-sm text-foreground px-3 focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">In stock only</h3>
        <button
          type="button"
          role="switch"
          aria-checked={inStockOnly}
          onClick={() => updateParam('instock', inStockOnly ? null : '1')}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            inStockOnly ? 'bg-primary' : 'bg-muted'
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow-soft transition-transform ${
              inStockOnly ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div>
      {/* Banner */}
      <section className="relative h-[220px] md:h-[300px] overflow-hidden bg-muted">
        <img
          src={activeCategory?.image_url || 'https://images.unsplash.com/photo-1763679324923-b856ca6a355d?w=1900&h=500&fit=crop&auto=format&q=80'}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 pb-6 md:pb-8 w-full">
            <nav className="text-xs uppercase tracking-wide text-white/70">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">{activeCategory ? activeCategory.name : 'Shop All'}</span>
            </nav>
            <h1 className="mt-2 font-heading text-3xl md:text-5xl text-white">
              {activeCategory ? activeCategory.name : 'Shop All'}
            </h1>
          </div>
        </div>
      </section>

      <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 py-10 md:py-12">
        {/* Category chips + controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <button
              type="button"
              onClick={() => updateParam('category', null)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                categorySlug === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => updateParam('category', cat.slug)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categorySlug === cat.slug
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex gap-3 shrink-0">
            <Button type="button" variant="outline" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal className="h-4 w-4" data-icon="inline-start" />
              Filters
            </Button>

            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value === 'newest' ? null : e.target.value)}
              aria-label="Sort products"
              className="h-9 rounded-full border border-border bg-background text-sm text-foreground px-4 focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="w-full h-10 pl-9 pr-9 rounded-full border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Results */}
        {!loading && !error && (
          <p className="text-sm text-muted-foreground mb-6">
            {visibleProducts.length} {visibleProducts.length === 1 ? 'product' : 'products'}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-foreground font-medium">Something went wrong.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              We couldn't load the products right now. Please try again.
            </p>
            <Button className="mt-6" onClick={() => setRetryToken((t) => t + 1)}>
              Try Again
            </Button>
          </div>
        ) : visibleProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-foreground font-medium">No little finds here.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try changing your filters or search.
            </p>
            {hasActiveFilters && (
              <Button variant="outline" className="mt-6" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        footer={
          <Button size="lg" className="w-full" onClick={() => setFiltersOpen(false)}>
            View results ({visibleProducts.length})
          </Button>
        }
      >
        {filterDrawerContent}
      </Drawer>
    </div>
  );
}

export default Shop;
