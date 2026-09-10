import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, RotateCcw, ShieldCheck, Baby, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { fetchNewArrivals } from '../services/productService.js';

/* Seed-data categories for "Shop by Category" */
const categories = [
  { name: 'Newborn Essentials', slug: 'newborn-essentials' },
  { name: 'Onesies & Rompers', slug: 'onesies-rompers' },
  { name: 'Tops & T-Shirts', slug: 'tops-tshirts' },
  { name: 'Bottoms', slug: 'bottoms' },
  { name: 'Dresses', slug: 'dresses' },
  { name: 'Co-ord Sets', slug: 'coord-sets' },
  { name: 'Sleepwear', slug: 'sleepwear' },
  { name: 'Winter Wear', slug: 'winter-wear' },
  { name: 'Accessories', slug: 'accessories' },
];

const trustPoints = [
  {
    icon: Heart,
    title: 'Soft Fabrics',
    text: 'Thoughtfully selected materials that feel gentle on delicate skin.',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    text: 'Simple and transparent returns within 15 days.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Checkout',
    text: 'Your information stays protected at every step.',
  },
  {
    icon: Baby,
    title: 'Made for Little Ones',
    text: 'Comfort-first designs for everyday adventures.',
  },
];

/* Subtle scroll-reveal wrapper */
function Reveal({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Home() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetchNewArrivals(4).then((data) => {
      setNewArrivals(data);
      setLoadingProducts(false);
    });
  }, []);

  return (
    <div>
      {/* =====================================================
          HERO SECTION
          Warm cream bg, editorial layout, strong typography
          ===================================================== */}
      <section className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight">
                Little clothes.
                <br />
                Big moments.
              </h1>
              <p className="mt-5 text-muted-foreground text-lg md:text-xl max-w-lg leading-relaxed">
                Thoughtfully made essentials for your little one's everyday
                adventures. Soft fabrics, simple designs, and everyday comfort.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="px-6 py-3 text-base">
                  <Link to="/shop">Shop New Arrivals</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-6 py-3 text-base">
                  <Link to="/shop?category=newborn-essentials">Newborn Essentials</Link>
                </Button>
              </div>
            </motion.div>

            {/* Hero Visual — editorial product collage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-3">
                {/* Large featured image */}
                <div className="col-span-1 row-span-2 aspect-[3/4] rounded-lg overflow-hidden bg-muted border border-border">
                  <img
                    src="https://placehold.co/600x800/f5f0eb/4a4a4a?text=Bunny+Romper"
                    alt="Cotton Bunny Romper — soft organic cotton"
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Two smaller images stacked */}
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted border border-border">
                  <img
                    src="https://placehold.co/600x450/f5f0eb/4a4a4a?text=Welcome+Set"
                    alt="Newborn Welcome Set — 5-piece essentials"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted border border-border">
                  <img
                    src="https://placehold.co/600x450/f5f0eb/4a4a4a?text=Sleepsuit"
                    alt="Cloud Print Sleepsuit — dreamy comfort"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              {/* Subtle decorative accent */}
              <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-lg bg-primary/8 -z-10" />
              <div className="absolute -top-3 -left-3 w-14 h-14 rounded-lg bg-secondary/60 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SHOP BY CATEGORY
          Editorial cards with imagery area
          ===================================================== */}
      <section className="bg-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="font-heading text-3xl md:text-4xl text-foreground">
                Shop by Category
              </h2>
              <p className="mt-3 text-muted-foreground">
                Find the perfect pieces for every stage.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
            {categories.map((cat) => (
              <Reveal key={cat.slug}>
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="group block rounded-lg border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  {/* Image area */}
                  <div className="aspect-[16/9] bg-muted overflow-hidden">
                    <img
                      src={`https://placehold.co/480x270/f5f0eb/4a4a4a?text=${encodeURIComponent(cat.name)}`}
                      alt={cat.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  {/* Name */}
                  <div className="px-4 py-3">
                    <span className="font-heading text-base text-foreground group-hover:text-primary transition-colors">
                      {cat.name}
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          NEW ARRIVALS — live Supabase data
          ===================================================== */}
      <section className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <Reveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl text-foreground">
                  New Arrivals
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Our latest little finds.
                </p>
              </div>
              <Link
                to="/shop"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          {loadingProducts ? (
            /* Skeleton loading */
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] rounded-lg bg-muted" />
                  <div className="mt-3 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.map((product) => (
                <Reveal key={product.id}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          ) : (
            /* Fallback when Supabase is not connected */
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">
                Connect Supabase and run the seed data to see products here.
              </p>
            </div>
          )}

          {/* Mobile "View all" link */}
          <div className="sm:hidden mt-6 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          BRAND STORY
          ===================================================== */}
      <section className="bg-accent/20 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <Reveal>
            <h2 className="font-heading text-3xl md:text-4xl text-foreground">
              Made for the little things.
            </h2>
          </Reveal>
          <Reveal>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
              From the first sleepy morning to the messiest afternoon
              adventure, we believe baby clothes should feel as good as they
              look. Soft fabrics. Thoughtful details. Everyday comfort.
            </p>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          TRUST / QUALITY
          ===================================================== */}
      <section className="bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-18">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustPoints.map((point) => (
              <Reveal key={point.title}>
                <div className="text-center">
                  <point.icon className="h-6 w-6 text-primary mx-auto mb-3" strokeWidth={1.5} />
                  <h3 className="text-sm font-semibold text-foreground mb-1 tracking-wide">
                    {point.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {point.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          NEWSLETTER
          ===================================================== */}
      <section className="bg-background border-t border-border">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-18 text-center">
          <Reveal>
            <h2 className="font-heading text-2xl md:text-3xl text-foreground">
              Stay in the loop
            </h2>
            <p className="mt-2 text-muted-foreground text-sm">
              New arrivals, soft favourites, and little updates — delivered to
              your inbox.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow"
              />
              <Button size="lg" className="px-5">
                Subscribe
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export default Home;
