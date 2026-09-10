import { supabase } from '../lib/supabaseClient.js';

/**
 * Fetch featured / newest products for the homepage.
 * Returns up to `limit` active products ordered by newest first.
 */
export async function fetchNewArrivals(limit = 4) {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, price, compare_at_price, image_url, rating, age_group')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching new arrivals:', error.message);
    return [];
  }

  return data || [];
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
  sort = 'newest',
} = {}) {
  let query = supabase
    .from('products')
    .select('id, name, slug, price, compare_at_price, image_url, rating, age_group, category_id')
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

  return { data: data || [], error };
}
