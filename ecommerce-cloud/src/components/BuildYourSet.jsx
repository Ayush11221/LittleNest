import { useState } from 'react';
import { Check } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency.js';
import Highlight from './Highlight.jsx';

/**
 * Lets a shopper shortlist several products and see a running total.
 * Unlike the reference theme's bundle builder, this makes no discount
 * claim — there's no bundle-pricing system behind it, just a picker.
 * Adding to the bag still happens on each product page, since every
 * item needs its own size/color chosen first.
 */
function BuildYourSet({ products }) {
  const [selected, setSelected] = useState([]);

  if (!products || products.length === 0) return null;

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectedProducts = products.filter((p) => selected.includes(p.id));
  const total = selectedProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <section className="bg-muted/30 border-t border-border">
      <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 py-16 md:py-20">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground">
            Build Your <Highlight>Set</Highlight>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Pick a few favourites — we'll keep the total for you.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {products.map((product) => {
            const isSelected = selected.includes(product.id);
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => toggle(product.id)}
                className={`group relative text-left rounded-2xl overflow-hidden border-2 transition-colors ${
                  isSelected ? 'border-foreground' : 'border-transparent'
                }`}
              >
                <div className="aspect-[4/5] bg-muted overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <span
                  className={`absolute top-3 right-3 h-6 w-6 rounded-full flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-background/80 border-border text-transparent'
                  }`}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <div className="p-3">
                  <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(product.price)}</p>
                </div>
              </button>
            );
          })}
        </div>

        {selected.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border p-5">
            <p className="text-sm text-foreground">
              {selected.length} {selected.length === 1 ? 'item' : 'items'} selected ·{' '}
              <span className="font-semibold">{formatCurrency(total)}</span>
            </p>
            <p className="text-xs text-muted-foreground sm:ml-auto">
              Open each product to choose size and add it to your bag.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default BuildYourSet;
