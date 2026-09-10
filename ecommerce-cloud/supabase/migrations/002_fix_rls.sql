-- ============================================================
-- LittleNest — RLS Fix Migration
-- 002_fix_rls.sql
-- ============================================================
-- This migration fixes two bugs in 001_initial_schema.sql:
--
-- BUG 1 (42P17): The "Admins can view all profiles" policy on
--   the profiles table queries public.profiles from within its
--   own RLS policy, causing infinite recursion. Every other
--   admin policy also sub-queries profiles, so any SELECT on
--   products/categories/etc. triggers the same recursion chain.
--
-- BUG 2 (42501): The migration did not GRANT base table-level
--   SELECT privileges to the anon/authenticated roles. RLS
--   policies control which rows are visible, but PostgreSQL
--   requires a base GRANT before RLS is even consulted.
--
-- FIX: Create a SECURITY DEFINER helper function is_admin()
--   that checks the profiles table with the *function owner's*
--   privileges (bypassing RLS). Then replace every admin policy
--   that previously did an inline sub-select on profiles with a
--   call to is_admin(). Also add GRANT SELECT for public-read
--   tables.
--
-- SAFETY: The function is SECURITY DEFINER but only returns a
--   boolean. It does not expose any row data. It uses
--   SET search_path = '' and fully-qualified table names to
--   prevent search_path injection attacks.
-- ============================================================


-- ============================================================
-- STEP 1: Create SECURITY DEFINER helper function
-- ============================================================
-- This function runs with the privileges of the function owner
-- (the role executing this CREATE FUNCTION statement, typically
-- the postgres superuser in Supabase). Because the owner is a
-- superuser, the SELECT inside the function bypasses RLS on
-- the profiles table, breaking the recursion chain.
--
-- STABLE: the result does not change within a single SQL
-- statement, which allows PostgreSQL to optimize repeated calls.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

comment on function public.is_admin() is
  'Returns true if the current authenticated user has the admin role. '
  'SECURITY DEFINER to bypass RLS on profiles and avoid policy recursion.';

-- Restrict execute to authenticated users only.
-- Anonymous users will always get false from auth.uid() anyway,
-- but we still need anon to be able to call the function because
-- PostgreSQL evaluates ALL applicable policies on a table (OR'd
-- together). When anon selects from products, the "Admins can
-- view all products" policy calls is_admin(), so anon must have
-- EXECUTE privilege — the function simply returns false for anon.
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;


-- ============================================================
-- STEP 2: Fix profiles policies
-- ============================================================
-- CHANGED: "Admins can view all profiles"
--   Old: used exists(select 1 from public.profiles p ...)
--        → self-referential → infinite recursion (42P17)
--   New: uses public.is_admin() which bypasses RLS via
--        SECURITY DEFINER, breaking the recursion.
--
-- UNCHANGED (not touched):
--   "Users can view own profile"  — uses auth.uid() = id
--   "Users can update own profile" — uses auth.uid() = id

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());


-- ============================================================
-- STEP 3: Fix categories policies
-- ============================================================
-- CHANGED: All three admin write policies.
--   Old: each did exists(select from profiles) which triggers
--        profiles RLS evaluation → recursion.
--   New: each calls public.is_admin().
--
-- UNCHANGED (not touched):
--   "Anyone can view categories" — uses (true), no profiles ref.

drop policy if exists "Admins can insert categories" on public.categories;
create policy "Admins can insert categories"
  on public.categories for insert
  with check (public.is_admin());

drop policy if exists "Admins can update categories" on public.categories;
create policy "Admins can update categories"
  on public.categories for update
  using (public.is_admin());

drop policy if exists "Admins can delete categories" on public.categories;
create policy "Admins can delete categories"
  on public.categories for delete
  using (public.is_admin());


-- ============================================================
-- STEP 4: Fix products policies
-- ============================================================
-- CHANGED: All four admin policies (select, insert, update, delete).
--   Old: each did exists(select from profiles) → recursion.
--   New: each calls public.is_admin().
--
-- UNCHANGED (not touched):
--   "Anyone can view active products" — uses is_active = true,
--   no profiles reference.

drop policy if exists "Admins can view all products" on public.products;
create policy "Admins can view all products"
  on public.products for select
  using (public.is_admin());

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
  on public.products for insert
  with check (public.is_admin());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
  on public.products for update
  using (public.is_admin());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
  on public.products for delete
  using (public.is_admin());


