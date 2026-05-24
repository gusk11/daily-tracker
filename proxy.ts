import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'tracker_session';
const PUBLIC_ROUTES = ['/login', '/api/login'];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE_NAME);

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
