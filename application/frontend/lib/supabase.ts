// Creates and exports a reusable Supabase browser client for the Outty application.
// This reads the Supabase project URL and publishable API key from .env.local,
// then uses those values to initialize a browser client configured for SSR auth.

import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)