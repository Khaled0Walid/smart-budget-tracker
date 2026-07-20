// src/utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

// Function to initialize and return a Supabase client that runs in the browser.
// This uses public environment variables which are safe to expose to the client.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
