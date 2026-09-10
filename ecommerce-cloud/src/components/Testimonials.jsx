import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      "The romper fabric is genuinely as soft as it looks in photos — my daughter lives in hers. First store I've found where nothing feels scratchy.",
    author: 'Ananya R.',
    context: 'Parent of a 7-month-old',
  },
  {
    quote:
      "Sizing ran true and the sleepwear held up through more washes than I expected. Little details like flat seams actually make a difference at 3am.",
    author: 'Karan M.',
    context: 'Parent of twins',
  },
  {
    quote:
      "Ordered the newborn welcome set before my son arrived — it was the first thing that made the nursery feel ready. Still his favourite outfit.",
    author: 'Sneha P.',
    context: 'First-time parent',
  },
];

function Testimonials() {
  return (
    <section className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground">
            From LittleNest parents
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="rounded-2xl bg-card border border-border shadow-soft p-6 flex flex-col"
            >
              <Quote className="h-5 w-5 text-primary" strokeWidth={1.5} />
              <p className="mt-4 text-foreground leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-5 pt-4 border-t border-border">
                <p className="text-sm font-medium text-foreground">{t.author}</p>
                <p className="text-xs text-muted-foreground">{t.context}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
