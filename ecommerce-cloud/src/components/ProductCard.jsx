import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency.js';
import { useWishlist } from '../context/WishlistContext.jsx';

/**
 * Reusable product card with image hover scale, wishlist heart,
 * and compare-at-price strike-through.
 */
function ProductCard({ product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const hasDiscount =
    product.compare_at_price != null &&
    product.compare_at_price > product.price;

  const inStock = product.in_stock !== false;

  return (
    <div className="group relative">
      {/* Image */}
      <Link
        to={`/products/${product.slug}`}
        className="block aspect-[4/5] rounded-md overflow-hidden bg-muted"
      >
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            inStock ? '' : 'opacity-60'
          }`}
        />
      </Link>

      {/* Wishlist button */}
      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-3 right-3 p-2 rounded-full bg-background shadow-soft text-muted-foreground hover:text-foreground transition-colors"
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          className="h-4 w-4"
          fill={wishlisted ? 'currentColor' : 'none'}
          strokeWidth={1.5}
        />
      </button>

      {/* Rating badge */}
      {product.rating > 0 && (
        <span className="absolute top-3 left-3 flex items-center gap-1 pl-1.5 pr-2 py-0.5 rounded-full bg-background shadow-soft text-xs font-medium text-foreground">
          <Star className="h-3 w-3 text-highlight" fill="currentColor" strokeWidth={0} />
          {product.rating}
        </span>
      )}

      {/* Sold out / discount badge */}
      {!inStock ? (
        <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-background/95 shadow-soft text-foreground">
          Sold Out
        </span>
      ) : (
        hasDiscount && (
          <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
            Sale
          </span>
        )
      )}

      {/* Info */}
      <div className="mt-3 space-y-1">
        <Link
          to={`/products/${product.slug}`}
          className="block text-sm font-medium text-foreground hover:text-foreground/70 transition-colors leading-snug"
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
