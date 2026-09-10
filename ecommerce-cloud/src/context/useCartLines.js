import { useEffect, useState } from 'react';
import { fetchVariantsByIds } from '../services/productService.js';
import { useCart } from './CartContext.jsx';

/**
 * Hydrates the guest cart's stored (product_id, variant_id, quantity)
 * rows into live line items — current price, stock, name, image —
 * fetched fresh from Supabase. Shared by the cart page and cart drawer
 * so both always agree on what's actually purchasable.
 */
export function useCartLines() {
  const { items, updateQuantity, removeFromCart, removeUnavailable, clearCart } = useCart();

  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [removedNotice, setRemovedNotice] = useState(false);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    const variantIds = items.map((item) => item.variant_id);

    if (variantIds.length === 0) {
      setLines([]);
      setLoading(false);
      setError(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    fetchVariantsByIds(variantIds).then(({ data, error: fetchError }) => {
      if (cancelled) return;

      if (fetchError) {
        setError(true);
        setLoading(false);
        return;
      }

      const unavailableIds = [];
      const clamped = [];
      const nextLines = [];

      for (const item of items) {
        const variant = data.find((v) => v.id === item.variant_id);

        // Gone, deactivated, parent product hidden by RLS, or nothing left in stock.
        if (!variant || !variant.is_active || !variant.products || variant.stock < 1) {
          unavailableIds.push(item.variant_id);
          continue;
        }

        const quantity = Math.min(item.quantity, variant.stock);
        if (quantity !== item.quantity) {
          clamped.push({ variantId: item.variant_id, quantity });
        }

        nextLines.push({
          variant_id: variant.id,
          product_id: variant.product_id,
          name: variant.products.name,
          slug: variant.products.slug,
          image_url: variant.products.image_url,
          size: variant.size,
          color: variant.color,
          stock: variant.stock,
          price: variant.price_override ?? variant.products.price,
          quantity,
        });
      }

      setLines(nextLines);
      setLoading(false);

      if (unavailableIds.length > 0) {
        setRemovedNotice(true);
        removeUnavailable(unavailableIds);
      }
      // Keep stored quantities in step with real stock so the navbar
      // count and the cart never disagree.
      clamped.forEach(({ variantId, quantity }) => updateQuantity(variantId, quantity));
    });

    return () => {
      cancelled = true;
    };
    // Cart mutators are recreated each render; `items` is the real trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, retryToken]);

  return {
    lines,
    loading,
    error,
    removedNotice,
    retry: () => setRetryToken((t) => t + 1),
    updateQuantity,
    removeFromCart,
    clearCart,
  };
}
