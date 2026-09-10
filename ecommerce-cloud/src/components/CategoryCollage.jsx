import { Link } from 'react-router-dom';

/**
 * Asymmetric image collage for featured categories — one large tile plus
 * four smaller ones, each with an overlaid caption. A curated subset
 * rather than the full category list; "Shop all" links out to the rest.
 */
function CategoryCollage({ categories }) {
  const [featured, ...rest] = categories;
  const small = rest.slice(0, 4);

  return (
    <div className="grid grid-cols-2 gap-4 md:gap-5 md:grid-cols-4 md:grid-rows-2 md:h-[560px]">
      {featured && (
        <Link
          to={`/shop?category=${featured.slug}`}
          className="group relative col-span-2 md:row-span-2 rounded-3xl overflow-hidden shadow-soft aspect-[4/5] md:aspect-auto md:h-full transition-transform duration-300 ease-out hover:-translate-y-1"
        >
          <img
            src={
              featured.image_url ||
              `https://placehold.co/800x1000/f5f0eb/4a4a4a?text=${encodeURIComponent(featured.name)}`
            }
            alt={featured.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
          <span className="absolute bottom-5 left-5 font-heading text-2xl md:text-3xl text-background">
            {featured.name}
          </span>
        </Link>
      )}

      {small.map((cat) => (
        <Link
          key={cat.slug}
          to={`/shop?category=${cat.slug}`}
          className="group relative rounded-2xl overflow-hidden shadow-soft aspect-square md:aspect-auto md:h-full transition-transform duration-300 ease-out hover:-translate-y-1"
        >
          <img
            src={
              cat.image_url ||
              `https://placehold.co/480x480/f5f0eb/4a4a4a?text=${encodeURIComponent(cat.name)}`
            }
            alt={cat.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
          <span className="absolute bottom-3 left-3 font-heading text-base md:text-lg text-background">
            {cat.name}
          </span>
        </Link>
      ))}
    </div>
  );
}

export default CategoryCollage;
