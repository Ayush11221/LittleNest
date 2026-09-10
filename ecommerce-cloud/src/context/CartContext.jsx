import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(undefined);

const STORAGE_KEY = 'littlenest-cart';

/**
 * Guest cart, persisted to localStorage.
 *
 * Only identifiers and quantity are stored — never prices, names,
 * or images. Display data is fetched fresh from Supabase so prices
 * can never go stale in a shopper's browser.
 *
 * The stored shape mirrors the cart_items table (product_id,
 * variant_id, quantity) so this can be synced to a user's cart
 * once authentication exists.
 */
function readStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) => item && item.variant_id && item.product_id && item.quantity > 0
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable (private mode, quota) — cart stays in memory.
    }
  }, [items]);

  const addToCart = (productId, variantId, quantity = 1) => {
    if (!productId || !variantId || quantity < 1) return;

    setItems((prev) => {
      const existing = prev.find((item) => item.variant_id === variantId);
      if (existing) {
        return prev.map((item) =>
          item.variant_id === variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product_id: productId, variant_id: variantId, quantity }];
    });
  };

  const updateQuantity = (variantId, quantity) => {
    if (quantity < 1) {
      removeFromCart(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.variant_id === variantId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (variantId) => {
    setItems((prev) => prev.filter((item) => item.variant_id !== variantId));
  };

  /** Drop lines whose variant no longer exists or is no longer purchasable. */
  const removeUnavailable = (variantIds) => {
    if (!variantIds.length) return;
    setItems((prev) => prev.filter((item) => !variantIds.includes(item.variant_id)));
  };

  const clearCart = () => setItems([]);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        removeUnavailable,
        clearCart,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
