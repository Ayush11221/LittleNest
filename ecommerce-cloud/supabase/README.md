# Supabase Setup — LittleNest

This document explains how to connect the LittleNest baby clothing store to Supabase.

## What is Supabase?

Supabase is an open-source backend platform that provides:
- **PostgreSQL database** — a relational SQL database (similar to MySQL)
- **Authentication** — email/password signup, login, and session management
- **Row Level Security (RLS)** — database-level access control

We use Supabase instead of building our own backend server. The React frontend talks directly to Supabase using the `@supabase/supabase-js` client library.

---

## Step 1: Find Your Credentials

1. Go to [supabase.com](https://supabase.com) and open your project
2. Click **Project Settings** (gear icon in left sidebar)
3. Click **API**

You need two values:

| Setting | Where to find it | Environment variable |
|---------|-----------------|---------------------|
| **Project URL** | Under "Project URL" | `VITE_SUPABASE_URL` |
| **anon / public key** | Under "Project API Keys" → `anon` `public` | `VITE_SUPABASE_PUBLISHABLE_KEY` |

### ⚠️ IMPORTANT: service_role key

You will also see a **service_role** key on the same page. This key has **full admin access** to your database and bypasses all Row Level Security.

**NEVER put the service_role key in your React code.**

It should only be used in server-side code (e.g., AWS Lambda) if needed.

---

## Step 2: Create Your `.env` File

In the `ecommerce-cloud/` directory:

```bash
cp .env.example .env
```

Then edit `.env` and paste your values:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_API_URL=
```

The `.env` file is in `.gitignore` and will NOT be committed to Git.

---

## Step 3: Run the Database Migration

The migration creates all 12 database tables.

1. Open your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `supabase/migrations/001_initial_schema.sql` from this project
5. Copy the entire contents and paste into the SQL Editor
6. Click **Run**

If successful, you should see no errors. You can verify by going to **Table Editor** in the left sidebar — you should see all 12 tables.

### What the migration creates

| Table | Purpose |
|-------|---------|
| `profiles` | User data (extends Supabase Auth) |
| `categories` | Baby clothing categories |
| `products` | Product information |
| `product_images` | Multiple images per product |
| `product_variants` | Size/color combos with individual stock |
| `carts` | One cart per user |
| `cart_items` | Items in a cart |
| `addresses` | Saved shipping addresses |
| `orders` | Customer orders |
| `order_items` | Items in an order (with price snapshot) |
| `payments` | Payment records |
| `invoices` | Invoice metadata |

It also creates:
- **Triggers** that automatically create a `profiles` row and a `carts` row when a new user signs up
- **Row Level Security policies** on every table
- **Indexes** for faster queries
- A helper function for generating order numbers

---

## Step 4: Run the Seed Data

After the migration completes:

1. Stay in **SQL Editor**
2. Click **New Query**
3. Open `supabase/seed.sql`
4. Copy, paste, and **Run**

This adds:
- 9 baby clothing categories
- 9 sample products with realistic descriptions
- 37 size/color variants with stock
- Sample product images (placeholder URLs)

---

## Row Level Security (RLS) — Quick Explanation

RLS is how Supabase controls who can read/write data. Think of it as database-level permissions.

Without RLS, anyone with the `anon` key could read or modify any table. With RLS enabled:

- **Public data** (categories, active products) → anyone can read
- **User data** (cart, addresses, orders) → each user can only see their own
- **Admin data** (product management, all orders) → only users with `role = 'admin'`

Every query from the React frontend automatically includes the logged-in user's identity. Supabase checks the RLS policies before returning data.

Example: when a customer calls `supabase.from('orders').select('*')`, they only get back their own orders — not everyone's orders. This is enforced at the database level, not in React code.

---

## How the Supabase Client Works in React

The client is in `src/lib/supabaseClient.js`:

```js
import { supabase } from '../lib/supabaseClient';

// Example: fetch all active products
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('is_active', true);
```

This is similar to a Firebase SDK call, but instead of Firestore documents, you get PostgreSQL rows with SQL-like filtering.

---

## Common Supabase Concepts (vs Firebase)

| Firebase | Supabase | Notes |
|----------|----------|-------|
| `doc('users/123')` | `.from('profiles').select().eq('id', '123')` | Query by ID |
| `collection('products')` | `.from('products').select()` | Get all rows |
| `where('price', '<=', 1000)` | `.lte('price', 1000)` | Filter |
| `orderBy('created_at')` | `.order('created_at')` | Sort |
| Firestore Rules | Row Level Security (RLS) | Access control |
| `onSnapshot()` | `.subscribe()` (Realtime) | Live updates |

---

## Troubleshooting

**"Missing Supabase environment variables"** in console
→ You haven't created `.env` or the values are empty. Copy `.env.example` to `.env` and fill in your credentials.

**"permission denied for table ..."**
→ RLS is working correctly but the user doesn't have access. Check that the user is logged in and the RLS policies allow the operation.

**Tables don't appear in Table Editor**
→ Make sure you ran the migration SQL without errors. Check the SQL Editor output for any error messages.
