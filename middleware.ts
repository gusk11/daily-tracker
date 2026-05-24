import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'tracker_session';
const PUBLIC_ROUTES = ['/login', '/api/login'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // API Routes zulassen
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Public Routes zulassen
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Session überprüfen
  const session = request.cookies.get(SESSION_COOKIE_NAME);

  if (!session) {
    // Zu Login umleiten
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|.*\\..*|$).*)'],
};
