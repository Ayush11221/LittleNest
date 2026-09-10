import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Button } from './ui/button.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';
import Highlight from './Highlight.jsx';

/** Single-product spotlight — a big showcase for one merchant-picked item. */
function FeaturedProduct({ product }) {
  if (!product) return null;

  const hasDiscount =
    product.compare_at_price != null && product.compare_at_price > product.price;

  return (
    <section className="bg-accent/20 border-t border-border">
      <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Link
            to={`/products/${product.slug}`}
            className="block aspect-[4/5] rounded-3xl overflow-hidden shadow-soft bg-muted"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </Link>

          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
              Featured
            </p>
            <h2 className="mt-2 font-heading text-3xl md:text-4xl text-foreground">
              <Highlight>{product.name}</Highlight>
            </h2>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-xl font-semibold text-foreground">
                {formatCurrency(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.compare_at_price)}
                </span>
              )}
              {product.rating > 0 && (
                <span className="flex items-center gap-1 pl-1.5 pr-2 py-0.5 rounded-full bg-background text-xs font-medium text-foreground">
                  <Star className="h-3 w-3 text-highlight" fill="currentColor" strokeWidth={0} />
                  {product.rating}
                </span>
              )}
            </div>

            {product.description && (
              <p className="mt-5 text-muted-foreground leading-relaxed max-w-md">
                {product.description}
              </p>
            )}

            <Button asChild size="lg" className="mt-8 px-6">
              <Link to={`/products/${product.slug}`}>Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProduct;
