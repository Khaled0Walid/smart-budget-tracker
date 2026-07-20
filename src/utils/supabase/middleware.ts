// src/utils/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// This function intercepts requests to refresh user sessions and handle auth routing.
export async function updateSession(request: NextRequest) {
  // Create a default response which allows the request to continue as-is
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Set up the Supabase client using cookie helpers that link browser request cookies
  // to the outgoing response headers.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Update the cookies on the incoming request so downstream code gets the fresh session
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          // Re-create the next response with the updated request state
          supabaseResponse = NextResponse.next({
            request,
          })
          // Set the cookies on the outgoing response so they are saved in the browser
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Always use supabase.auth.getUser() instead of supabase.auth.getSession().
  // getUser() sends a network request to verify the session JWT is actually valid and hasn't been forged/tampered with.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ROUTING PROTECTION LOGIC:
  
  // 1. Unauthenticated users trying to access protected dashboard/settings pages
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/signup') &&
    request.nextUrl.pathname !== '/'
  ) {
    // Redirect them to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. Authenticated users trying to access login, signup, or public home landing page
  if (
    user &&
    (request.nextUrl.pathname.startsWith('/login') ||
     request.nextUrl.pathname.startsWith('/signup') ||
     request.nextUrl.pathname === '/')
  ) {
    // Redirect them directly to their dashboard
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Return the response (possibly containing updated session cookies)
  return supabaseResponse
}
