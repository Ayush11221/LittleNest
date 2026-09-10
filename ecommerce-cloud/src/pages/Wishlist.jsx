import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { fetchProductsByIds } from '../services/productService.js';

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] rounded-md bg-muted" />
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-4 bg-muted rounded w-1/3" />
      </div>
    </div>
  );
}

function Wishlist() {
  const { productIds } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchProductsByIds(productIds).then((data) => {
      if (cancelled) return;
      const byId = new Map(data.map((p) => [p.id, p]));
      setProducts(productIds.map((id) => byId.get(id)).filter(Boolean));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [productIds]);

  return (
    <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 py-12 md:py-16">
      <h1 className="font-heading text-3xl md:text-4xl text-foreground">Your Wishlist</h1>
      <p className="mt-2 text-muted-foreground">Things you've hearted, all in one place.</p>

      {loading ? (
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-foreground font-medium">Nothing here yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Tap the heart on anything you love to save it here.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export default Wishlist;
