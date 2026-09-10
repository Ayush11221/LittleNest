import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Missing Supabase environment variables. ' +
    'Copy .env.example to .env and fill in your Supabase project credentials.'
  );
}

// createClient() throws synchronously on an invalid URL, which would crash
// the whole app before it can render any UI (including the pages that don't
// need Supabase). Fall back to a placeholder URL so the app still mounts;
// every real request will then fail gracefully into the existing
// loading/error states instead of a blank screen.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-anon-key'
);
