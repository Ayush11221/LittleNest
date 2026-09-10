import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { formatCurrency } from '../utils/formatCurrency.js';
import { searchProducts } from '../services/productService.js';

/** Top-anchored instant-search overlay — live name matches as you type. */
function SearchOverlay({ open, onClose }) {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    setTerm('');
    setResults([]);
    const id = setTimeout(() => inputRef.current?.focus(), 50);

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(id);
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = term.trim();
    if (!trimmed) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(() => {
      searchProducts(trimmed).then((data) => {
        setResults(data);
        setLoading(false);
      });
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [term]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = term.trim();
    if (!trimmed) return;
    onClose();
    navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            className="fixed top-0 left-0 right-0 z-[101] bg-background shadow-soft"
          >
            <div className="max-w-2xl mx-auto px-5 py-6">
              <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="flex-1 h-10 bg-transparent text-lg text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </form>

              {term.trim() && (
                <div className="mt-4 border-t border-border pt-4">
                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-3 animate-pulse">
                          <div className="h-12 w-12 rounded-md bg-muted shrink-0" />
                          <div className="flex-1 space-y-2 py-1">
                            <div className="h-3.5 bg-muted rounded w-1/2" />
                            <div className="h-3 bg-muted rounded w-1/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : results.length > 0 ? (
                    <ul className="space-y-1">
                      {results.map((product) => (
                        <li key={product.id}>
                          <Link
                            to={`/products/${product.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted transition-colors"
                          >
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-muted shrink-0">
                              <img
                                src={product.image_url}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatCurrency(product.price)}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                      <li className="pt-2">
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          View all results for "{term.trim()}"
                        </button>
                      </li>
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground py-2">
                      No little finds for "{term.trim()}".
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SearchOverlay;
