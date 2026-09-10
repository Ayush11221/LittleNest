-- Fixes "permission denied for table profiles" (and any other table)
-- for logged-in users. The `authenticated` Postgres role had no table
-- grants at all, so every authenticated read/write was silently denied
-- regardless of RLS policies — RLS only restricts rows a grant already
-- allows access to, it doesn't substitute for the grant itself.
-- Run this once in Supabase SQL Editor.

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO authenticated;

-- Also cover anon, in case the same gap exists on tables anon hasn't
-- touched yet (categories/products already worked, but this is cheap
-- insurance against the same bug resurfacing on another table).
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
