// src/app/auth/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// Server Action to handle logging in users with email & password
export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  // Authenticate with Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // If login fails, redirect back to login page with error query param
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // If successful, Middleware will handle dashboard redirect, but we also redirect explicitly
  redirect('/dashboard')
}

// Server Action to handle signing up new users
export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  // Register the user with Supabase
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Redirect back to our callback route after confirming their email
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    // If signup fails, redirect back to signup page with error query param
    redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }

  // Redirect to signup page with success query param to notify the user
  redirect('/signup?success=true')
}

// Server Action to handle logging out users
export async function signout() {
  const supabase = await createClient()
  
  // Clear the session cookies from Supabase
  await supabase.auth.signOut()
  
  // Send them back to the login screen
  redirect('/login')
}
