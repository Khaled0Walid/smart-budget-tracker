// src/app/login/page.tsx
import Link from 'next/link'
import { login } from '@/app/auth/actions'

interface PageProps {
  searchParams: Promise<{ error?: string }>
}

// Next.js page component for the login route
export default async function LoginPage({ searchParams }: PageProps) {
  // In Next.js 15+, searchParams is a Promise and must be awaited before accessing its properties.
  const { error } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-50 p-6">
      
      {/* Container card with modern glassmorphism styling */}
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-md">
        
        {/* Header section with brand name and instruction */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">Smart Budget Tracker</h1>
          <p className="text-sm text-zinc-400 mt-2">Sign in to your account to continue</p>
        </div>

        {/* Display query-parameter errors (e.g. from failed authentication attempts) */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-950/50 border border-red-800 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Form submitting directly to our server-side login action */}
        <form className="space-y-6">
          
          {/* Email input field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-zinc-50 placeholder-zinc-500 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          {/* Password input field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-zinc-50 placeholder-zinc-500 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          {/* Submit button using server action login function */}
          <button
            formAction={login}
            className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 text-sm font-semibold text-black hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            Sign In
          </button>
        </form>

        {/* Navigation link to sign up page */}
        <div className="mt-6 text-center text-sm">
          <span className="text-zinc-400">Don't have an account? </span>
          <Link href="/signup" className="font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4">
            Sign up
          </Link>
        </div>

      </div>
    </div>
  )
}
