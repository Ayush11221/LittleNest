import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';
import { calculateSubtotal } from '../utils/calculations.js';
import { useCartLines } from '../context/useCartLines.js';

function CartSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="w-20 sm:w-24 shrink-0 aspect-[4/5] rounded-md bg-muted" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-3 bg-muted rounded w-1/4" />
            <div className="h-4 bg-muted rounded w-1/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Cart() {
  const { lines, loading, error, removedNotice, retry, updateQuantity, removeFromCart, clearCart } =
    useCartLines();
  const navigate = useNavigate();

  const subtotal = calculateSubtotal(lines);

  return (
    <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 py-12 md:py-16">
      <h1 className="font-heading text-3xl md:text-4xl text-foreground">Your Bag</h1>

      {removedNotice && (
        <p className="mt-4 border border-border rounded-md px-4 py-3 text-sm text-muted-foreground">
          Some unavailable items were removed from your bag.
        </p>
      )}

      {loading ? (
        <div className="mt-10">
          <CartSkeleton />
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <p className="text-foreground font-medium">Something went wrong</p>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn't load your bag right now. Please try again.
          </p>
          <Button className="mt-6" onClick={retry}>
            Try Again
          </Button>
        </div>
      ) : lines.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-foreground font-medium">Your bag is waiting.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Looks like you haven't added anything yet.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Line items */}
          <div className="lg:col-span-2">
            <ul className="border-t border-border">
              {lines.map((line) => (
                <li key={line.variant_id} className="flex gap-4 py-6 border-b border-border">
                  <Link to={`/products/${line.slug}`} className="w-20 sm:w-24 shrink-0">
                    <div className="aspect-[4/5] rounded-md overflow-hidden bg-muted border border-border">
                      <img
                        src={line.image_url}
                        alt={line.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4">
                      <div className="min-w-0">
                        <Link
                          to={`/products/${line.slug}`}
                          className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {line.name}
                        </Link>
                        {(line.size || line.color) && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {[line.size, line.color].filter(Boolean).join(' · ')}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-muted-foreground">
                          {formatCurrency(line.price)}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-foreground whitespace-nowrap">
                        {formatCurrency(line.price * line.quantity)}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-4">
                      <div className="inline-flex items-center border border-border rounded-full">
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.variant_id, line.quantity - 1)}
                          disabled={line.quantity <= 1}
                          aria-label="Decrease quantity"
                          className="h-8 w-8 flex items-center justify-center text-foreground disabled:text-muted-foreground/50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm text-foreground">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.variant_id, line.quantity + 1)}
                          disabled={line.quantity >= line.stock}
                          aria-label="Increase quantity"
                          className="h-8 w-8 flex items-center justify-center text-foreground disabled:text-muted-foreground/50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
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

            <div className="mt-6 flex items-center justify-between">
              <Link
                to="/shop"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Continue shopping
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear bag
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="border border-border rounded-2xl p-6">
              <h2 className="font-heading text-xl text-foreground">Summary</h2>

              <div className="mt-4 flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Shipping and tax calculated at checkout.
              </p>

              <Button size="lg" className="w-full mt-6" onClick={() => navigate('/checkout')}>
                Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