-- ============================================================
-- STEP 5: Fix product_images policies
-- ============================================================
-- CHANGED: "Admins can manage product images" (for all).
--   Old: exists(select from profiles) → recursion.
--   New: public.is_admin().
--
-- UNCHANGED (not touched):
--   "Anyone can view product images" — uses (true).

drop policy if exists "Admins can manage product images" on public.product_images;
create policy "Admins can manage product images"
  on public.product_images for all
  using (public.is_admin());


-- ============================================================
-- STEP 6: Fix product_variants policies
-- ============================================================
-- CHANGED: "Admins can view all variants" (select) and
--          "Admins can manage variants" (for all).
--   Old: exists(select from profiles) → recursion.
--   New: public.is_admin().
--
-- UNCHANGED (not touched):
--   "Anyone can view active variants" — uses is_active = true.

drop policy if exists "Admins can view all variants" on public.product_variants;
create policy "Admins can view all variants"
  on public.product_variants for select
  using (public.is_admin());

drop policy if exists "Admins can manage variants" on public.product_variants;
create policy "Admins can manage variants"
  on public.product_variants for all
  using (public.is_admin());


-- ============================================================
-- STEP 7: Fix orders policies
-- ============================================================
-- CHANGED: "Admins can view all orders" (select) and
--          "Admins can update orders" (update).
--   Old: exists(select from profiles) → recursion.
--   New: public.is_admin().
--
-- UNCHANGED (not touched):
--   "Users can view own orders"  — uses auth.uid() = user_id.
--   "Users can create own orders" — uses auth.uid() = user_id.

drop policy if exists "Admins can view all orders" on public.orders;
create policy "Admins can view all orders"
  on public.orders for select
  using (public.is_admin());

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
  on public.orders for update
  using (public.is_admin());


-- ============================================================
-- STEP 8: Fix order_items policies
-- ============================================================
-- CHANGED: "Admins can view all order items" (select).
--   Old: exists(select from profiles) → recursion.
--   New: public.is_admin().
--
-- UNCHANGED (not touched):
--   "Users can view own order items"            — refs orders.
--   "Users can create order items for own orders" — refs orders.

drop policy if exists "Admins can view all order items" on public.order_items;
create policy "Admins can view all order items"
  on public.order_items for select
  using (public.is_admin());


-- ============================================================
-- STEP 9: Fix payments policies
-- ============================================================
-- CHANGED: "Admins can view all payments" (select).
--   Old: exists(select from profiles) → recursion.
--   New: public.is_admin().
--
-- UNCHANGED (not touched):
--   "Users can view own payments"               — refs orders.
--   "Users can create payments for own orders"   — refs orders.

drop policy if exists "Admins can view all payments" on public.payments;
create policy "Admins can view all payments"
  on public.payments for select
  using (public.is_admin());


-- ============================================================
-- STEP 10: Fix invoices policies
-- ============================================================
-- CHANGED: "Admins can manage invoices" (for all).
--   Old: exists(select from profiles) → recursion.
--   New: public.is_admin().
--
-- UNCHANGED (not touched):
--   "Users can view own invoices" — refs orders.

drop policy if exists "Admins can manage invoices" on public.invoices;
create policy "Admins can manage invoices"
  on public.invoices for all
  using (public.is_admin());


-- ============================================================
-- STEP 11: GRANT base table-level SELECT for public-read tables
-- ============================================================
-- RLS policies control WHICH rows are visible, but PostgreSQL
-- requires a base GRANT before RLS is even consulted. Without
-- these grants the anon role gets 42501 "permission denied"
-- before any policy is evaluated.
--
-- Only granting SELECT on the four tables that have public-read
-- policies ("Anyone can view ..." / using(true) or using(is_active)).
-- Other tables (carts, orders, etc.) are accessed only by
-- authenticated users and will receive appropriate grants when
-- those features are implemented.

grant select on public.categories       to anon, authenticated;
grant select on public.products         to anon, authenticated;
grant select on public.product_images   to anon, authenticated;
grant select on public.product_variants to anon, authenticated;


-- ============================================================
-- DONE
-- ============================================================
-- Changes summary:
--   ✓ Created public.is_admin() SECURITY DEFINER helper
--   ✓ Replaced 16 admin RLS policies to use is_admin()
--   ✓ Added GRANT SELECT for 4 public-read tables
--   ✓ All policy names preserved
--   ✓ All access semantics preserved
--   ✓ No table/column/index/trigger changes
--   ✓ No data changes
-- ============================================================
