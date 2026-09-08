-- ============================================================
-- LittleNest — Sample Seed Data
-- ============================================================
-- Run this AFTER 001_initial_schema.sql.
-- This populates categories and sample baby clothing products
-- for development and demo purposes.
--
-- This data is safe to remove or replace later.
-- ============================================================


-- ============================================================
-- CATEGORIES
-- ============================================================

insert into public.categories (name, slug, description, display_order) values
  ('Newborn Essentials', 'newborn-essentials', 'Everything your newborn needs for the first days.', 1),
  ('Onesies & Rompers',  'onesies-rompers',    'Comfortable one-piece outfits for everyday wear.',  2),
  ('Tops & T-Shirts',    'tops-tshirts',        'Soft and playful tops for little ones.',            3),
  ('Bottoms',            'bottoms',             'Pants, shorts, and leggings for active babies.',    4),
  ('Dresses',            'dresses',             'Adorable dresses for special and everyday moments.',5),
  ('Co-ord Sets',        'coord-sets',          'Matching top and bottom sets.',                     6),
  ('Sleepwear',          'sleepwear',           'Cozy sleepwear for restful nights.',                7),
  ('Winter Wear',        'winter-wear',         'Warm layers for cooler days.',                      8),
  ('Accessories',        'accessories',         'Bibs, hats, socks, and more.',                      9);


-- ============================================================
-- PRODUCTS
-- ============================================================
-- Using placeholder image URLs. Replace with real S3 URLs later.

