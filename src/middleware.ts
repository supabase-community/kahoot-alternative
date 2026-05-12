import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isHostRoute = pathname.startsWith('/host')
  const cookie = isHostRoute ? 'hyf_host' : 'hyf_client'
  const authed = request.cookies.get(cookie)?.value === '1'

  if (!authed) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!login|_next/static|_next/image|favicon.ico).*)'],
}
