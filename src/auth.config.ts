import type { NextAuthConfig } from 'next-auth';

// Edge-safe config: no MongoDB adapter, no bcrypt, no Node-only APIs.
// Imported by middleware.ts (Edge Runtime) and extended in auth.ts (Node Runtime).
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      // Public routes that don't require authentication
      const publicRoutes = ['/login', '/register', '/api/register'];
      const isPublic = publicRoutes.some((r) => pathname === r || pathname.startsWith(r + '/'));

      if (!isLoggedIn && !isPublic && !pathname.startsWith('/api/auth')) {
        return false; // Redirects unauthenticated users to /login
      }

      if (isLoggedIn && (pathname === '/login' || pathname === '/register')) {
        return Response.redirect(new URL('/', request.nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
