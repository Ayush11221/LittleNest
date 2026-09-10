import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency.js';

/**
 * Reusable product card with image hover scale, wishlist heart,
 * and compare-at-price strike-through.
 */
function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);

  const hasDiscount =
    product.compare_at_price != null &&
    product.compare_at_price > product.price;

  return (
    <div className="group relative">
      {/* Image */}
      <Link
        to={`/products/${product.slug}`}
        className="block aspect-[4/5] rounded-lg overflow-hidden bg-muted border border-border"
      >
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </Link>

      {/* Wishlist button */}
      <button
        onClick={() => setWishlisted(!wishlisted)}
        className="absolute top-3 right-3 p-2 rounded-full bg-background/70 backdrop-blur-sm text-muted-foreground hover:text-primary transition-colors"
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          className="h-4 w-4"
          fill={wishlisted ? 'currentColor' : 'none'}
          strokeWidth={1.5}
        />
      </button>

      {/* Discount badge */}
      {hasDiscount && (
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground">
          Sale
        </span>
      )}

      {/* Info */}
      <div className="mt-3 space-y-1">
        <Link
          to={`/products/${product.slug}`}
          className="block text-sm font-medium text-foreground hover:text-primary transition-colors leading-snug"
        >
          {product.name}
        </Link>

        {product.age_group && (
          <p className="text-xs text-muted-foreground">{product.age_group}</p>
        )}

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {formatCurrency(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {formatCurrency(product.compare_at_price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
