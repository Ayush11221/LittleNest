// One-off admin script — run locally, never imported by the app.
// Seeds the live Supabase project with demo categories/products using the
// service_role key (bypasses RLS). Reads credentials from env vars only;
// never hardcode secrets here.
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-live-db.mjs

import { createClient } from '@supabase/supabase-js';
import { SEED_CATEGORIES, SEED_PRODUCTS } from '../src/admin/seedData.js';

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function createProduct({ product, variants = [] }) {
  const { data: created, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) return { error };

  if (variants.length > 0) {
    const { error: variantError } = await supabase
      .from('product_variants')
      .insert(variants.map((v) => ({ ...v, product_id: created.id })));
    if (variantError) return { data: created, error: variantError };
  }

  return { data: created, error: null };
}

async function seed() {
  const summary = { categoriesCreated: 0, productsCreated: 0, errors: [] };

  for (const category of SEED_CATEGORIES) {
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category.slug)
      .maybeSingle();
    if (existing) continue;

    const { error } = await supabase.from('categories').insert(category);
    if (error) summary.errors.push(`Category "${category.name}": ${error.message}`);
    else summary.categoriesCreated += 1;
  }

  const { data: allCategories } = await supabase.from('categories').select('id, slug');
  const categoryIdBySlug = new Map((allCategories || []).map((c) => [c.slug, c.id]));

  for (const item of SEED_PRODUCTS) {
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

    if (error) summary.errors.push(`Product "${item.name}": ${error.message}`);
    else summary.productsCreated += 1;
  }

  console.log(JSON.stringify(summary, null, 2));
}

seed();
