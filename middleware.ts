import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  const isAuthPage = ['/login', '/signup'].some(path =>
    request.nextUrl.pathname.includes(path)
  )
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
  
  if (user && !user.is_anonymous && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  if (isDashboard) {
    if (!user || user.is_anonymous) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
