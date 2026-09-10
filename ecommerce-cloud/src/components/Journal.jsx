import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ENTRIES = [
  {
    image: 'https://placehold.co/700x500/eae1d3/eae1d3',
    title: 'Choosing the right size',
    excerpt: "Babies grow fast — here's how we think about sizing so you're not guessing.",
    href: '/help',
  },
  {
    image: 'https://placehold.co/700x500/e2d7c6/e2d7c6',
    title: 'Caring for delicate fabrics',
    excerpt: 'A closer look at the materials we choose and how to keep them soft, wash after wash.',
    href: '/about#materials',
  },
  {
    image: 'https://placehold.co/700x500/ded1bd/ded1bd',
    title: 'Building a newborn wardrobe',
    excerpt: 'The handful of essentials worth having ready before your little one arrives.',
    href: '/shop?category=newborn-essentials',
  },
];

/** Editorial content teasers — brand content, not a full blog/article system. */
function Journal() {
  return (
    <section className="bg-background border-t border-border">
      <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 py-16 md:py-20">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground">From the Journal</h2>
          <p className="mt-3 text-muted-foreground">Little notes on little clothes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ENTRIES.map((entry) => (
            <Link key={entry.title} to={entry.href} className="group block">
              <div className="aspect-[7/5] rounded-2xl overflow-hidden bg-muted">
                <img
                  src={entry.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 font-heading text-lg text-foreground group-hover:text-foreground/70 transition-colors">
                {entry.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                {entry.excerpt}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Read more
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Journal;
