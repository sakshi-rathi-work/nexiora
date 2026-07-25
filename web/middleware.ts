import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';

  // Protected route matchers
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAuthRoute =
    pathname.startsWith('/login') || pathname.startsWith('/signup');

  // 1. Redirect unauthenticated users trying to access dashboard
  if (isDashboardRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirect logged-in users away from auth pages to dashboard
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};
