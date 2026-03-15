// Creates and exports a reusable Supabase client for the Outty application.
// This reads the Supabase project URL and publishable API key from .env.local, then uses those values to initialize the connection.
// Other files can import `supabase` from this file to interact with Supabase services such as authentication / database queries.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
