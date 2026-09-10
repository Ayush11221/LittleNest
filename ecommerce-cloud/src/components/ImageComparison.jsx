import { Link } from 'react-router-dom';

const PANELS = [
  {
    image: 'https://images.unsplash.com/photo-1503284116362-30c49f508156?w=950&h=900&fit=crop&auto=format&q=80',
    heading: 'Everyday Wear',
    subheading: 'Play-ready essentials',
    href: '/shop?category=onesies-rompers',
  },
  {
    image: 'https://images.unsplash.com/photo-1538569582413-c34b58b1ab3f?w=950&h=900&fit=crop&auto=format&q=80',
    heading: 'Nap Time',
    subheading: 'Soft, breathable sleepwear',
    href: '/shop?category=sleepwear',
  },
];

/** Two large image panels side by side — a simple visual comparison, not a slider. */
function ImageComparison() {
  return (
    <section className="bg-background">
      <div className="text-center pt-16 md:pt-20 px-5">
        <h2 className="font-heading text-3xl md:text-4xl text-foreground">Made for every moment</h2>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2">
        {PANELS.map((panel) => (
          <Link
            key={panel.heading}
            to={panel.href}
            className="group relative h-[360px] md:h-[480px] overflow-hidden"
          >
            <img
              src={panel.image}
              alt={panel.heading}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-white/80 text-xs uppercase tracking-wide">{panel.subheading}</p>
              <h3 className="mt-1 font-heading text-2xl md:text-3xl text-white">{panel.heading}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default ImageComparison;
