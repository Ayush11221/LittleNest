import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from './ui/button.jsx';
import Highlight from './Highlight.jsx';

const SLIDES = [
  {
    image: 'https://placehold.co/1920x900/e8ddd0/e8ddd0',
    heading: (
      <>
        Little clothes.
        <br />
        Big <Highlight>moments</Highlight>.
      </>
    ),
    text: "Thoughtfully made essentials for your little one's everyday adventures.",
    cta: 'Shop New Arrivals',
    href: '/shop',
  },
  {
    image: 'https://placehold.co/1920x900/ded2c2/ded2c2',
    heading: 'Newborn essentials, from day one.',
    text: "Soft, gentle fabrics for your baby's first weeks.",
    cta: 'Shop Newborn',
    href: '/shop?category=newborn-essentials',
  },
  {
    image: 'https://placehold.co/1920x900/e3d7c8/e3d7c8',
    heading: 'Sleepwear that feels like a hug.',
    text: 'Cosy, breathable, and built for real bedtimes.',
    cta: 'Shop Sleepwear',
    href: '/shop?category=sleepwear',
  },
];

/** Full-bleed slideshow hero with autoplay, manual arrows, and dot navigation. */
function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  const go = (delta) => {
    setIndex((i) => (i + delta + SLIDES.length) % SLIDES.length);
  };

  const slide = SLIDES[index];

  return (
    <section className="relative h-[560px] md:h-[650px] lg:h-[750px] overflow-hidden bg-muted">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12">
        <div className="absolute bottom-10 md:bottom-14 inset-x-5 lg:inset-x-9 xl:inset-x-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-xl">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-white leading-tight">
              {slide.heading}
            </h1>
            <p className="mt-4 text-white/80 text-base md:text-lg max-w-md leading-relaxed">
              {slide.text}
            </p>
          </div>
          <Button asChild size="lg" className="bg-white text-neutral-900 hover:bg-white/90 shrink-0 px-6 py-3 text-base">
            <Link to={slide.href}>{slide.cta}</Link>
          </Button>
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-4 md:left-6 bottom-4 md:bottom-6 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors flex items-center justify-center"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-4 md:right-6 bottom-4 md:bottom-6 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors flex items-center justify-center"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;
