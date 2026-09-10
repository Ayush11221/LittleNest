import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Minus,
  Plus,
  Star,
  Shirt,
  Baby,
  Tag,
  Droplets,
  Truck,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';
import { fetchProductBySlug } from '../services/productService.js';
import { useCart } from '../context/CartContext.jsx';

/** Compact rating pill — e.g. "★ 4.5". Hidden when there's no rating yet. */
function RatingBadge({ rating }) {
  if (!rating) return null;
  return (
    <span
      className="flex items-center gap-1 pl-1.5 pr-2 py-0.5 rounded-full bg-muted text-xs font-medium text-foreground"
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      <Star className="h-3 w-3 text-highlight" fill="currentColor" strokeWidth={0} />
      {rating}
    </span>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
      <div className="animate-pulse">
        <div className="aspect-[4/5] rounded-lg bg-muted" />
      </div>
      <div className="animate-pulse space-y-4">
        <div className="h-3 bg-muted rounded w-1/4" />
        <div className="h-8 bg-muted rounded w-3/4" />
        <div className="h-5 bg-muted rounded w-1/4" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-2/3" />
      </div>
    </div>
  );
}

function ProductDetails() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [justAdded, setJustAdded] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryToken, setRetryToken] = useState(0);

  const [activeImage, setActiveImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    setProduct(null);

    fetchProductBySlug(slug).then(({ data, error: fetchError }) => {
      if (cancelled) return;
      if (fetchError) {
        setError(true);
      } else {
        setProduct(data);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [slug, retryToken]);

  /* Active variants, sizes, colors — derived from the real variant rows only. */
  const variants = useMemo(
    () => (product?.product_variants || []).filter((v) => v.is_active),
    [product]
  );

  const sizes = useMemo(() => {
    const seen = [];
    for (const v of variants) {
      if (!seen.includes(v.size)) seen.push(v.size);
    }
    return seen;
  }, [variants]);

  const colors = useMemo(() => {
    const seen = [];
    for (const v of variants) {
      if (v.color && !seen.includes(v.color)) seen.push(v.color);
    }
    return seen;
  }, [variants]);

  const hasColors = colors.length > 0;

  /* Gallery: primary image first, then any additional product_images. */
  const gallery = useMemo(() => {
    if (!product) return [];
    const images = [product.image_url, ...(product.product_images || [])
      .slice()
      .sort((a, b) => a.display_order - b.display_order)
      .map((img) => img.image_url)];
    return [...new Set(images.filter(Boolean))];
  }, [product]);

  /* Auto-select the only option when there's no real choice to make. */
  useEffect(() => {
    if (sizes.length === 1) setSelectedSize(sizes[0]);
    if (colors.length === 1) setSelectedColor(colors[0]);
    if (gallery.length > 0) setActiveImage(gallery[0]);
  }, [sizes, colors, gallery]);

  const isSizeInStock = (size) =>
    variants.some(
      (v) =>
        v.size === size &&
        (!hasColors || selectedColor == null || v.color === selectedColor) &&
        v.stock > 0
    );

  const isColorInStock = (color) =>
    variants.some(
      (v) =>
        v.color === color &&
        (selectedSize == null || v.size === selectedSize) &&
        v.stock > 0
    );

  const handleSelectSize = (size) => {
    if (!isSizeInStock(size)) return;
    setSelectedSize(size);
    if (hasColors && selectedColor && !isColorAvailableFor(size, selectedColor)) {
      setSelectedColor(null);
    }
    setQuantity(1);
    setJustAdded(false);
  };

  const handleSelectColor = (color) => {
    if (!isColorInStock(color)) return;
    setSelectedColor(color);
    if (selectedSize && !isColorAvailableFor(selectedSize, color)) {
      setSelectedSize(null);
    }
    setQuantity(1);
    setJustAdded(false);
  };

  function isColorAvailableFor(size, color) {
    return variants.some((v) => v.size === size && v.color === color && v.stock > 0);
  }

  const selectedVariant = useMemo(() => {
    if (!selectedSize) return null;
    if (hasColors && !selectedColor) return null;
    return (
      variants.find(
        (v) => v.size === selectedSize && (!hasColors || v.color === selectedColor)
      ) || null
    );
  }, [variants, selectedSize, selectedColor, hasColors]);

  const effectivePrice = selectedVariant?.price_override ?? product?.price ?? 0;
  const hasDiscount =
    product?.compare_at_price != null && product.compare_at_price > effectivePrice;

  const maxQuantity = selectedVariant ? selectedVariant.stock : 1;

  const decreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQuantity = () => setQuantity((q) => Math.min(maxQuantity, q + 1));

  const handleAddToBag = () => {
    if (!selectedVariant) return;
    addToCart(product.id, selectedVariant.id, quantity);
    setJustAdded(true);
  };

  /* Tells the shopper what's still needed before they can add to the bag. */
  const selectionHint = (() => {
    if (selectedVariant) return null;
    if (variants.length === 0) return 'This item is currently unavailable.';

    const missing = [];
    if (sizes.length > 0 && !selectedSize) missing.push('size');
    if (hasColors && !selectedColor) missing.push('color');
    if (missing.length === 0) return null;

    return `Select a ${missing.join(' and ')} to continue.`;
  })();

  if (loading) {
    return (
      <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 py-12 md:py-16">
        <DetailSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 py-24 text-center">
        <p className="text-foreground font-medium">Something went wrong</p>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't load this product right now. Please try again.
        </p>
        <Button className="mt-6" onClick={() => setRetryToken((t) => t + 1)}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 py-24 text-center">
        <p className="text-foreground font-medium">We couldn't find that one.</p>
        <Link
          to="/shop"
          className="mt-6 inline-flex text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const category = product.categories;

  const highlights = [
    product.material && { icon: Shirt, label: 'Material', value: product.material },
    product.age_group && { icon: Baby, label: 'Age Group', value: product.age_group },
    category?.name && { icon: Tag, label: 'Category', value: category.name },
    product.care_instructions && { icon: Droplets, label: 'Care', value: product.care_instructions },
  ].filter(Boolean);

  const anyInStock = variants.some((v) => v.stock > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-[1900px] mx-auto px-5 lg:px-9 xl:px-12 py-12 md:py-16"
    >
      {/* Breadcrumb */}
      <nav className="mb-8 text-xs uppercase tracking-wide text-muted-foreground">
        <Link to="/shop" className="hover:text-foreground transition-colors">
          Shop
        </Link>
        {category && (
          <>
            <span className="mx-2">/</span>
            <Link
              to={`/shop?category=${category.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {category.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Images — thumbnails beside the main image on desktop, below it on mobile */}
        <div className="flex flex-col-reverse lg:flex-row gap-3 lg:gap-4">
          {gallery.length > 1 && (
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
              {gallery.map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`h-16 w-16 lg:h-20 lg:w-20 shrink-0 rounded-md overflow-hidden border transition-colors ${
                    activeImage === img ? 'border-foreground' : 'border-border'
                  }`}
                  aria-label="View image"
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 aspect-[4/5] rounded-lg overflow-hidden bg-muted">
            <img
              src={activeImage || product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div>
          {category && (
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
              {category.name}
            </p>
          )}
          <h1 className="mt-1 font-heading text-3xl md:text-4xl text-foreground">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-xl font-semibold text-foreground">
              {formatCurrency(effectivePrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.compare_at_price)}
              </span>
            )}
            <span className="ml-auto">
              <RatingBadge rating={product.rating} />
            </span>
          </div>

          {product.description && (
            <p className="mt-6 text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}

          {highlights.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-border p-4">
              {highlights.map((h) => (
                <div key={h.label} className="flex items-center gap-2.5 min-w-0">
                  <h.icon className="h-5 w-5 text-muted-foreground shrink-0" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{h.value}</p>
                    <p className="text-xs text-muted-foreground">{h.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Size */}
          {sizes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-foreground mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const inStock = isSizeInStock(size);
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!inStock}
                      onClick={() => handleSelectSize(size)}
                      className={`h-9 min-w-9 px-3 rounded-md border text-sm transition-colors ${
                        isSelected
                          ? 'border-foreground text-foreground font-medium'
                          : inStock
                          ? 'border-border text-foreground hover:border-foreground'
                          : 'border-border text-muted-foreground/50 line-through cursor-not-allowed'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color */}
          {hasColors && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-foreground mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const inStock = isColorInStock(color);
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      disabled={!inStock}
                      onClick={() => handleSelectColor(color)}
                      className={`h-9 px-3 rounded-md border text-sm transition-colors ${
                        isSelected
                          ? 'border-foreground text-foreground font-medium'
                          : inStock
                          ? 'border-border text-foreground hover:border-foreground'
                          : 'border-border text-muted-foreground/50 line-through cursor-not-allowed'
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-foreground mb-3">Quantity</h3>
            <div className="inline-flex items-center border border-border rounded-full">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="h-9 w-9 flex items-center justify-center text-foreground disabled:text-muted-foreground/50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm text-foreground">{quantity}</span>
              <button
                type="button"
                onClick={increaseQuantity}
                disabled={quantity >= maxQuantity}
                aria-label="Increase quantity"
                className="h-9 w-9 flex items-center justify-center text-foreground disabled:text-muted-foreground/50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {selectedVariant && selectedVariant.stock <= 5 && (
              <div className="mt-3 max-w-56">
                <p className="text-xs text-muted-foreground">
                  Only {selectedVariant.stock} left in stock.
                </p>
                <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-highlight"
                    style={{ width: `${Math.min(100, (selectedVariant.stock / 10) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Add to Bag */}
          <div className="mt-8">
            <Button
              size="lg"
              className="w-full sm:w-auto sm:min-w-64 justify-between gap-6"
              disabled={!selectedVariant}
              onClick={handleAddToBag}
            >
              <span>Add to Bag</span>
              {selectedVariant && <span>{formatCurrency(effectivePrice * quantity)}</span>}
            </Button>

            {justAdded ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Added to bag.{' '}
                <Link
                  to="/cart"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  View bag
                </Link>
              </p>
            ) : (
              selectionHint && (
                <p className="mt-2 text-xs text-muted-foreground">{selectionHint}</p>
              )
            )}
          </div>

          {/* Trust rows */}
          <div className="mt-8 pt-6 border-t border-border space-y-3">
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Truck className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              {anyInStock
                ? 'In stock. Ships within 1–2 business days.'
                : 'Currently unavailable.'}
            </div>
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <RotateCcw className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              Easy returns within 15 days
            </div>
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              Secure checkout
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductDetails;
