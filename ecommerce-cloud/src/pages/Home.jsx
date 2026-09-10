import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, RotateCcw, ShieldCheck, Baby, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import ProductCard from '../components/ProductCard.jsx';
import CategoryCollage from '../components/CategoryCollage.jsx';
import Lookbook from '../components/Lookbook.jsx';
import Testimonials from '../components/Testimonials.jsx';
import Faq from '../components/Faq.jsx';
import Hero from '../components/Hero.jsx';
import ScrollingText from '../components/ScrollingText.jsx';
import FeaturedProduct from '../components/FeaturedProduct.jsx';
import ShopTheEdit from '../components/ShopTheEdit.jsx';
import BestSellers from '../components/BestSellers.jsx';
import BrandMoment from '../components/BrandMoment.jsx';
import ImageComparison from '../components/ImageComparison.jsx';
import BuildYourSet from '../components/BuildYourSet.jsx';
import Journal from '../components/Journal.jsx';
import Highlight from '../components/Highlight.jsx';
import {
  fetchNewArrivals,
  fetchFeaturedProduct,
  fetchCategories,
} from '../services/productService.js';

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
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    fetchNewArrivals(4).then((data) => {
      setNewArrivals(data);
      setLoadingProducts(false);
    });
    fetchFeaturedProduct().then(setFeaturedProduct);
    fetchCategories().then((data) => {
      setCategories(data);
      setLoadingCategories(false);
    });
  }, []);

  return (
    <div>
      {/* =====================================================
          HERO SECTION — full-bleed slideshow
          ===================================================== */}
      <Hero />

      {/* =====================================================
          BRAND STORY — rich text intro, right after the hero
          ===================================================== */}
      <section className="bg-background">
        <div className="max-w-3xl mx-auto px-5 lg:px-9 xl:px-12 py-16 md:py-24 text-center">
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
          BRAND MOMENT — full-bleed image + centered statement
          ===================================================== */}
      <BrandMoment />

      {/* =====================================================
          SHOP BY CATEGORY
          Editorial cards with imagery area
          ===================================================== */}
      <section className="bg-accent/30">
        <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 py-16 md:py-20">
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

          {loadingCategories ? (
            <div className="grid grid-cols-2 gap-4 md:gap-5 md:grid-cols-4 md:h-[560px]">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`animate-pulse rounded-2xl bg-muted ${
                    i === 0 ? 'col-span-2 md:row-span-2 aspect-[4/5] md:aspect-auto md:h-full' : 'aspect-square md:aspect-auto md:h-full'
                  }`}
                />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <Reveal>
              <CategoryCollage categories={categories} />
            </Reveal>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-12">
              Connect Supabase and add categories to see them here.
            </p>
          )}

          <div className="mt-8 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Shop all categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          NEW ARRIVALS — live Supabase data
          ===================================================== */}
      <section className="bg-background">
        <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 py-16 md:py-20">
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
          FEATURED PRODUCT — single-product spotlight
          ===================================================== */}
      <FeaturedProduct product={featuredProduct} />

      {/* =====================================================
          IMAGE COMPARISON — two large panels
          ===================================================== */}
      <ImageComparison />

      {/* =====================================================
          MATERIALS — short rich text block
          ===================================================== */}
      <section className="bg-accent/20 border-t border-border">
        <div className="max-w-3xl mx-auto px-5 lg:px-9 xl:px-12 py-16 md:py-20 text-center">
          <Reveal>
            <h2 className="font-heading text-2xl md:text-3xl text-foreground">
              Fabrics we'd choose for our <Highlight>own</Highlight>.
            </h2>
          </Reveal>
          <Reveal>
            <p className="mt-5 text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Mostly cotton, always breathable. We look for materials gentle
              enough for the most sensitive skin, and sturdy enough to
              survive every wash.
            </p>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          BUILD YOUR SET — shortlist picker
          ===================================================== */}
      <BuildYourSet products={newArrivals} />

      {/* =====================================================
          SCROLLING TEXT — full-bleed marquee
          ===================================================== */}
      <ScrollingText />

      {/* =====================================================
          SHOP THE EDIT — shoppable photo grid
          ===================================================== */}
      <ShopTheEdit products={newArrivals} />

      {/* =====================================================
          LOOKBOOK — shoppable lifestyle image
          ===================================================== */}
      {!loadingProducts && <Lookbook products={newArrivals} />}

      {/* =====================================================
          TRUST / QUALITY
          ===================================================== */}
      <section className="bg-muted/30 border-t border-border">
        <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 py-14 md:py-18">
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
          TESTIMONIALS
          ===================================================== */}
      <Testimonials />

      {/* =====================================================
          BEST SELLERS — tabbed product carousel
          ===================================================== */}
      <BestSellers />

      {/* =====================================================
          SCROLLING TEXT — second marquee, reversed
          ===================================================== */}
      <ScrollingText
        phrases={['Free Shipping', 'Easy Returns', 'Secure Checkout', 'Made With Love']}
        direction="right"
      />

      {/* =====================================================
          JOURNAL — editorial content teasers
          ===================================================== */}
      <Journal />

      {/* =====================================================
          FAQ
          ===================================================== */}
      <Faq />

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
