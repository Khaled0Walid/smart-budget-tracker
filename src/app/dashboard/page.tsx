// src/app/dashboard/page.tsx
import { createClient } from '@/utils/supabase/server'
import { signout } from '@/app/auth/actions'

// Dashboard page which is protected by our Middleware.
// If the user isn't logged in, they will be redirected to /login before they ever hit this component.
export default async function DashboardPage() {
  const supabase = await createClient()

  // Retrieve user data securely on the server
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-50 p-6">
      
      {/* Container card */}
      <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-md text-center">
        
        {/* Dynamic User Greeting */}
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          User Dashboard
        </h1>
        <p className="text-zinc-400 mb-6">
          Logged in as: <span className="font-mono text-emerald-400">{user?.email}</span>
        </p>

        <div className="rounded-lg bg-zinc-800/30 border border-zinc-800 p-6 mb-8 text-left space-y-3">
          <h2 className="text-lg font-semibold text-zinc-200">Phase 1 Status</h2>
          <p className="text-sm text-zinc-400">
            ✅ Next.js Scaffolding & Setup complete.<br />
            ✅ Supabase Auth Client/Server utilities integrated.<br />
            ✅ Middleware route protection and session verification active.<br />
            ✅ Signup / Login / Signout flows implemented.
          </p>
        </div>

        {/* Form submitting to our server-side signout action */}
        <form>
          <button
            formAction={signout}
            className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-6 py-2.5 text-sm font-semibold text-white transition-all cursor-pointer border border-zinc-700 hover:border-zinc-600 active:scale-[0.98]"
          >
            Sign Out
          </button>
        </form>

      </div>
    </div>
  )
}
