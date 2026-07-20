// src/utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Function to initialize and return a Supabase client that runs on the server.
// Since Next.js 15+ has asynchronous cookies, we await cookies() to retrieve the request cookies.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Retrieve cookies sent from the browser to read session state
        getAll() {
          return cookieStore.getAll()
        },
        // Write cookie updates (like session refreshes) to send back to the browser.
        // This setAll try-catch block is required because Server Components are read-only
        // and cannot modify outgoing response headers directly.
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Safe to ignore: middleware will handle refreshing the token
          }
        },
      },
    }
  )
}
