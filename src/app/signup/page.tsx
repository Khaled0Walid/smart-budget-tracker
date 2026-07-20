// src/app/signup/page.tsx
import Link from 'next/link'
import { signup } from '@/app/auth/actions'

interface PageProps {
  searchParams: Promise<{ error?: string; success?: string }>
}

// Next.js page component for the signup route
export default async function SignupPage({ searchParams }: PageProps) {
  // In Next.js 15+, searchParams is a Promise and must be awaited before accessing its properties.
  const { error, success } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-50 p-6">
      
      {/* Container card with modern glassmorphism styling */}
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-md">
        
        {/* Header section with brand name and instruction */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">Create an Account</h1>
          <p className="text-sm text-zinc-400 mt-2">Get started with Smart Budget Tracker</p>
        </div>

        {/* Display query-parameter errors (e.g. from failed registration attempts) */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-950/50 border border-red-800 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Display success messages (e.g. email confirmation sent) */}
        {success === 'true' && (
          <div className="mb-6 rounded-lg bg-emerald-950/50 border border-emerald-800 p-4 text-sm text-emerald-400">
            Registration successful! Please check your email to confirm your account and sign in.
          </div>
        )}

        {/* Form submitting directly to our server-side signup action */}
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
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-zinc-50 placeholder-zinc-500 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          {/* Submit button using server action signup function */}
          <button
            formAction={signup}
            className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 text-sm font-semibold text-black hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            Sign Up
          </button>
        </form>

        {/* Navigation link to sign in page */}
        <div className="mt-6 text-center text-sm">
          <span className="text-zinc-400">Already have an account? </span>
          <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  )
}
