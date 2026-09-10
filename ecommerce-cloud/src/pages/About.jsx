import { useEffect } from 'react';
import { Heart, RotateCcw, ShieldCheck, Baby } from 'lucide-react';

const trustPoints = [
  {
    icon: Heart,
    title: 'Soft Fabrics',
    text: 'We choose fabrics the way we would for our own children — natural, breathable, and gentle on delicate skin.',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    text: 'Simple and transparent returns within 15 days of delivery.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Checkout',
    text: 'Your information stays protected at every step.',
  },
  {
    icon: Baby,
    title: 'Made for Little Ones',
    text: 'Comfort-first designs for everyday adventures, from the first sleepy morning to the messiest afternoon.',
  },
];

/* Scrolls to an in-page section when the URL includes a hash, e.g. /about#materials. */
function useScrollToHash() {
  useEffect(() => {
    if (!window.location.hash) return;
    const el = document.getElementById(window.location.hash.slice(1));
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);
}

function About() {
  useScrollToHash();

  return (
    <div>
      <section className="bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h1 className="font-heading text-3xl md:text-4xl text-foreground">
            Made for the little things.
          </h1>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
            From the first sleepy morning to the messiest afternoon adventure,
            we believe baby clothes should feel as good as they look. Soft
            fabrics. Thoughtful details. Everyday comfort.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl mx-auto">
            LittleNest started as a simple idea — that the clothes parents
            reach for every day should be as considered as the moments their
            little ones grow through in them. No fuss, no excess. Just soft,
            well-made pieces built for real days.
          </p>
        </div>
      </section>

      <section id="materials" className="bg-accent/20 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h2 className="font-heading text-2xl md:text-3xl text-foreground text-center">
            Materials
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed text-center max-w-xl mx-auto">
            We look for fabrics that feel gentle against delicate skin and
            hold up to everyday wear and washing — natural, breathable
            materials over anything synthetic or scratchy. Each product page
            lists the exact material and care instructions for that piece, so
            you always know what you're bringing home.
          </p>
        </div>
      </section>

      <section className="bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-18">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustPoints.map((point) => (
              <div key={point.title} className="text-center">
                <point.icon className="h-6 w-6 text-primary mx-auto mb-3" strokeWidth={1.5} />
                <h3 className="text-sm font-semibold text-foreground mb-1 tracking-wide">
                  {point.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {point.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
