import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import Drawer from './ui/drawer.jsx';
import { Button } from './ui/button.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';
import { calculateSubtotal } from '../utils/calculations.js';
import { useCartLines } from '../context/useCartLines.js';

function LineSkeleton() {
  return (
    <div className="flex gap-3 animate-pulse">
      <div className="w-16 shrink-0 aspect-[4/5] rounded-md bg-muted" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3.5 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/3" />
      </div>
    </div>
  );
}

function CartDrawer({ open, onClose }) {
  const { lines, loading, error, retry, updateQuantity, removeFromCart } = useCartLines();
  const subtotal = calculateSubtotal(lines);
  const navigate = useNavigate();

  const goToCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Your Bag"
      footer={
        !loading && !error && lines.length > 0 ? (
          <>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Shipping and tax calculated at checkout.
            </p>
            <Button size="lg" className="w-full" onClick={goToCheckout}>
              Checkout
            </Button>
            <Link
              to="/cart"
              onClick={onClose}
              className="mt-3 block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View full bag
            </Link>
          </>
        ) : null
      }
    >
      {loading ? (
        <div className="space-y-5">
          <LineSkeleton />
          <LineSkeleton />
        </div>
      ) : error ? (
        <div className="py-10 text-center">
          <p className="text-sm text-foreground font-medium">Something went wrong</p>
          <p className="mt-1 text-xs text-muted-foreground">Please try again.</p>
          <Button size="sm" className="mt-4" onClick={retry}>
            Try Again
          </Button>
        </div>
      ) : lines.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-foreground font-medium">Your bag is waiting.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Looks like you haven't added anything yet.
          </p>
          <Button asChild variant="outline" className="mt-6" onClick={onClose}>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-5">
          {lines.map((line) => (
            <li key={line.variant_id} className="flex gap-3">
              <Link to={`/products/${line.slug}`} onClick={onClose} className="w-16 shrink-0">
                <div className="aspect-[4/5] rounded-md overflow-hidden bg-muted">
                  <img
                    src={line.image_url}
                    alt={line.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-3">
                  <Link
                    to={`/products/${line.slug}`}
                    onClick={onClose}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
                  >
                    {line.name}
                  </Link>
                  <p className="text-sm font-medium text-foreground whitespace-nowrap">
                    {formatCurrency(line.price * line.quantity)}
                  </p>
                </div>
                {(line.size || line.color) && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {[line.size, line.color].filter(Boolean).join(' · ')}
                  </p>
                )}

                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center border border-border rounded-full">
                    <button
                      type="button"
                      onClick={() => updateQuantity(line.variant_id, line.quantity - 1)}
                      disabled={line.quantity <= 1}
                      aria-label="Decrease quantity"
                      className="h-7 w-7 flex items-center justify-center text-foreground disabled:text-muted-foreground/50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-xs text-foreground">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(line.variant_id, line.quantity + 1)}
                      disabled={line.quantity >= line.stock}
                      aria-label="Increase quantity"
                      className="h-7 w-7 flex items-center justify-center text-foreground disabled:text-muted-foreground/50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(line.variant_id)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}

export default CartDrawer;
