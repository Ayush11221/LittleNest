import { createContext, useContext, useEffect, useState } from 'react';

const RecentlyViewedContext = createContext(undefined);

const STORAGE_KEY = 'littlenest-recently-viewed';
const MAX_ITEMS = 8;

/** Guest "recently viewed" list, persisted to localStorage. Stores product ids only. */
function readStored() {
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

export function RecentlyViewedProvider({ children }) {
  const [productIds, setProductIds] = useState(readStored);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds));
    } catch {
      // Storage unavailable — list stays in memory for this visit only.
    }
  }, [productIds]);

  /** Moves the product to the front, dedupes, and caps the list length. */
  const recordView = (productId) => {
    if (!productId) return;
    setProductIds((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, MAX_ITEMS));
  };

  return (
    <RecentlyViewedContext.Provider value={{ productIds, recordView }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
}
