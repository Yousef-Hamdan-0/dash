import { type NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { routing } from './i18n/routing'
import { getSupabaseConfig } from './lib/supabase/config'
import { isAllowedAdminEmail } from './lib/validation'

const intlMiddleware = createIntlMiddleware(routing)
const locales = routing.locales as readonly string[]

function getDashboardRedirectPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length >= 2 && locales.includes(segments[0]) && segments[1] === 'dashboard') {
    return `/${segments.slice(1).join('/')}`
  }

  if (segments[0] !== 'dashboard') {
    return null
  }

  const lastSegment = segments.at(-1)

  if (
    lastSegment &&
    locales.includes(lastSegment) &&
    (segments.length === 2 || (segments.length === 3 && segments[1] === 'login'))
  ) {
    return `/${segments.slice(0, -1).join('/')}`
  }

  return null
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const dashboardRedirectPath = getDashboardRedirectPath(pathname)

  if (dashboardRedirectPath) {
    const url = request.nextUrl.clone()
    url.pathname = dashboardRedirectPath
    return NextResponse.redirect(url)
  }

  if (!pathname.startsWith('/dashboard')) {
    return intlMiddleware(request)
  }

  const supabaseConfig = getSupabaseConfig()

  if (!supabaseConfig) {
    return NextResponse.next({ request })
  }

  // Build initial pass-through response; Supabase may swap it with cookie updates
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    supabaseConfig.url,
    supabaseConfig.anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Write cookies into the request so downstream code sees them
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Rebuild the response with the updated request and write cookies into it
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() validates the JWT server-side (never trust getSession() in middleware)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Authenticated AND on the ADMIN_EMAILS allowlist (allowlist no-ops when unset)
  const isAdmin = !!user && isAllowedAdminEmail(user.email)

  if (!isAdmin && pathname !== '/dashboard/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard/login'
    return NextResponse.redirect(url)
  }
  if (isAdmin && pathname === '/dashboard/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Return supabaseResponse so auth cookies are correctly forwarded
  return supabaseResponse
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
