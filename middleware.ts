import NextAuth from 'next-auth';
import { authConfig } from './src/auth.config';

// Uses the edge-safe config only — no MongoDB adapter, no bcrypt.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|banner.png).*)'],
};
