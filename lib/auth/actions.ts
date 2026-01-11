'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function signIn(formData: FormData) {
  try {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      return { error: error.message }
    }
    
    revalidatePath('/')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Sign in error:', error)
    return { error: 'An unexpected error occurred during sign in' }
  }
}

export async function signUp(formData: FormData) {
  try {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    if (password.length < 8) {
      return { error: 'Password must be at least 8 characters' }
    }
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || 'http://localhost:3000'
    const fullSiteUrl = siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${fullSiteUrl}/auth-callback`
      }
    })
    
    if (error) {
      return { error: error.message }
    }
    
    revalidatePath('/')
    revalidatePath('/dashboard')
    
    if (data.session) {
      return { success: true, autoConfirmed: true }
    }
    
    return { success: true, autoConfirmed: false }
  } catch (error) {
    console.error('Sign up error:', error)
    return { error: 'An unexpected error occurred during sign up' }
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}
