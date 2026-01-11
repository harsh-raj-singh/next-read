import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options
          })
          supabaseResponse = NextResponse.next({
            request
          })
          supabaseResponse.cookies.set({
            name,
            value,
            ...options
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options
          })
          supabaseResponse = NextResponse.next({
            request
          })
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options
          })
        }
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const isAuthPage = ['/login', '/signup'].some(path =>
    request.nextUrl.pathname.includes(path)
  )
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
  
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  if (isDashboard) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return supabaseResponse
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
