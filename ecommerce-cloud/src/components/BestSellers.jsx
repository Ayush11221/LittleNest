import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard.jsx';
import { fetchCategories, fetchProducts } from '../services/productService.js';

function ProductCardSkeleton() {
  return (
    <div className="w-56 shrink-0 animate-pulse">
      <div className="aspect-[4/5] rounded-md bg-muted" />
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </div>
    </div>
  );
}

/** Tabbed, horizontally-scrollable product carousel — "Best Sellers" style. */
function BestSellers() {
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef(null);

  useEffect(() => {
    fetchCategories().then((data) => setCategories(data.slice(0, 4)));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchProducts({ categoryId: activeCategoryId, sort: 'newest' }).then(({ data }) => {
      if (cancelled) return;
      setProducts(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [activeCategoryId]);

  const scroll = (delta) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <section className="bg-background border-t border-border">
      <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 py-16 md:py-20">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-8">
            <h2 className="font-heading text-3xl md:text-4xl text-foreground">Best Sellers</h2>
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveCategoryId(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategoryId === null
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
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategoryId === cat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll(-320)}
              aria-label="Scroll left"
              className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll(320)}
              aria-label="Scroll right"
              className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div ref={scrollerRef} className="flex gap-5 overflow-x-auto scroll-smooth pb-2 -mx-1 px-1">
          {loading
            ? [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
            : products.length > 0
            ? products.map((product) => (
                <div key={product.id} className="w-56 shrink-0">
                  <ProductCard product={product} />
                </div>
              ))
            : (
                <p className="text-sm text-muted-foreground py-8">No products in this category yet.</p>
              )}
        </div>
      </div>
    </section>
  );
}

export default BestSellers;
