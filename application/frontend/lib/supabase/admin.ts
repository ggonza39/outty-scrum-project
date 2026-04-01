// Creates and exports a reusable Supabase admin client for the Outty application.
// This reads the Supabase project URL and service role key from environment variables, then uses those values to initialize a server-only client for trusted backend operations.

import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}