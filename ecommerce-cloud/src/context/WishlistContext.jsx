import { createContext, useContext, useEffect, useState } from 'react';

const WishlistContext = createContext(undefined);

const STORAGE_KEY = 'littlenest-wishlist';

/** Guest wishlist, persisted to localStorage. Stores product ids only. */
function readStoredWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id) => typeof id === 'string');
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [productIds, setProductIds] = useState(readStoredWishlist);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds));
    } catch {
      // Storage unavailable (private mode, quota) — wishlist stays in memory.
    }
  }, [productIds]);

  const isWishlisted = (productId) => productIds.includes(productId);

  const toggleWishlist = (productId) => {
    setProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <WishlistContext.Provider value={{ productIds, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
