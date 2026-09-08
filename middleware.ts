import { auth } from './src/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Public routes that don't need auth
  const publicRoutes = ['/login', '/register'];
  const isPublic = publicRoutes.some(r => pathname.startsWith(r));

  // Redirect to login if accessing protected route without auth
  if (!isLoggedIn && !isPublic && !pathname.startsWith('/api/auth')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect to dashboard if already logged in and visiting auth pages
  if (isLoggedIn && isPublic) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|banner.png).*)'],
};
