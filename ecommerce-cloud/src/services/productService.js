import { supabase } from '../lib/supabaseClient.js';

/**
 * Derives a simple `in_stock` flag from a product's nested variant rows
 * and drops the raw variant array — list views only need the flag, not
 * full variant data (that's fetched separately on the product page).
 */
function withStockFlag(product) {
  const variants = product.product_variants || [];
  const in_stock = variants.some((v) => v.is_active && v.stock > 0);
  const { product_variants, ...rest } = product;
  return { ...rest, in_stock };
}

/**
 * Fetch featured / newest products for the homepage.
 * Returns up to `limit` active products ordered by newest first.
 */
export async function fetchNewArrivals(limit = 4) {
  const { data, error } = await supabase
    .from('products')
    .select(
      'id, name, slug, price, compare_at_price, image_url, rating, age_group, product_variants(stock, is_active)'
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching new arrivals:', error.message);
    return [];
  }

  return (data || []).map(withStockFlag);
}

/**
 * Fetch the merchant-flagged featured product for the homepage spotlight.
 * Falls back to the newest active product if none is flagged, so the
 * section still has something to show.
 */
export async function fetchFeaturedProduct() {
  const base = supabase
    .from('products')
    .select('id, name, slug, price, compare_at_price, image_url, rating, description')
    .eq('is_active', true);

  const { data: featured, error: featuredError } = await base
    .eq('is_featured', true)
    .limit(1)
    .maybeSingle();

  if (featuredError) {
    console.error('Error fetching featured product:', featuredError.message);
    return null;
  }
  if (featured) return featured;

  const { data: fallback, error: fallbackError } = await supabase
    .from('products')
    .select('id, name, slug, price, compare_at_price, image_url, rating, description')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fallbackError) {
    console.error('Error fetching fallback featured product:', fallbackError.message);
    return null;
  }

  return fallback;
}

/**
 * Fetch all active categories ordered by display_order.
 */
export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, image_url, display_order')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error.message);
    return [];
  }

  return data || [];
}

/**
 * Fetch the distinct age_group values used by active products,
 * for building filter options on the shop page.
 */
export async function fetchAgeGroups() {
  const { data, error } = await supabase
    .from('products')
    .select('age_group')
    .eq('is_active', true)
    .not('age_group', 'is', null);

  if (error) {
    console.error('Error fetching age groups:', error.message);
    return [];
  }

  const unique = [...new Set((data || []).map((row) => row.age_group).filter(Boolean))];
  return unique.sort();
}

/**
 * Fetch active products for the shop page, with optional search,
 * category, and age-group filtering plus sorting.
 *
 * Returns { data, error } (rather than swallowing errors like the
 * helpers above) so the shop page can distinguish a failed fetch
 * from a genuinely empty result set and show the right UI state.
 */
export async function fetchProducts({
  search = '',
  categoryId = null,
  ageGroup = null,
  minPrice = null,
  maxPrice = null,
  sort = 'newest',
} = {}) {
  let query = supabase
    .from('products')
    .select(
      'id, name, slug, price, compare_at_price, image_url, rating, age_group, category_id, product_variants(stock, is_active)'
    )
    .eq('is_active', true);

  if (search.trim()) {
    query = query.ilike('name', `%${search.trim()}%`);
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  if (ageGroup) {
    query = query.eq('age_group', ageGroup);
  }

  if (minPrice != null) {
    query = query.gte('price', minPrice);
  }

  if (maxPrice != null) {
    query = query.lte('price', maxPrice);
  }

  switch (sort) {
    case 'price-asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price-desc':
      query = query.order('price', { ascending: false });
      break;
    case 'name-asc':
      query = query.order('name', { ascending: true });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error.message);
  }

  return { data: (data || []).map(withStockFlag), error };
}

/**
 * Fetch a single active product by slug for the product details page,
 * including its category, variants, and gallery images.
 *
 * Returns { data, error }. Uses maybeSingle() so a slug that matches
 * no active product resolves to { data: null, error: null } — a
 * genuine "not found" — distinct from a failed request.
 */
export async function fetchProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select(
      '*, categories(name, slug), product_variants(*), product_images(*)'
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product:', error.message);
  }

  return { data: data || null, error };
}

/**
 * Fetch active products by id, in no particular guaranteed order —
 * used to hydrate the wishlist and "recently viewed" lists (which
 * store ids only) with live prices, images, and stock.
 */
export async function fetchProductsByIds(ids) {
  if (!ids || ids.length === 0) return [];

  const { data, error } = await supabase
    .from('products')
    .select(
      'id, name, slug, price, compare_at_price, image_url, rating, age_group, product_variants(stock, is_active)'
    )
    .eq('is_active', true)
    .in('id', ids);

  if (error) {
    console.error('Error fetching products by id:', error.message);
    return [];
  }

  return (data || []).map(withStockFlag);
}

/**
 * Fetch other active products from the same category — "You may also
 * like" on the product details page. Excludes the product being viewed.
 */
export async function fetchRelatedProducts(categoryId, excludeProductId, limit = 4) {
  if (!categoryId) return [];

  let query = supabase
    .from('products')
    .select(
      'id, name, slug, price, compare_at_price, image_url, rating, age_group, product_variants(stock, is_active)'
    )
    .eq('is_active', true)
    .eq('category_id', categoryId)
    .limit(limit);

  if (excludeProductId) {
    query = query.neq('id', excludeProductId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching related products:', error.message);
    return [];
  }

  return (data || []).map(withStockFlag);
}

/**
 * Lightweight product search for the navbar's instant-search overlay —
 * a handful of name matches, not the full filtered/sorted shop query.
 */
export async function searchProducts(term, limit = 5) {
  const trimmed = term.trim();
  if (!trimmed) return [];

  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, price, image_url')
    .eq('is_active', true)
    .ilike('name', `%${trimmed}%`)
    .limit(limit);

  if (error) {
    console.error('Error searching products:', error.message);
    return [];
  }

  return data || [];
}

/**
 * Fetch current variant rows (with their parent product) for the
 * given variant ids — used to hydrate the guest cart with live
 * prices, stock, and product details.
 *
 * RLS already limits anonymous reads to active variants and active
 * products, so ids that are no longer purchasable simply do not
 * come back and are treated as unavailable by the caller.
 */
export async function fetchVariantsByIds(variantIds) {
  if (!variantIds || variantIds.length === 0) {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from('product_variants')
    .select('*, products(*)')
    .in('id', variantIds);

  if (error) {
    console.error('Error fetching cart variants:', error.message);
  }

  return { data: data || [], error };
}
