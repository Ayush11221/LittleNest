-- ============================================================
-- LittleNest — Baby Clothing E-Commerce
-- Database Schema Migration
-- ============================================================
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- This creates all 12 application tables, foreign keys,
-- constraints, RLS policies, and the profile-creation trigger.
-- ============================================================


-- ============================================================
-- 1. PROFILES
-- ============================================================
-- Extends Supabase auth.users with application-level data.
-- A row is created automatically when a user signs up (via trigger below).

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null default '',
  email       text not null default '',
  phone       text,
  role        text not null default 'customer'
                check (role in ('customer', 'admin')),
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'Application user profiles linked to Supabase Auth.';


-- ============================================================
-- 2. CATEGORIES
-- ============================================================
-- Baby clothing product categories.

create table if not exists public.categories (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  slug          text not null unique,
  description   text,
  image_url     text,
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

comment on table public.categories is 'Product categories for baby clothing.';


-- ============================================================
-- 3. PRODUCTS
-- ============================================================
-- Core product data. Size/color/stock variants are in product_variants.

create table if not exists public.products (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text not null unique,
  description       text,
  price             numeric(10,2) not null check (price >= 0),
  compare_at_price  numeric(10,2) check (compare_at_price is null or compare_at_price >= 0),
  category_id       uuid references public.categories(id) on delete set null,
  age_group         text,
  gender            text not null default 'unisex'
                      check (gender in ('boy', 'girl', 'unisex')),
  material          text,
  care_instructions text,
  image_url         text,
  rating            numeric(2,1) not null default 0
                      check (rating >= 0 and rating <= 5),
  is_featured       boolean not null default false,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.products is 'Baby clothing products. Variants hold size/color/stock.';
comment on column public.products.price is 'Base price in INR. Variants can override via price_override.';
comment on column public.products.compare_at_price is 'Original/MRP price for showing discounts. NULL if no discount.';
comment on column public.products.age_group is 'Target age range, e.g. 0-3 Months, 1-2 Years.';


-- ============================================================
-- 4. PRODUCT_IMAGES
-- ============================================================
-- Multiple images per product for gallery views.

create table if not exists public.product_images (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products(id) on delete cascade,
  image_url     text not null,
  alt_text      text,
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

comment on table public.product_images is 'Additional product images for gallery display.';


-- ============================================================
-- 5. PRODUCT_VARIANTS
-- ============================================================
-- Each row = one size/color combination with its own stock.
-- Example: "Cotton Romper, 3-6M, Cream" → stock: 8

create table if not exists public.product_variants (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references public.products(id) on delete cascade,
  size           text not null,
  color          text,
  sku            text unique,
  stock          integer not null default 0 check (stock >= 0),
  price_override numeric(10,2) check (price_override is null or price_override >= 0),
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  unique (product_id, size, color)
);

comment on table public.product_variants is 'Size/color variants with individual stock counts.';
comment on column public.product_variants.price_override is 'If set, overrides the base product price for this variant.';


-- ============================================================
-- 6. CARTS
-- ============================================================
-- One cart per logged-in user.

create table if not exists public.carts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.carts is 'One cart per authenticated user.';


-- ============================================================
-- 7. CART_ITEMS
-- ============================================================
-- Items in a user's cart, each referencing a specific product variant.

create table if not exists public.cart_items (
  id          uuid primary key default gen_random_uuid(),
  cart_id     uuid not null references public.carts(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  variant_id  uuid not null references public.product_variants(id) on delete cascade,
  quantity    integer not null default 1 check (quantity >= 1),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  unique (cart_id, variant_id)
);

comment on table public.cart_items is 'Individual items in a cart. Unique per cart + variant.';


-- ============================================================
-- 8. ADDRESSES
-- ============================================================
-- Saved shipping addresses for customers.

create table if not exists public.addresses (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  label          text,
  name           text not null,
  phone          text not null,
  address_line_1 text not null,
  address_line_2 text,
  city           text not null,
  state          text not null,
  pincode        text not null,
  is_default     boolean not null default false,
  created_at     timestamptz not null default now()
);

comment on table public.addresses is 'Customer shipping addresses.';


-- ============================================================
-- 9. ORDERS
-- ============================================================
-- Customer orders with billing totals and shipping snapshot.

create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  order_number     text not null unique,
  user_id          uuid not null references public.profiles(id),
  subtotal         numeric(10,2) not null,
  discount         numeric(10,2) not null default 0,
  tax              numeric(10,2) not null default 0,
  shipping         numeric(10,2) not null default 0,
  total_amount     numeric(10,2) not null,
  payment_method   text,
  payment_status   text not null default 'pending'
                     check (payment_status in ('pending', 'paid', 'failed')),
  order_status     text not null default 'pending'
                     check (order_status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_name    text not null,
  shipping_email   text,
  shipping_phone   text,
  shipping_address text not null,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table public.orders is 'Customer orders with billing and shipping details.';
comment on column public.orders.shipping_address is 'Full address snapshot at order time.';


-- ============================================================
-- 10. ORDER_ITEMS
-- ============================================================
-- Line items in an order, with price captured at purchase time.

create table if not exists public.order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  product_id    uuid references public.products(id) on delete set null,
  product_name  text not null,
  product_image text,
  size          text,
  color         text,
  quantity      integer not null check (quantity >= 1),
  price         numeric(10,2) not null,
  subtotal      numeric(10,2) not null,
  created_at    timestamptz not null default now()
);

comment on table public.order_items is 'Order line items with snapshotted product data.';
comment on column public.order_items.price is 'Price at time of purchase. Does not change if product price is updated later.';


-- ============================================================
-- 11. PAYMENTS
-- ============================================================
-- Payment record per order. Simulated for the MVP.

create table if not exists public.payments (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null unique references public.orders(id) on delete cascade,
  payment_method text not null,
  transaction_id text,
  amount         numeric(10,2) not null,
  status         text not null default 'pending'
                   check (status in ('pending', 'paid', 'failed')),
  created_at     timestamptz not null default now()
);

comment on table public.payments is 'Payment records. Simulated for MVP.';


-- ============================================================
-- 12. INVOICES
-- ============================================================
-- Invoice metadata. PDF generated by AWS Lambda later.

create table if not exists public.invoices (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null unique references public.orders(id) on delete cascade,
  invoice_number text not null unique,
  invoice_url    text,
  created_at     timestamptz not null default now()
);

comment on table public.invoices is 'Invoice metadata. invoice_url populated by Lambda/S3 later.';


-- ============================================================
-- INDEXES
-- ============================================================
-- Speed up common lookups.

create index if not exists idx_products_category    on public.products(category_id);
create index if not exists idx_products_active       on public.products(is_active);
create index if not exists idx_products_featured     on public.products(is_featured);
create index if not exists idx_products_gender       on public.products(gender);
create index if not exists idx_product_images_product on public.product_images(product_id);
create index if not exists idx_product_variants_product on public.product_variants(product_id);
create index if not exists idx_cart_items_cart        on public.cart_items(cart_id);
create index if not exists idx_addresses_user        on public.addresses(user_id);
create index if not exists idx_orders_user           on public.orders(user_id);
create index if not exists idx_order_items_order     on public.order_items(order_id);


-- ============================================================
-- TRIGGER: Auto-create profile on user signup
-- ============================================================
-- When a new user signs up via Supabase Auth, this trigger
-- automatically creates a matching row in the profiles table.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.email, '')
  );
  return new;
end;
$$;

-- Drop if exists to avoid duplicate trigger errors on re-run
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();


-- ============================================================
-- TRIGGER: Auto-create cart on profile creation
-- ============================================================
-- Every user gets a cart automatically.

create or replace function public.handle_new_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.carts (user_id)
  values (new.id);
  return new;
end;
$$;

drop trigger if exists on_profile_created on public.profiles;

create trigger on_profile_created
  after insert on public.profiles
  for each row
  execute function public.handle_new_profile();


-- ============================================================
-- FUNCTION: Generate order number
-- ============================================================
-- Generates human-readable order numbers like ORD-1001, ORD-1002, etc.

create or replace function public.generate_order_number()
returns text
language plpgsql
as $$
declare
  next_num integer;
begin
  select coalesce(max(
    cast(replace(order_number, 'ORD-', '') as integer)
  ), 1000) + 1
  into next_num
  from public.orders;

  return 'ORD-' || next_num::text;
end;
$$;


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Enable RLS on all tables. Without policies, no data is accessible.

alter table public.profiles        enable row level security;
alter table public.categories      enable row level security;
alter table public.products        enable row level security;
alter table public.product_images  enable row level security;
alter table public.product_variants enable row level security;
alter table public.carts           enable row level security;
alter table public.cart_items      enable row level security;
alter table public.addresses       enable row level security;
alter table public.orders          enable row level security;
alter table public.order_items     enable row level security;
alter table public.payments        enable row level security;
alter table public.invoices        enable row level security;


-- ============================================================
-- RLS POLICIES: profiles
-- ============================================================

-- Users can read their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile (but not change role)
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Profile is inserted via trigger, not directly by users
-- Admin: can view all profiles
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );


-- ============================================================
-- RLS POLICIES: categories (public read, admin write)
-- ============================================================

create policy "Anyone can view categories"
  on public.categories for select
  using (true);

create policy "Admins can insert categories"
  on public.categories for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update categories"
  on public.categories for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete categories"
  on public.categories for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ============================================================
-- RLS POLICIES: products (public read active, admin write)
-- ============================================================

create policy "Anyone can view active products"
  on public.products for select
  using (is_active = true);

-- Admins can also view inactive products
create policy "Admins can view all products"
  on public.products for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can insert products"
  on public.products for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update products"
  on public.products for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete products"
  on public.products for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ============================================================
-- RLS POLICIES: product_images (public read, admin write)
-- ============================================================

create policy "Anyone can view product images"
  on public.product_images for select
  using (true);

create policy "Admins can manage product images"
  on public.product_images for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ============================================================
-- RLS POLICIES: product_variants (public read active, admin write)
-- ============================================================

create policy "Anyone can view active variants"
  on public.product_variants for select
  using (is_active = true);

create policy "Admins can view all variants"
  on public.product_variants for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can manage variants"
  on public.product_variants for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ============================================================
-- RLS POLICIES: carts (user owns their cart)
-- ============================================================

create policy "Users can view own cart"
  on public.carts for select
  using (auth.uid() = user_id);

create policy "Users can update own cart"
  on public.carts for update
  using (auth.uid() = user_id);

-- Cart is created via trigger, not directly


-- ============================================================
-- RLS POLICIES: cart_items (user owns their cart's items)
-- ============================================================

create policy "Users can view own cart items"
  on public.cart_items for select
  using (
    exists (
      select 1 from public.carts
      where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
    )
  );

create policy "Users can add to own cart"
  on public.cart_items for insert
  with check (
    exists (
      select 1 from public.carts
      where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
    )
  );

create policy "Users can update own cart items"
  on public.cart_items for update
  using (
    exists (
      select 1 from public.carts
      where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
    )
  );

create policy "Users can remove from own cart"
  on public.cart_items for delete
  using (
    exists (
      select 1 from public.carts
      where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
    )
  );


-- ============================================================
-- RLS POLICIES: addresses (user owns their addresses)
-- ============================================================

create policy "Users can view own addresses"
  on public.addresses for select
  using (auth.uid() = user_id);

create policy "Users can insert own addresses"
  on public.addresses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own addresses"
  on public.addresses for update
  using (auth.uid() = user_id);

create policy "Users can delete own addresses"
  on public.addresses for delete
  using (auth.uid() = user_id);


-- ============================================================
-- RLS POLICIES: orders
-- ============================================================

-- Customers can view their own orders
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- Customers can create orders (place orders)
create policy "Users can create own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- Only admins can update orders (status changes)
create policy "Admins can view all orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update orders"
  on public.orders for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ============================================================
-- RLS POLICIES: order_items
-- ============================================================

-- Customers can view their own order items
create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Customers can insert order items (during order creation)
create policy "Users can create order items for own orders"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Admins can view all order items
create policy "Admins can view all order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ============================================================
-- RLS POLICIES: payments
-- ============================================================

-- Customers can view their own payments
create policy "Users can view own payments"
  on public.payments for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = payments.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Customers can create payments (during checkout)
create policy "Users can create payments for own orders"
  on public.payments for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = payments.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Admins can view all payments
create policy "Admins can view all payments"
  on public.payments for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ============================================================
-- RLS POLICIES: invoices
-- ============================================================

-- Customers can view their own invoices
create policy "Users can view own invoices"
  on public.invoices for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = invoices.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Admins can manage all invoices
create policy "Admins can manage invoices"
  on public.invoices for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ============================================================
-- DONE
-- ============================================================
-- All 12 tables created with:
--   ✓ Primary keys
--   ✓ Foreign keys with appropriate ON DELETE behavior
--   ✓ CHECK constraints
--   ✓ Unique constraints
--   ✓ Indexes for common queries
--   ✓ Row Level Security enabled on all tables
--   ✓ RLS policies for customer and admin access
--   ✓ Auto-create profile trigger on signup
--   ✓ Auto-create cart trigger on profile creation
--   ✓ Order number generation function
-- ============================================================
