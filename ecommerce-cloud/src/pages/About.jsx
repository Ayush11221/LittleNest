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
    text: 'Payments are handled by Razorpay — your card and bank details never touch our servers.',
  },
  {
    icon: Baby,
    title: 'Made for Little Ones',
    text: 'Comfort-first designs for everyday adventures, from the first sleepy morning to the messiest afternoon.',
  },
];

function About() {
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
        </div>
      </section>

      <section className="bg-accent/20 border-t border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 space-y-8">
          <div>
            <h2 className="font-heading text-2xl text-foreground mb-2">How we started</h2>
            <p className="text-muted-foreground leading-relaxed">
              LittleNest started as a simple idea — that the clothes parents
              reach for every day should be as considered as the moments
              their little ones grow through in them. No fuss, no excess.
              Just soft, well-made pieces built for real days: the 3 a.m.
              changes, the messy lunches, the naps that end up happening
              anywhere but the crib.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl text-foreground mb-2">What we believe</h2>
            <p className="text-muted-foreground leading-relaxed">
              A baby's skin is more sensitive than ours, so we start every
              design decision with the fabric, not the print. We'd rather
              sell fewer things we'd genuinely put on our own kids than fill
              a catalog with everything at once — that's why the range
              stays small and each piece lists exactly what it's made of.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl text-foreground mb-2">Where we're headed</h2>
            <p className="text-muted-foreground leading-relaxed">
              We're still small. As LittleNest grows, the plan is to expand
              sizes and categories at the same pace we can keep making sure
              of what's in the box — not faster.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 border-t border-border">
        <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 py-14 md:py-18">
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
