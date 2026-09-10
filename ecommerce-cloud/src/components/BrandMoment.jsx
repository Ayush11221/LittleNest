import { Link } from 'react-router-dom';
import { Button } from './ui/button.jsx';
import Highlight from './Highlight.jsx';

/** Full-bleed image with centered text overlay — a brand statement, not a sales pitch. */
function BrandMoment() {
  return (
    <section className="relative h-[420px] md:h-[520px] overflow-hidden">
      <img
        src="https://placehold.co/1900x800/dcd0c4/dcd0c4"
        alt=""
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 flex items-center justify-center text-center px-5">
        <div className="max-w-xl">
          <h2 className="font-heading text-3xl md:text-5xl text-white leading-tight">
            Comfort. <Highlight>Sculpted</Highlight>.
          </h2>
          <p className="mt-4 text-white/80 text-base md:text-lg">
            Every seam, every stitch — considered for the way little ones actually move.
          </p>
          <Button asChild size="lg" className="mt-8 bg-white text-neutral-900 hover:bg-white/90">
            <Link to="/shop">Shop the Collection</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default BrandMoment;
