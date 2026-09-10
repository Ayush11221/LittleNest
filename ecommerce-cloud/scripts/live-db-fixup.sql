-- ============================================================
-- LittleNest: replace placeholder demo data with the real
-- Unsplash-photo seed set, and promote admin accounts.
-- Run this whole script once in Supabase SQL Editor.
-- ============================================================

-- 1. Remove old placeholder-image demo data (variants/images cascade)
delete from public.products where slug in (
  'cotton-bunny-romper', 'floral-summer-dress', 'striped-polo-tshirt',
  'soft-knit-joggers', 'cloud-print-sleepsuit', 'daisy-coord-set',
  'newborn-welcome-set', 'sherpa-lined-jacket', 'muslin-bib-set-3pack'
);

delete from public.categories where slug in (
  'newborn-essentials', 'onesies-rompers', 'tops-tshirts', 'bottoms',
  'dresses', 'coord-sets', 'sleepwear', 'winter-wear', 'accessories'
);

-- 2. Insert real-photo categories
insert into public.categories (name, slug, description, image_url, display_order) values
  ('Newborn Essentials', 'newborn-essentials', 'Soft first pieces for the earliest days.', 'https://images.unsplash.com/photo-1510154221590-ff63e90a136f?w=900&h=1125&fit=crop&auto=format&q=80', 1),
  ('Onesies & Rompers', 'onesies-rompers', 'Easy one-piece essentials for everyday wear.', 'https://images.unsplash.com/photo-1622290319146-7b63df48a635?w=900&h=1125&fit=crop&auto=format&q=80', 2),
  ('Tops & T-Shirts', 'tops-tshirts', 'Everyday tops in soft, breathable cotton.', 'https://images.unsplash.com/photo-1546015720-b8b30df5aa27?w=900&h=1125&fit=crop&auto=format&q=80', 3),
  ('Bottoms', 'bottoms', 'Comfortable pants and shorts built for movement.', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&h=1125&fit=crop&auto=format&q=80', 4),
  ('Dresses', 'dresses', 'Sweet, simple dresses for little ones.', 'https://images.unsplash.com/photo-1543346242-2b8e41fb91ca?w=900&h=1125&fit=crop&auto=format&q=80', 5),
  ('Co-ord Sets', 'coord-sets', 'Matching sets that make dressing simple.', 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=900&h=1125&fit=crop&auto=format&q=80', 6),
  ('Sleepwear', 'sleepwear', 'Cosy, breathable sleepwear for better nights.', 'https://images.unsplash.com/photo-1622290291165-d341f1938b8a?w=900&h=1125&fit=crop&auto=format&q=80', 7),
  ('Winter Wear', 'winter-wear', 'Warm layers for cooler days.', 'https://images.unsplash.com/photo-1684244160171-97f5dac39204?w=900&h=1125&fit=crop&auto=format&q=80', 8),
  ('Accessories', 'accessories', 'The little extras — hats, bibs, and more.', 'https://images.unsplash.com/photo-1569974641446-22542de88536?w=900&h=1125&fit=crop&auto=format&q=80', 9);

-- 3. Insert real-photo products + their variants

with new_product as (
  insert into public.products (name, slug, description, price, compare_at_price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
  values ('Cotton Bunny Romper', 'cotton-bunny-romper', 'A soft, organic-cotton romper with a playful bunny print. Snap closures make changing quick and easy.', 799, 999, (select id from public.categories where slug = 'onesies-rompers'), '0-3 Months', 'unisex', '100% Organic Cotton', 'Machine wash cold, tumble dry low', 'https://images.unsplash.com/photo-1622290319146-7b63df48a635?w=900&h=1125&fit=crop&auto=format&q=80', 4.8, true)
  returning id
)
insert into public.product_variants (product_id, size, color, stock)
select new_product.id, v.size, v.color, v.stock from new_product, (values
  ('0-3M', 'Cream', 14),
  ('3-6M', 'Cream', 9),
  ('0-3M', 'Sage Green', 6)
) as v(size, color, stock);

with new_product as (
  insert into public.products (name, slug, description, price, compare_at_price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
  values ('Newborn Welcome Set', 'newborn-welcome-set', 'A 5-piece essentials set for your baby''s first days home — romper, cap, mittens, booties, and a swaddle.', 1499, null, (select id from public.categories where slug = 'newborn-essentials'), '0-3 Months', 'unisex', 'Cotton Blend', 'Machine wash cold, lay flat to dry', 'https://images.unsplash.com/photo-1510154221590-ff63e90a136f?w=900&h=1125&fit=crop&auto=format&q=80', 4.9, true)
  returning id
)
insert into public.product_variants (product_id, size, color, stock)
select new_product.id, v.size, v.color, v.stock from new_product, (values
  ('Newborn', 'White', 11),
  ('Newborn', 'Butter Yellow', 8)
) as v(size, color, stock);

with new_product as (
  insert into public.products (name, slug, description, price, compare_at_price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
  values ('Cloud Print Sleepsuit', 'cloud-print-sleepsuit', 'A dreamy cloud-print sleepsuit with flat seams and a two-way zip for easy midnight changes.', 899, null, (select id from public.categories where slug = 'sleepwear'), '3-6 Months', 'unisex', '100% Cotton', 'Machine wash cold, do not bleach', 'https://images.unsplash.com/photo-1622290291165-d341f1938b8a?w=900&h=1125&fit=crop&auto=format&q=80', 4.7, false)
  returning id
)
insert into public.product_variants (product_id, size, color, stock)
select new_product.id, v.size, v.color, v.stock from new_product, (values
  ('3-6M', 'Sky Blue', 10),
  ('6-12M', 'Sky Blue', 7),
  ('3-6M', 'Lavender', 5)
) as v(size, color, stock);

with new_product as (
  insert into public.products (name, slug, description, price, compare_at_price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
  values ('Striped Cotton Tee', 'striped-cotton-tee', 'A everyday striped tee in breathable cotton jersey, cut generously for easy movement.', 549, null, (select id from public.categories where slug = 'tops-tshirts'), '1-2 Years', 'unisex', '100% Cotton', 'Machine wash cold', 'https://images.unsplash.com/photo-1546015720-b8b30df5aa27?w=900&h=1125&fit=crop&auto=format&q=80', 4.5, false)
  returning id
)
insert into public.product_variants (product_id, size, color, stock)
select new_product.id, v.size, v.color, v.stock from new_product, (values
  ('1-2Y', 'Grey Melange', 13),
  ('2-3Y', 'Grey Melange', 9),
  ('1-2Y', 'Dusty Rose', 6)
) as v(size, color, stock);

with new_product as (
  insert into public.products (name, slug, description, price, compare_at_price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
  values ('Everyday Jogger Pants', 'everyday-jogger-pants', 'Soft French terry joggers with an adjustable elastic waist that grows with your little one.', 699, 849, (select id from public.categories where slug = 'bottoms'), '1-2 Years', 'unisex', 'Cotton French Terry', 'Machine wash cold, tumble dry low', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&h=1125&fit=crop&auto=format&q=80', 4.6, false)
  returning id
)
insert into public.product_variants (product_id, size, color, stock)
select new_product.id, v.size, v.color, v.stock from new_product, (values
  ('1-2Y', 'Sage Green', 12),
  ('2-3Y', 'Sage Green', 8)
) as v(size, color, stock);

with new_product as (
  insert into public.products (name, slug, description, price, compare_at_price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
  values ('Sunday Pinafore Dress', 'sunday-pinafore-dress', 'A simple pinafore dress in soft cotton poplin, made for twirling and everyday adventures alike.', 999, null, (select id from public.categories where slug = 'dresses'), '2-3 Years', 'girl', 'Cotton Poplin', 'Machine wash cold, hang to dry', 'https://images.unsplash.com/photo-1543346242-2b8e41fb91ca?w=900&h=1125&fit=crop&auto=format&q=80', 4.8, true)
  returning id
)
insert into public.product_variants (product_id, size, color, stock)
select new_product.id, v.size, v.color, v.stock from new_product, (values
  ('2-3Y', 'Dusty Rose', 9),
  ('1-2Y', 'Dusty Rose', 6),
  ('2-3Y', 'Butter Yellow', 4)
) as v(size, color, stock);

with new_product as (
  insert into public.products (name, slug, description, price, compare_at_price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
  values ('Weekend Co-ord Set', 'weekend-coord-set', 'A relaxed tee-and-shorts set in matching soft cotton — the easiest way to get dressed on a busy morning.', 899, null, (select id from public.categories where slug = 'coord-sets'), '1-2 Years', 'unisex', '100% Cotton', 'Machine wash cold', 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=900&h=1125&fit=crop&auto=format&q=80', 4.6, false)
  returning id
)
insert into public.product_variants (product_id, size, color, stock)
select new_product.id, v.size, v.color, v.stock from new_product, (values
  ('1-2Y', 'Sky Blue', 10),
  ('2-3Y', 'Sky Blue', 7)
) as v(size, color, stock);

with new_product as (
  insert into public.products (name, slug, description, price, compare_at_price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
  values ('Quilted Puffer Jacket', 'quilted-puffer-jacket', 'A lightweight quilted jacket with a soft fleece lining, made to keep little ones warm without the bulk.', 1299, 1599, (select id from public.categories where slug = 'winter-wear'), '1-2 Years', 'unisex', 'Polyester Shell, Fleece Lining', 'Machine wash cold, hang to dry', 'https://images.unsplash.com/photo-1684244160171-97f5dac39204?w=900&h=1125&fit=crop&auto=format&q=80', 4.7, true)
  returning id
)
insert into public.product_variants (product_id, size, color, stock)
select new_product.id, v.size, v.color, v.stock from new_product, (values
  ('1-2Y', 'Grey Melange', 8),
  ('2-3Y', 'Grey Melange', 6)
) as v(size, color, stock);

with new_product as (
  insert into public.products (name, slug, description, price, compare_at_price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
  values ('Soft Knit Beanie', 'soft-knit-beanie', 'A gently stretchy knit beanie that keeps its shape wash after wash.', 349, null, (select id from public.categories where slug = 'accessories'), '6-12 Months', 'unisex', 'Cotton Knit', 'Hand wash cold', 'https://images.unsplash.com/photo-1569974641446-22542de88536?w=900&h=1125&fit=crop&auto=format&q=80', 4.4, false)
  returning id
)
insert into public.product_variants (product_id, size, color, stock)
select new_product.id, v.size, v.color, v.stock from new_product, (values
  ('One Size', 'Cream', 15),
  ('One Size', 'Dusty Rose', 10)
) as v(size, color, stock);

with new_product as (
  insert into public.products (name, slug, description, price, compare_at_price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
  values ('Organic Muslin Swaddle', 'organic-muslin-swaddle', 'An extra-large muslin swaddle that softens with every wash — doubles as a nursing cover or stroller shade.', 599, null, (select id from public.categories where slug = 'newborn-essentials'), '0-3 Months', 'unisex', '100% Organic Muslin Cotton', 'Machine wash cold', 'https://images.unsplash.com/photo-1470116945706-e6bf5d5a53ca?w=900&h=1125&fit=crop&auto=format&q=80', 4.9, false)
  returning id
)
insert into public.product_variants (product_id, size, color, stock)
select new_product.id, v.size, v.color, v.stock from new_product, (values
  ('One Size', 'Sage Green', 20),
  ('One Size', 'White', 16)
) as v(size, color, stock);

with new_product as (
  insert into public.products (name, slug, description, price, compare_at_price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
  values ('Button-Up Cardigan', 'button-up-cardigan', 'A soft knit cardigan with wooden buttons — a cosy layer for cooler evenings.', 799, null, (select id from public.categories where slug = 'tops-tshirts'), '6-12 Months', 'unisex', 'Cotton Knit', 'Hand wash cold, dry flat', 'https://images.unsplash.com/photo-1560506840-ec148e82a604?w=900&h=1125&fit=crop&auto=format&q=80', 4.6, false)
  returning id
)
insert into public.product_variants (product_id, size, color, stock)
select new_product.id, v.size, v.color, v.stock from new_product, (values
  ('6-12M', 'Butter Yellow', 9),
  ('1-2Y', 'Butter Yellow', 7)
) as v(size, color, stock);

with new_product as (
  insert into public.products (name, slug, description, price, compare_at_price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
  values ('Ribbed Footed Sleepsuit', 'ribbed-footed-sleepsuit', 'A snug, ribbed sleepsuit with covered feet — no more searching for lost socks at bedtime.', 649, null, (select id from public.categories where slug = 'sleepwear'), '3-6 Months', 'unisex', '95% Cotton, 5% Elastane', 'Machine wash cold', 'https://images.unsplash.com/photo-1591161555818-7b9debeccc07?w=900&h=1125&fit=crop&auto=format&q=80', 4.7, false)
  returning id
)
insert into public.product_variants (product_id, size, color, stock)
select new_product.id, v.size, v.color, v.stock from new_product, (values
  ('3-6M', 'Lavender', 11),
  ('6-12M', 'Lavender', 8)
) as v(size, color, stock);

with new_product as (
  insert into public.products (name, slug, description, price, compare_at_price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
  values ('Denim-Look Dungarees', 'denim-look-dungarees', 'Soft jersey dungarees with a denim-look print — easy poppers for quick changes, no rough denim.', 899, null, (select id from public.categories where slug = 'bottoms'), '1-2 Years', 'unisex', 'Cotton Jersey', 'Machine wash cold', 'https://images.unsplash.com/photo-1552819289-824d37ca69d2?w=900&h=1125&fit=crop&auto=format&q=80', 4.5, false)
  returning id
)
insert into public.product_variants (product_id, size, color, stock)
select new_product.id, v.size, v.color, v.stock from new_product, (values
  ('1-2Y', 'Sky Blue', 10),
  ('2-3Y', 'Sky Blue', 6)
) as v(size, color, stock);

with new_product as (
  insert into public.products (name, slug, description, price, compare_at_price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
  values ('Floral Puff-Sleeve Dress', 'floral-puff-sleeve-dress', 'A lightweight floral dress with gentle puff sleeves and a twirl-friendly hem.', 1099, 1299, (select id from public.categories where slug = 'dresses'), '2-3 Years', 'girl', 'Cotton Voile', 'Machine wash cold, hang to dry', 'https://images.unsplash.com/photo-1596252732610-fce5ac542f8e?w=900&h=1125&fit=crop&auto=format&q=80', 4.8, false)
  returning id
)
insert into public.product_variants (product_id, size, color, stock)
select new_product.id, v.size, v.color, v.stock from new_product, (values
  ('2-3Y', 'Dusty Rose', 7),
  ('1-2Y', 'Dusty Rose', 5)
) as v(size, color, stock);

with new_product as (
  insert into public.products (name, slug, description, price, compare_at_price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
  values ('Terry Cloth Romper', 'terry-cloth-romper', 'A textured terry romper that feels like a warm towel hug all day long.', 749, null, (select id from public.categories where slug = 'onesies-rompers'), '6-12 Months', 'unisex', 'Cotton Terry', 'Machine wash cold, tumble dry low', 'https://images.unsplash.com/photo-1543342384-1f1350e27861?w=900&h=1125&fit=crop&auto=format&q=80', 4.6, false)
  returning id
)
insert into public.product_variants (product_id, size, color, stock)
select new_product.id, v.size, v.color, v.stock from new_product, (values
  ('6-12M', 'Cream', 12),
  ('3-6M', 'Cream', 9)
) as v(size, color, stock);

with new_product as (
  insert into public.products (name, slug, description, price, compare_at_price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
  values ('Knit Booties & Mitten Set', 'knit-booties-mitten-set', 'A matching knit booties and mittens set to keep tiny hands and feet warm.', 449, null, (select id from public.categories where slug = 'accessories'), '0-3 Months', 'unisex', 'Acrylic Knit', 'Hand wash cold', 'https://images.unsplash.com/photo-1608039649006-df579ad70c64?w=900&h=1125&fit=crop&auto=format&q=80', 4.5, false)
  returning id
)
insert into public.product_variants (product_id, size, color, stock)
select new_product.id, v.size, v.color, v.stock from new_product, (values
  ('One Size', 'Grey Melange', 14),
  ('One Size', 'Sage Green', 10)
) as v(size, color, stock);

with new_product as (
  insert into public.products (name, slug, description, price, compare_at_price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
  values ('Fleece-Lined Snowsuit', 'fleece-lined-snowsuit', 'A cosy all-in-one snowsuit with fleece lining and a fold-over cuff to protect little hands.', 1699, 1999, (select id from public.categories where slug = 'winter-wear'), '6-12 Months', 'unisex', 'Polyester Shell, Fleece Lining', 'Machine wash cold, hang to dry', 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=900&h=1125&fit=crop&auto=format&q=80', 4.9, false)
  returning id
)
insert into public.product_variants (product_id, size, color, stock)
select new_product.id, v.size, v.color, v.stock from new_product, (values
  ('6-12M', 'Grey Melange', 6),
  ('1-2Y', 'Grey Melange', 5)
) as v(size, color, stock);

with new_product as (
  insert into public.products (name, slug, description, price, compare_at_price, category_id, age_group, gender, material, care_instructions, image_url, rating, is_featured)
  values ('Two-Piece Lounge Set', 'two-piece-lounge-set', 'A relaxed-fit tee and pants set in soft ribbed cotton, perfect for lazy mornings.', 999, null, (select id from public.categories where slug = 'coord-sets'), '2-3 Years', 'unisex', 'Ribbed Cotton', 'Machine wash cold', 'https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=900&h=1125&fit=crop&auto=format&q=80', 4.6, false)
  returning id
)
insert into public.product_variants (product_id, size, color, stock)
select new_product.id, v.size, v.color, v.stock from new_product, (values
  ('2-3Y', 'Butter Yellow', 8),
  ('1-2Y', 'Butter Yellow', 6)
) as v(size, color, stock);

-- 4. Promote your account(s) to admin
update public.profiles set role = 'admin' where email = 'iamcute936968@gmail.com';
update public.profiles set role = 'admin' where email = 'vishvasarvaiya@gmail.com'; -- no-op until you sign up with this email; re-run after signing up if needed
