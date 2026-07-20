'use client'
// src/app/dashboard/TransactionFilters.tsx
// This is a CLIENT COMPONENT (note 'use client' at the top).
// It lives in the browser and handles all interactive filter/sort logic.
// The server sends the full transaction list once; this component filters it locally.

import { useState, useMemo } from 'react'
import { deleteTransaction } from '@/app/dashboard/actions'

// TypeScript type describing the shape of a single transaction row
type Transaction = {
  id: string
  amount: number
  category: string
  description: string | null
  date: string
  type: 'income' | 'expense'
  is_recurring: boolean
  created_at: string
}

type Props = {
  // The full, unfiltered list passed down from the Server Component
  transactions: Transaction[]
  // The list of category options, also passed from the server
  categories: string[]
}

export default function TransactionFilters({ transactions, categories }: Props) {
  // ─── FILTER STATE ──────────────────────────────────────────────
  // useState stores the current value of each filter control.
  // When a user clicks "Expense", React re-renders just this component
  // with the new state value — no page reload needed.

  // Filter by transaction type: 'all' | 'income' | 'expense'
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all')

  // Filter by category: '' means show all categories
  const [categoryFilter, setCategoryFilter] = useState('')

  // Filter by date range: from and to fields
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // ─── SORT STATE ────────────────────────────────────────────────
  // Sort by which column: 'date' | 'amount'
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  // Sort direction: 'desc' = newest/largest first, 'asc' = oldest/smallest first
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc')

  // ─── COMPUTED / DERIVED DATA ───────────────────────────────────
  // useMemo recalculates the filtered+sorted list ONLY when its dependencies change.
  // This avoids re-running the filter logic on every keystroke that's unrelated.
  const filtered = useMemo(() => {
    let result = [...transactions]

    // 1. Filter by type (income / expense / all)
    if (typeFilter !== 'all') {
      result = result.filter((tx) => tx.type === typeFilter)
    }

    // 2. Filter by category (only if a category is selected)
    if (categoryFilter) {
      result = result.filter((tx) => tx.category === categoryFilter)
    }

    // 3. Filter by date range (only if dates are set)
    if (dateFrom) {
      result = result.filter((tx) => tx.date >= dateFrom)
    }
    if (dateTo) {
      result = result.filter((tx) => tx.date <= dateTo)
    }

    // 4. Sort the filtered result
    result.sort((a, b) => {
      if (sortBy === 'date') {
        // String comparison works for ISO dates (YYYY-MM-DD)
        return sortDir === 'desc'
          ? b.date.localeCompare(a.date)
          : a.date.localeCompare(b.date)
      } else {
        // Numeric comparison for amount
        return sortDir === 'desc'
          ? Number(b.amount) - Number(a.amount)
          : Number(a.amount) - Number(b.amount)
      }
    })

    return result
  }, [transactions, typeFilter, categoryFilter, dateFrom, dateTo, sortBy, sortDir])

  // Helper to toggle sort direction when clicking the same column header
  function handleSort(column: 'date' | 'amount') {
    if (sortBy === column) {
      // Same column clicked → flip direction
      setSortDir((prev) => (prev === 'desc' ? 'asc' : 'desc'))
    } else {
      // New column clicked → switch to it, default to descending
      setSortBy(column)
      setSortDir('desc')
    }
  }

  // Icon helper for sort direction arrows
  function SortIcon({ column }: { column: 'date' | 'amount' }) {
    if (sortBy !== column) return <span className="text-zinc-700 ml-1">↕</span>
    return <span className="text-emerald-400 ml-1">{sortDir === 'desc' ? '↓' : '↑'}</span>
  }

  // Compute totals from the FILTERED list so the summary reflects current filters
  const filteredIncome = filtered.reduce(
    (sum, tx) => (tx.type === 'income' ? sum + Number(tx.amount) : sum), 0
  )
  const filteredExpenses = filtered.reduce(
    (sum, tx) => (tx.type === 'expense' ? sum + Number(tx.amount) : sum), 0
  )

  return (
    <div className="space-y-5">

      {/* ── FILTER CONTROLS BAR ── */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-4">
        <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Filters & Sort</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

          {/* Type Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs text-zinc-500">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'all' | 'income' | 'expense')}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs text-zinc-500">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div className="space-y-1.5">
            <label className="block text-xs text-zinc-500">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          {/* Date To */}
          <div className="space-y-1.5">
            <label className="block text-xs text-zinc-500">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

        </div>

        {/* Reset Filters Button — only visible if any filter is active */}
        {(typeFilter !== 'all' || categoryFilter || dateFrom || dateTo) && (
          <button
            onClick={() => {
              setTypeFilter('all')
              setCategoryFilter('')
              setDateFrom('')
              setDateTo('')
            }}
            className="text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* ── FILTER SUMMARY MINI STATS ── */}
      {(typeFilter !== 'all' || categoryFilter || dateFrom || dateTo) && (
        <div className="flex flex-wrap gap-4 text-sm px-1">
          <span className="text-zinc-500">
            Showing <span className="font-semibold text-zinc-200">{filtered.length}</span> of {transactions.length} transactions
          </span>
          <span className="text-teal-400">+${filteredIncome.toFixed(2)} income</span>
          <span className="text-rose-400">-${filteredExpenses.toFixed(2)} expenses</span>
        </div>
      )}

      {/* ── TRANSACTION TABLE ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 rounded-xl border border-dashed border-zinc-800">
          <div className="text-3xl mb-3">🔍</div>
          <h3 className="text-sm font-medium text-zinc-300">No results match your filters</h3>
          <p className="text-xs text-zinc-500 mt-1">Try adjusting or clearing the filters above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-500 text-xs font-mono uppercase">
                
                {/* Clickable date column header for sorting */}
                <th
                  className="py-3 px-4 font-normal cursor-pointer hover:text-zinc-300 transition-colors select-none"
                  onClick={() => handleSort('date')}
                >
                  Date <SortIcon column="date" />
                </th>
                <th className="py-3 px-4 font-normal">Type</th>
                <th className="py-3 px-4 font-normal">Category</th>
                <th className="py-3 px-4 font-normal">Description</th>

                {/* Clickable amount column header for sorting */}
                <th
                  className="py-3 px-4 font-normal text-right cursor-pointer hover:text-zinc-300 transition-colors select-none"
                  onClick={() => handleSort('amount')}
                >
                  Amount <SortIcon column="amount" />
                </th>
                <th className="py-3 px-4 font-normal text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-sm">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-900/20 group transition-colors">

                  {/* Date */}
                  <td className="py-3.5 px-4 font-mono text-xs text-zinc-400 whitespace-nowrap">
                    {tx.date}
                  </td>

                  {/* Type badge */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold
                      ${tx.type === 'income'
                        ? 'bg-teal-500/10 text-teal-400'
                        : 'bg-rose-500/10 text-rose-400'
                      }`}>
                      {tx.type === 'income' ? '↑ Income' : '↓ Expense'}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 font-medium text-zinc-200 whitespace-nowrap">
                    {tx.category}
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4 text-zinc-400 italic max-w-xs truncate">
                    {tx.description || '—'}
                  </td>

                  {/* Amount — colored by type */}
                  <td className={`py-3.5 px-4 font-semibold text-right whitespace-nowrap
                    ${tx.type === 'income' ? 'text-teal-400' : 'text-rose-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                  </td>

                  {/* Delete Button — wired to the Server Action via a form */}
                  <td className="py-3.5 px-4 text-center">
                    <form action={deleteTransaction.bind(null, tx.id)}>
                      <button
                        type="submit"
                        className="rounded border border-zinc-800 hover:bg-rose-950/30 hover:border-rose-900 px-2.5 py-1 text-xs font-medium text-zinc-500 hover:text-rose-400 transition-all cursor-pointer opacity-60 group-hover:opacity-100"
                      >
                        Delete
                      </button>
                    </form>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
