import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import ProductCard from '../components/ProductCard.jsx';
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
      <div className="aspect-[4/5] rounded-lg bg-muted" />
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-4 bg-muted rounded w-1/3" />
      </div>
    </div>
  );
}

/** Vertical filter option list — plain text, not pills, per design direction. */
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

  const [searchInput, setSearchInput] = useState(urlSearch);
  const debounceRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [ageGroups, setAgeGroups] = useState([]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryToken, setRetryToken] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

    fetchProducts({ search: urlSearch, categoryId, ageGroup, sort }).then(
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
  }, [urlSearch, categorySlug, ageGroup, sort, categoriesLoaded, categories, retryToken]);

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

  const hasActiveFilters = Boolean(urlSearch || categorySlug || ageGroup);

  const filterPanel = (
    <div className="space-y-8">
      <FilterGroup
        title="Category"
        options={categories}
        activeValue={categorySlug}
        onSelect={(value) => updateParam('category', value)}
        getLabel={(c) => c.name}
        getValue={(c) => c.slug}
      />
      <FilterGroup
        title="Age Group"
        options={ageGroups}
        activeValue={ageGroup}
        onSelect={(value) => updateParam('age', value)}
      />
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
    <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 py-12 md:py-16">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="font-heading text-3xl md:text-4xl text-foreground">Shop All</h1>
        <p className="mt-2 text-muted-foreground">
          Thoughtfully made essentials for your little one.
        </p>
      </div>

      {/* Search + mobile controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="w-full h-10 pl-9 pr-9 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors"
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

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="sm:hidden flex-1"
            onClick={() => setMobileFiltersOpen((open) => !open)}
          >
            <SlidersHorizontal className="h-4 w-4" data-icon="inline-start" />
            Filters
          </Button>

          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value === 'newest' ? null : e.target.value)}
            aria-label="Sort products"
            className="h-10 rounded-lg border border-border bg-background text-sm text-foreground px-3 focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile filter panel */}
      {mobileFiltersOpen && (
        <div className="sm:hidden mb-8 p-4 rounded-lg border border-border bg-card">
          {filterPanel}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-10">
        {/* Desktop sidebar */}
        <aside className="hidden sm:block w-48 shrink-0">{filterPanel}</aside>

        {/* Results */}
        <div className="flex-1">
          {!loading && !error && (
            <p className="text-sm text-muted-foreground mb-6">
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </p>
          )}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map((product) => (
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
      </div>
    </div>
  );
}

export default Shop;
