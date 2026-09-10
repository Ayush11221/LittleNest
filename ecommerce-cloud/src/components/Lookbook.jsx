import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { formatCurrency } from '../utils/formatCurrency.js';
import Highlight from './Highlight.jsx';

const HOTSPOT_POSITIONS = [
  { top: '32%', left: '24%' },
  { top: '68%', left: '46%' },
  { top: '40%', left: '76%' },
];

/**
 * A lifestyle image with a few hotspot points that reveal the featured
 * product on click — lets a single photo do double duty as both
 * editorial content and a shoppable moment.
 */
function Lookbook({ products }) {
  const [active, setActive] = useState(null);

  const hotspots = HOTSPOT_POSITIONS.map((pos, i) => ({ ...pos, product: products[i] })).filter(
    (h) => h.product
  );

  if (hotspots.length === 0) return null;

  return (
    <section className="bg-background border-t border-border">
      <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 py-16 md:py-20">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground">
            Shop the <Highlight>look</Highlight>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Tap the dots to see what they're wearing.
          </p>
        </div>

        <div className="relative rounded-3xl shadow-soft aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9]">
          {/* Clipped separately from the hotspots/popover below, so a popover
              near the edge isn't cut off by the image's rounded corners. */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1522771930-78848d9293e8?w=1600&h=700&fit=crop&auto=format&q=80"
              alt="A little one dressed in LittleNest essentials"
              className="h-full w-full object-cover"
            />
          </div>

          {hotspots.map((h, i) => (
            <button
              key={i}
              type="button"
              style={{ top: h.top, left: h.left }}
              onClick={() => setActive(active === i ? null : i)}
              aria-label={
                active === i ? `Close ${h.product.name}` : `View ${h.product.name}`
              }
              aria-expanded={active === i}
              className="absolute -translate-x-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/90 backdrop-blur-sm shadow-soft ring-4 ring-background/30 flex items-center justify-center text-foreground hover:scale-110 transition-transform"
            >
              {active === i ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          ))}

          <AnimatePresence>
            {active !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                style={{ top: hotspots[active].top, left: hotspots[active].left }}
                className="absolute z-10 w-44 -translate-x-1/2 translate-y-4 rounded-2xl bg-background shadow-soft p-3"
              >
                <Link
                  to={`/products/${hotspots[active].product.slug}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={hotspots[active].product.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground leading-snug truncate group-hover:text-primary transition-colors">
                      {hotspots[active].product.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatCurrency(hotspots[active].product.price)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default Lookbook;
