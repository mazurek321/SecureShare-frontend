import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/files') || request.nextUrl.pathname.startsWith('/api/admin')) {
    const token = request.cookies.get('auth_token')?.value

    if (token) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('Authorization', `Bearer ${token}`)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/files/:path*', '/api/admin/:path*'],
}