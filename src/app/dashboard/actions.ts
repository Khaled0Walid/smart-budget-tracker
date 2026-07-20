// src/app/dashboard/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Server Action to add a new transaction to the database
export async function addTransaction(formData: FormData) {
  // 1. Initialize our Supabase Server Client
  const supabase = await createClient()

  // 2. Extract inputs from the form submission
  const rawAmount = formData.get('amount') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const date = formData.get('date') as string
  const type = formData.get('type') as 'income' | 'expense'

  // 3. Validation: Make sure the amount is parsed as a decimal number
  const amount = parseFloat(rawAmount)
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Please enter a valid amount greater than 0.')
  }

  // 4. Validate the transaction type
  if (type !== 'income' && type !== 'expense') {
    throw new Error('Transaction type must be either income or expense.')
  }

  // 5. Build our database record payload.
  // Note: user_id is omitted here because our Supabase default policy 'auth.uid()'
  // automatically handles inserting the logged-in user's UUID.
  const payload: {
    amount: number
    category: string
    description: string | null
    type: 'income' | 'expense'
    date?: string
  } = {
    amount,
    category: category.trim(),
    description: description ? description.trim() : null,
    type,
  }

  // If a date is provided, add it to the payload; otherwise, let Postgres use CURRENT_DATE
  if (date) {
    payload.date = date
  }

  // 6. Execute insert query in Supabase
  const { error } = await supabase.from('transactions').insert([payload])

  if (error) {
    throw new Error(`Failed to save transaction: ${error.message}`)
  }

  // 7. Clear the Next.js cache for the dashboard so the UI fetches fresh data
  revalidatePath('/dashboard')
}

// Server Action to delete an existing transaction
export async function deleteTransaction(id: string) {
  // 1. Initialize our Supabase Server Client
  const supabase = await createClient()

  // 2. Delete the row where the ID matches.
  // The database RLS policy will automatically verify that this transaction
  // belongs to the currently authenticated user before performing the delete.
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete transaction: ${error.message}`)
  }

  // 3. Revalidate the page to show the updated list immediately
  revalidatePath('/dashboard')
}

// Server Action to update an existing transaction
export async function updateTransaction(id: string, formData: FormData) {
  // 1. Initialize our Supabase Server Client
  const supabase = await createClient()

  // 2. Extract inputs from the form
  const rawAmount = formData.get('amount') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const date = formData.get('date') as string
  const type = formData.get('type') as 'income' | 'expense'

  // 3. Validation: Convert amount to number
  const amount = parseFloat(rawAmount)
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Please enter a valid amount greater than 0.')
  }

  // 4. Update the record where the ID matches
  const { error } = await supabase
    .from('transactions')
    .update({
      amount,
      category: category.trim(),
      description: description ? description.trim() : null,
      type,
      date: date || undefined,
    })
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to update transaction: ${error.message}`)
  }

  // 5. Revalidate the page cache
  revalidatePath('/dashboard')
}
