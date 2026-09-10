import ProductCard from './ProductCard.jsx';

/** A titled row of product cards — used for related products and recently viewed. */
function ProductRow({ id, title, products }) {
  if (!products || products.length === 0) return null;

  return (
    <section id={id} className="border-t border-border">
      <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 py-14 md:py-16">
        <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-8">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductRow;
