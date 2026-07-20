// src/app/dashboard/page.tsx
import { createClient } from '@/utils/supabase/server'
import { signout } from '@/app/auth/actions'
import { addTransaction } from '@/app/dashboard/actions'
import TransactionFilters from '@/app/dashboard/TransactionFilters'

export default async function DashboardPage() {
  // 1. Initialize Supabase Server Client
  const supabase = await createClient()

  // 2. Fetch the current logged-in user details securely
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 3. Fetch the transactions list for the user, ordered by date (most recent first)
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })

  // 4. Calculate total income, expenses, and net balance for summary cards
  let totalIncome = 0
  let totalExpenses = 0

  if (transactions) {
    transactions.forEach((tx) => {
      const amt = Number(tx.amount)
      if (tx.type === 'income') {
        totalIncome += amt
      } else {
        totalExpenses += amt
      }
    });
  }

  const netBalance = totalIncome - totalExpenses

  // Pre-defined categories for the transaction input form selector
  const categories = [
    'Food & Dining',
    'Rent & Housing',
    'Utilities & Bills',
    'Transportation',
    'Entertainment',
    'Salary & Income',
    'Shopping',
    'Healthcare',
    'Others',
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans">
      
      {/* HEADER BAR */}
      <header className="border-b border-zinc-800 bg-zinc-900/30 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-black text-lg shadow-md shadow-emerald-500/20">
              $
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Smart Budget Tracker</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-zinc-400 font-medium">
              {user?.email}
            </span>
            <form>
              <button
                formAction={signout}
                className="rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 px-4 py-1.5 text-sm font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* SUMMARY STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Net Balance */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <span className="block text-xs font-mono text-zinc-500 uppercase tracking-wider">Net Balance</span>
            <h2 className={`text-3xl font-bold tracking-tight mt-2 ${netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${netBalance.toFixed(2)}
            </h2>
          </div>

          {/* Card 2: Total Income */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
            <span className="block text-xs font-mono text-zinc-500 uppercase tracking-wider">Total Income</span>
            <h2 className="text-3xl font-bold tracking-tight mt-2 text-teal-400">
              +${totalIncome.toFixed(2)}
            </h2>
          </div>

          {/* Card 3: Total Expenses */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
            <span className="block text-xs font-mono text-zinc-500 uppercase tracking-wider">Total Expenses</span>
            <h2 className="text-3xl font-bold tracking-tight mt-2 text-rose-400">
              -${totalExpenses.toFixed(2)}
            </h2>
          </div>

        </div>

        {/* WORKSPACE: Form (Left) & Transaction List (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMN 1: ADD TRANSACTION FORM */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 h-fit backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-6">Log New Transaction</h2>
            
            <form action={addTransaction} className="space-y-5">
              
              {/* Type Toggle: Income vs Expense */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider">Type</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 rounded-lg border border-zinc-850">
                  <label className="flex items-center justify-center py-1.5 px-3 rounded-md text-sm font-semibold text-zinc-400 hover:text-zinc-200 cursor-pointer has-[:checked]:bg-emerald-500/10 has-[:checked]:text-emerald-400 transition-all">
                    <input type="radio" name="type" value="income" defaultChecked className="sr-only" />
                    Income
                  </label>
                  <label className="flex items-center justify-center py-1.5 px-3 rounded-md text-sm font-semibold text-zinc-400 hover:text-zinc-200 cursor-pointer has-[:checked]:bg-rose-500/10 has-[:checked]:text-rose-400 transition-all">
                    <input type="radio" name="type" value="expense" className="sr-only" />
                    Expense
                  </label>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label htmlFor="amount" className="block text-xs font-mono text-zinc-500 uppercase tracking-wider">Amount ($)</label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-zinc-50 placeholder-zinc-650 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>

              {/* Category Dropdown */}
              <div className="space-y-2">
                <label htmlFor="category" className="block text-xs font-mono text-zinc-500 uppercase tracking-wider">Category</label>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-zinc-50 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors cursor-pointer"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-xs font-mono text-zinc-500 uppercase tracking-wider">Description (Optional)</label>
                <input
                  id="description"
                  name="description"
                  type="text"
                  placeholder="e.g. Grocery shopping"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-zinc-50 placeholder-zinc-650 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>

              {/* Date Input */}
              <div className="space-y-2">
                <label htmlFor="date" className="block text-xs font-mono text-zinc-500 uppercase tracking-wider">Date</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-zinc-50 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 text-sm font-semibold text-black hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-emerald-500/10 mt-2"
              >
                Add Transaction
              </button>

            </form>
          </div>

          {/* COLUMN 2 & 3: TRANSACTION LIST (with filters & sorting) */}
          {/* This is now handled by our Client Component — TransactionFilters.
              The server fetches the full list, passes it as props, and the
              client component handles all interactive filtering/sorting in the browser. */}
          <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/10 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-6">Transactions</h2>

            {/* Show a fetch error if Supabase had a problem */}
            {error && (
              <div className="rounded-lg bg-rose-950/20 border border-rose-900/50 p-4 text-sm text-rose-400 mb-4">
                Failed to fetch transactions: {error.message}
              </div>
            )}

            {/* Empty state when no transactions at all */}
            {!transactions || transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-12 rounded-xl border border-dashed border-zinc-800">
                <div className="text-3xl mb-3">💸</div>
                <h3 className="text-sm font-medium text-zinc-300">No transactions logged yet</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-[240px]">
                  Get started by entering an income or expense using the form on the left.
                </p>
              </div>
            ) : (
              /* Pass the full transaction list and category list to the Client Component.
                 All filtering, sorting and delete actions happen inside TransactionFilters. */
              <TransactionFilters
                transactions={transactions}
                categories={categories}
              />
            )}
          </div>

        </div>

      </main>
    </div>
  )
}

