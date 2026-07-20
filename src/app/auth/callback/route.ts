// src/app/auth/callback/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

// Route handler for GET requests to handle email confirmation redirects.
// When a user confirms their signup email, Supabase sends them back to our callback
// with a temporary authorization `code` in the URL query string.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // Custom destination redirect (defaults to /dashboard)
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    
    // Exchange the temporary code for a permanent session cookie
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Redirect successfully authenticated users to their dashboard/intended page
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If code is missing or exchange fails, redirect back to login with an error message
  return NextResponse.redirect(`${origin}/login?error=Could not verify auth session`)
}
