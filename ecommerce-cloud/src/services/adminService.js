import { supabase } from '../lib/supabaseClient.js';

/* ============================================================
 * Dashboard
 * ============================================================ */

/** Simple counts for the admin overview cards. */
export async function fetchDashboardStats() {
  const [products, categories, orders, customers] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('categories').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
  ]);

  return {
    productCount: products.count ?? 0,
    categoryCount: categories.count ?? 0,
    orderCount: orders.count ?? 0,
    customerCount: customers.count ?? 0,
  };
}

/** Most recent orders for the dashboard's "Recent Orders" table. */
export async function fetchRecentOrders(limit = 5) {
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, shipping_name, total_amount, order_status, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent orders:', error.message);
    return [];
  }
  return data || [];
}

/* ============================================================
 * Products
 * ============================================================ */

/** All products (active and inactive) for the admin table — requires admin RLS. */
export async function fetchAdminProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug), product_variants(id, stock, is_active)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin products:', error.message);
    return { data: [], error };
  }
  return { data: data || [], error: null };
}

export async function fetchAdminProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(*), product_images(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product:', error.message);
  }
  return { data: data || null, error };
}

/** Turns a product name into a URL-safe, unique-ish slug. */
export function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Creates a product plus its variants (and any extra gallery images) in
 * one call. Variants/images are inserted only after the product exists,
 * since both reference product_id.
 */
export async function createProduct({ product, variants = [], images = [] }) {
  const { data: created, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error.message);
    return { data: null, error };
  }

  if (variants.length > 0) {
    const { error: variantError } = await supabase
      .from('product_variants')
      .insert(variants.map((v) => ({ ...v, product_id: created.id })));
    if (variantError) {
      console.error('Error creating variants:', variantError.message);
      return { data: created, error: variantError };
    }
  }

  if (images.length > 0) {
    const { error: imageError } = await supabase
      .from('product_images')
      .insert(images.map((img, i) => ({ ...img, product_id: created.id, display_order: i })));
    if (imageError) {
      console.error('Error creating product images:', imageError.message);
      return { data: created, error: imageError };
    }
  }

  return { data: created, error: null };
}

/**
 * Updates a product's own fields, then replaces its variants and gallery
 * images wholesale (delete + re-insert) — simpler and safer than diffing
 * rows for an admin form that submits the full current list each time.
 */
export async function updateProduct(id, { product, variants = [], images = [] }) {
  const { error: updateError } = await supabase.from('products').update(product).eq('id', id);
  if (updateError) {
    console.error('Error updating product:', updateError.message);
    return { error: updateError };
  }

  const { error: deleteVariantsError } = await supabase
    .from('product_variants')
    .delete()
    .eq('product_id', id);
  if (deleteVariantsError) {
    console.error('Error clearing variants:', deleteVariantsError.message);
    return { error: deleteVariantsError };
  }
  if (variants.length > 0) {
    const { error: insertVariantsError } = await supabase
      .from('product_variants')
      .insert(variants.map((v) => ({ ...v, product_id: id })));
    if (insertVariantsError) {
      console.error('Error saving variants:', insertVariantsError.message);
      return { error: insertVariantsError };
    }
  }

  const { error: deleteImagesError } = await supabase
    .from('product_images')
    .delete()
    .eq('product_id', id);
  if (deleteImagesError) {
    console.error('Error clearing images:', deleteImagesError.message);
    return { error: deleteImagesError };
  }
  if (images.length > 0) {
    const { error: insertImagesError } = await supabase
      .from('product_images')
      .insert(images.map((img, i) => ({ ...img, product_id: id, display_order: i })));
    if (insertImagesError) {
      console.error('Error saving images:', insertImagesError.message);
      return { error: insertImagesError };
    }
  }

  return { error: null };
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    console.error('Error deleting product:', error.message);
  }
  return { error };
}

export async function setProductActive(id, isActive) {
  const { error } = await supabase.from('products').update({ is_active: isActive }).eq('id', id);
  if (error) {
    console.error('Error updating product status:', error.message);
  }
  return { error };
}

/* ============================================================
 * Categories
 * ============================================================ */

export async function fetchAdminCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*, products(id)')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching admin categories:', error.message);
    return [];
  }
  return data || [];
}

export async function createCategory(category) {
  const { data, error } = await supabase.from('categories').insert(category).select().single();
  if (error) {
    console.error('Error creating category:', error.message);
  }
  return { data: data || null, error };
}

export async function updateCategory(id, category) {
  const { error } = await supabase.from('categories').update(category).eq('id', id);
  if (error) {
    console.error('Error updating category:', error.message);
  }
  return { error };
}

export async function deleteCategory(id) {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) {
    console.error('Error deleting category:', error.message);
  }
  return { error };
}

/* ============================================================
 * Orders
 * ============================================================ */

export async function fetchAdminOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin orders:', error.message);
    return [];
  }
  return data || [];
}

export async function updateOrderStatus(id, orderStatus) {
  const { error } = await supabase
    .from('orders')
    .update({ order_status: orderStatus })
    .eq('id', id);
  if (error) {
    console.error('Error updating order status:', error.message);
  }
  return { error };
}

/* ============================================================
 * Demo data seeding
 * ============================================================ */

/**
 * Inserts the demo categories and products (see src/admin/seedData.js)
 * via the normal client SDK — same as any other admin write, subject to
 * the same RLS policies. Skips categories/products whose slug already
 * exists, so it's safe to run more than once.
 *
 * Returns a small summary so the caller can show what happened.
 */
export async function seedDemoData(categories, products) {
  const summary = { categoriesCreated: 0, productsCreated: 0, errors: [] };

  for (const category of categories) {
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category.slug)
      .maybeSingle();
    if (existing) continue;

    const { error } = await supabase.from('categories').insert(category);
    if (error) {
      summary.errors.push(`Category "${category.name}": ${error.message}`);
    } else {
      summary.categoriesCreated += 1;
    }
  }

  const { data: allCategories } = await supabase.from('categories').select('id, slug');
  const categoryIdBySlug = new Map((allCategories || []).map((c) => [c.slug, c.id]));

  for (const item of products) {
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('slug', item.slug)
      .maybeSingle();
    if (existing) continue;

    const categoryId = categoryIdBySlug.get(item.category) ?? null;
    const { category: _omit, variants, ...productFields } = item;

    const { error } = await createProduct({
      product: { ...productFields, category_id: categoryId },
      variants,
    });

    if (error) {
      summary.errors.push(`Product "${item.name}": ${error.message}`);
    } else {
      summary.productsCreated += 1;
    }
  }

  return summary;
}

/* ============================================================
 * Customers
 * ============================================================ */

export async function fetchAdminCustomers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, phone, role, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customers:', error.message);
    return [];
  }
  return data || [];
}