-- Product 1: Cotton Bunny Romper
insert into public.products (name, slug, description, price, compare_at_price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
values (
  'Cotton Bunny Romper',
  'cotton-bunny-romper',
  'An adorable bunny-print romper made from 100% organic cotton. Soft on baby''s skin with snap closures for easy diaper changes.',
  799.00,
  999.00,
  (select id from public.categories where slug = 'onesies-rompers'),
  '0-6 Months',
  'unisex',
  '100% Organic Cotton',
  'Machine wash cold. Tumble dry low.',
  'https://placehold.co/600x700/f5f0eb/4a4a4a?text=Bunny+Romper',
  4.5,
  true
);

-- Product 2: Floral Summer Dress
insert into public.products (name, slug, description, price, compare_at_price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
values (
  'Floral Summer Dress',
  'floral-summer-dress',
  'A lightweight floral dress perfect for warm days. Features a comfortable elastic waist and soft cotton lining.',
  1299.00,
  null,
  (select id from public.categories where slug = 'dresses'),
  '6-12 Months',
  'girl',
  '100% Cotton',
  'Machine wash cold. Hang dry.',
  'https://placehold.co/600x700/f5f0eb/4a4a4a?text=Floral+Dress',
  4.8,
  true
);

-- Product 3: Striped Polo T-Shirt
insert into public.products (name, slug, description, price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
values (
  'Striped Polo T-Shirt',
  'striped-polo-tshirt',
  'A classic striped polo for little gentlemen. Soft pique cotton with a comfortable collar.',
  599.00,
  (select id from public.categories where slug = 'tops-tshirts'),
  '1-2 Years',
  'boy',
  '100% Cotton Pique',
  'Machine wash cold.',
  'https://placehold.co/600x700/f5f0eb/4a4a4a?text=Polo+Shirt',
  4.2,
  true
);

-- Product 4: Soft Knit Joggers
insert into public.products (name, slug, description, price, category_id, age_group, gender, material, care_instructions, image_url, rating)
values (
  'Soft Knit Joggers',
  'soft-knit-joggers',
  'Cozy knit joggers with an elastic waistband for easy dressing. Perfect for crawling and first steps.',
  699.00,
  (select id from public.categories where slug = 'bottoms'),
  '6-12 Months',
  'unisex',
  'Cotton Blend',
  'Machine wash cold. Tumble dry low.',
  'https://placehold.co/600x700/f5f0eb/4a4a4a?text=Knit+Joggers',
  4.3
);

-- Product 5: Cloud Print Sleepsuit
insert into public.products (name, slug, description, price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
values (
  'Cloud Print Sleepsuit',
  'cloud-print-sleepsuit',
  'A dreamy sleepsuit with cloud prints. Full-length zip for easy midnight changes. Soft and breathable.',
  899.00,
  (select id from public.categories where slug = 'sleepwear'),
  '0-6 Months',
  'unisex',
  '100% Organic Cotton',
  'Machine wash cold. Tumble dry low.',
  'https://placehold.co/600x700/f5f0eb/4a4a4a?text=Sleepsuit',
  4.7,
  true
);

-- Product 6: Daisy Co-ord Set
insert into public.products (name, slug, description, price, compare_at_price, category_id, age_group, gender, material, care_instructions, image_url, rating)
values (
  'Daisy Co-ord Set',
  'daisy-coord-set',
  'A matching top and shorts set with a delicate daisy print. Comfortable and stylish for everyday wear.',
  1099.00,
  1399.00,
  (select id from public.categories where slug = 'coord-sets'),
  '1-2 Years',
  'girl',
  '100% Cotton',
  'Machine wash cold. Hang dry.',
  'https://placehold.co/600x700/f5f0eb/4a4a4a?text=Daisy+Set',
  4.4
);

-- Product 7: Newborn Welcome Set
insert into public.products (name, slug, description, price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
values (
  'Newborn Welcome Set',
  'newborn-welcome-set',
  'A 5-piece essential set for newborns: bodysuit, cap, mittens, booties, and bib. The perfect gift for new parents.',
  1999.00,
  (select id from public.categories where slug = 'newborn-essentials'),
  '0-3 Months',
  'unisex',
  '100% Organic Cotton',
  'Machine wash cold. Do not bleach.',
  'https://placehold.co/600x700/f5f0eb/4a4a4a?text=Welcome+Set',
  4.9,
  true
);

-- Product 8: Sherpa Lined Jacket
insert into public.products (name, slug, description, price, category_id, age_group, gender, material, care_instructions, image_url, rating)
values (
  'Sherpa Lined Jacket',
  'sherpa-lined-jacket',
  'A warm sherpa-lined jacket for chilly days. Snap-front closure and soft hood.',
  1499.00,
  (select id from public.categories where slug = 'winter-wear'),
  '1-2 Years',
  'unisex',
  'Cotton outer, Polyester Sherpa lining',
  'Machine wash cold. Tumble dry low.',
  'https://placehold.co/600x700/f5f0eb/4a4a4a?text=Sherpa+Jacket',
  4.6
);

-- Product 9: Muslin Bib Set (3-Pack)
insert into public.products (name, slug, description, price, category_id, age_group, gender, material, care_instructions, image_url, rating)
values (
  'Muslin Bib Set (3-Pack)',
  'muslin-bib-set-3pack',
  'A set of 3 absorbent muslin bibs in soft, neutral tones. Adjustable snaps fit growing babies.',
  499.00,
  (select id from public.categories where slug = 'accessories'),
  '0-2 Years',
  'unisex',
  '100% Muslin Cotton',
  'Machine wash warm.',
  'https://placehold.co/600x700/f5f0eb/4a4a4a?text=Bib+Set',
  4.1
);


-- ============================================================
-- PRODUCT VARIANTS (sizes/colors with individual stock)
-- ============================================================

-- Cotton Bunny Romper variants
insert into public.product_variants (product_id, size, color, stock) values
  ((select id from public.products where slug = 'cotton-bunny-romper'), '0-3M', 'Cream',  12),
  ((select id from public.products where slug = 'cotton-bunny-romper'), '3-6M', 'Cream',  8),
  ((select id from public.products where slug = 'cotton-bunny-romper'), '0-3M', 'Sage',   10),
  ((select id from public.products where slug = 'cotton-bunny-romper'), '3-6M', 'Sage',   6);

-- Floral Summer Dress variants
insert into public.product_variants (product_id, size, color, stock) values
  ((select id from public.products where slug = 'floral-summer-dress'), '6-12M',  'Blush',  7),
  ((select id from public.products where slug = 'floral-summer-dress'), '12-18M', 'Blush',  5),
  ((select id from public.products where slug = 'floral-summer-dress'), '6-12M',  'Ivory',  9),
  ((select id from public.products where slug = 'floral-summer-dress'), '12-18M', 'Ivory',  4);

-- Striped Polo T-Shirt variants
insert into public.product_variants (product_id, size, color, stock) values
  ((select id from public.products where slug = 'striped-polo-tshirt'), '12-18M', 'Navy',  15),
  ((select id from public.products where slug = 'striped-polo-tshirt'), '18-24M', 'Navy',  10),
  ((select id from public.products where slug = 'striped-polo-tshirt'), '2-3Y',   'Navy',  8),
  ((select id from public.products where slug = 'striped-polo-tshirt'), '12-18M', 'White', 12),
  ((select id from public.products where slug = 'striped-polo-tshirt'), '18-24M', 'White', 7);

-- Soft Knit Joggers variants
insert into public.product_variants (product_id, size, color, stock) values
  ((select id from public.products where slug = 'soft-knit-joggers'), '6-12M',  'Oatmeal', 11),
  ((select id from public.products where slug = 'soft-knit-joggers'), '12-18M', 'Oatmeal', 9),
  ((select id from public.products where slug = 'soft-knit-joggers'), '6-12M',  'Charcoal', 8),
  ((select id from public.products where slug = 'soft-knit-joggers'), '12-18M', 'Charcoal', 6);

-- Cloud Print Sleepsuit variants
insert into public.product_variants (product_id, size, color, stock) values
  ((select id from public.products where slug = 'cloud-print-sleepsuit'), '0-3M', 'White', 14),
  ((select id from public.products where slug = 'cloud-print-sleepsuit'), '3-6M', 'White', 10),
  ((select id from public.products where slug = 'cloud-print-sleepsuit'), '0-3M', 'Blue',  8),
  ((select id from public.products where slug = 'cloud-print-sleepsuit'), '3-6M', 'Blue',  5);

-- Daisy Co-ord Set variants
insert into public.product_variants (product_id, size, color, stock) values
  ((select id from public.products where slug = 'daisy-coord-set'), '12-18M', 'Pink',  6),
  ((select id from public.products where slug = 'daisy-coord-set'), '18-24M', 'Pink',  4),
  ((select id from public.products where slug = 'daisy-coord-set'), '2-3Y',   'Pink',  3);

-- Newborn Welcome Set variants
insert into public.product_variants (product_id, size, color, stock) values
  ((select id from public.products where slug = 'newborn-welcome-set'), '0-3M', 'Cream',   20),
  ((select id from public.products where slug = 'newborn-welcome-set'), '0-3M', 'Sage',    15),
  ((select id from public.products where slug = 'newborn-welcome-set'), '0-3M', 'Sky Blue', 12);

-- Sherpa Lined Jacket variants
insert into public.product_variants (product_id, size, color, stock) values
  ((select id from public.products where slug = 'sherpa-lined-jacket'), '12-18M', 'Beige', 7),
  ((select id from public.products where slug = 'sherpa-lined-jacket'), '18-24M', 'Beige', 5),
  ((select id from public.products where slug = 'sherpa-lined-jacket'), '2-3Y',   'Beige', 4),
  ((select id from public.products where slug = 'sherpa-lined-jacket'), '12-18M', 'Brown', 6),
  ((select id from public.products where slug = 'sherpa-lined-jacket'), '18-24M', 'Brown', 3);

-- Muslin Bib Set variants
insert into public.product_variants (product_id, size, color, stock) values
  ((select id from public.products where slug = 'muslin-bib-set-3pack'), 'One Size', 'Neutral', 25),
  ((select id from public.products where slug = 'muslin-bib-set-3pack'), 'One Size', 'Pastel',  18);


-- ============================================================
-- PRODUCT IMAGES (additional gallery images)
-- ============================================================

insert into public.product_images (product_id, image_url, alt_text, display_order) values
  ((select id from public.products where slug = 'cotton-bunny-romper'),
   'https://placehold.co/600x700/f5f0eb/4a4a4a?text=Bunny+Detail', 'Bunny romper detail view', 1),
  ((select id from public.products where slug = 'cotton-bunny-romper'),
   'https://placehold.co/600x700/f5f0eb/4a4a4a?text=Bunny+Back', 'Bunny romper back view', 2),
  ((select id from public.products where slug = 'floral-summer-dress'),
   'https://placehold.co/600x700/f5f0eb/4a4a4a?text=Dress+Detail', 'Floral dress detail', 1),
  ((select id from public.products where slug = 'newborn-welcome-set'),
   'https://placehold.co/600x700/f5f0eb/4a4a4a?text=Set+Contents', 'Welcome set contents', 1),
  ((select id from public.products where slug = 'newborn-welcome-set'),
   'https://placehold.co/600x700/f5f0eb/4a4a4a?text=Set+Detail', 'Welcome set detail', 2);


-- ============================================================
-- DONE
-- ============================================================
-- Seed data summary:
--   9 categories
--   9 products (across different categories, ages, genders)
--   37 product variants (size/color combinations with stock)
--   5 additional product images
--
-- This data is for development/demo only.
-- Replace placeholder image URLs with S3 URLs in Phase 8.
-- ============================================================
