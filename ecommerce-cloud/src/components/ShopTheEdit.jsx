import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency.js';

/** Tight photo grid of real products — a shoppable "edit," not a social feed. */
function ShopTheEdit({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="bg-background">
      <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 py-16 md:py-20">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground">Shop the Edit</h2>
          <p className="mt-3 text-muted-foreground">A closer look at what's new.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-1.5">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.slug}`}
              className="group relative aspect-[3/4] overflow-hidden bg-muted"
            >
              <img
                src={product.image_url}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-sm font-medium text-white truncate">{product.name}</p>
                <p className="text-xs text-white/80">{formatCurrency(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ShopTheEdit;
