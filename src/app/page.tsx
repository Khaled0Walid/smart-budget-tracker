// src/app/page.tsx

export default function Home() {
  return (
    // Outer container centering the page and setting up a full-screen layout.
    // We use a modern, sleek dark background (bg-zinc-950) and white text (text-zinc-50) for premium styling.
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-50 font-sans p-6">
      
      {/* Main card wrapper using glassmorphism borders and high-quality dark styling */}
      <main className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-md text-center">
        
        {/* Subtle, beautiful gradient badge for the app branding */}
        <div className="mx-auto mb-4 w-fit rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-black">
          Foundation Ready
        </div>

        {/* App Title */}
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-3">
          Smart Budget Tracker
        </h1>

        {/* Short, elegant description about the current status */}
        <p className="text-zinc-400 text-base sm:text-lg mb-8 max-w-md mx-auto leading-relaxed">
          Welcome to your new personal finance dashboard. The Next.js framework has been scaffolded and the project skeleton is ready.
        </p>

        {/* Quick info grid showing the stack choices */}
        <div className="grid grid-cols-2 gap-4 text-left border-t border-zinc-800 pt-6">
          <div>
            <span className="block text-xs text-zinc-500 uppercase font-mono">Framework</span>
            <span className="text-sm font-medium text-zinc-300">Next.js 15 (App Router)</span>
          </div>
          <div>
            <span className="block text-xs text-zinc-500 uppercase font-mono">Styling</span>
            <span className="text-sm font-medium text-zinc-300">Tailwind CSS v4</span>
          </div>
          <div>
            <span className="block text-xs text-zinc-500 uppercase font-mono">Language</span>
            <span className="text-sm font-medium text-zinc-300">TypeScript</span>
          </div>
          <div>
            <span className="block text-xs text-zinc-500 uppercase font-mono">Database</span>
            <span className="text-sm font-medium text-zinc-300">Supabase (Pending)</span>
          </div>
        </div>

      </main>
    </div>
  );
}

