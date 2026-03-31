import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export async function middleware(request: NextRequest) {
  console.log('middleware hit:', request.nextUrl.pathname)
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/match',
    '/match/:path*',
    '/profile-setup',
    '/profile-setup/:path*',
  ],
}