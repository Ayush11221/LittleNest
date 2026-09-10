import { Link } from 'react-router-dom';
import { Truck, RotateCcw, MessageCircle, ArrowRight } from 'lucide-react';

const LINKS = [
  {
    icon: Truck,
    title: 'Shipping',
    text: 'Processing times, delivery estimates, and shipping charges.',
    to: '/shipping',
  },
  {
    icon: RotateCcw,
    title: 'Returns & Refunds',
    text: 'Our 15-day return window, and how refunds and exchanges work.',
    to: '/returns',
  },
  {
    icon: MessageCircle,
    title: 'Contact Us',
    text: "Can't find what you're looking for? Send us a message.",
    to: '/contact',
  },
];

function Help() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="font-heading text-3xl md:text-4xl text-foreground">Help &amp; Support</h1>
      <p className="mt-3 text-muted-foreground">
        A few common questions, answered simply.
      </p>

      <div className="mt-10 space-y-4">
        {LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="group flex items-start gap-4 border border-border rounded-2xl p-5 hover:bg-muted/50 transition-colors"
          >
            <link.icon className="h-5 w-5 mt-0.5 text-primary shrink-0" strokeWidth={1.5} />
            <div className="flex-1 min-w-0">
              <h2 className="font-heading text-lg text-foreground">{link.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{link.text}</p>
            </div>
            <ArrowRight className="h-4 w-4 mt-1 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Help;
