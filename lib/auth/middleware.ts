'use server'

import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function protectRoute(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || user.is_anonymous) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return null
}
