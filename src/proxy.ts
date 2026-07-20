// src/proxy.ts
import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

// Next.js 16+ entrypoint proxy that runs on matching routes.
// Replaces the deprecated middleware.ts convention.
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  // Define which paths this proxy runs on.
  // We match all paths EXCEPT internal Next.js paths (_next/static, _next/image),
  // favicon.ico, and static assets (images, icons, WebP, etc.)
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
