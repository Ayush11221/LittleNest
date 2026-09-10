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
