'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { BookOpen, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError('Invalid email or password. Please try again.');
    } else {
      router.push('/');
      router.refresh();
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    setError('');
    await signIn('google', { callbackUrl: '/' });
  }

  return (
    <main className="auth-page" role="main">
      {/* Background decorations */}
      <div className="auth-bg-decoration" aria-hidden="true">
        <div className="auth-bg-circle" />
        <div className="auth-bg-circle" />
      </div>

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon" aria-hidden="true">
            <BookOpen size={28} color="white" strokeWidth={2} />
          </div>
          <div className="auth-logo-text">Teacher&apos;<span>sDesk</span></div>
          <div className="auth-tagline">Your smart classroom companion</div>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your teacher account to continue</p>

        {error && (
          <div className="auth-error" role="alert">
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            {error}
          </div>
        )}

        {/* Google Sign In */}
        <button
          id="btn-google-signin"
          type="button"
          className="btn btn-google"
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          aria-label="Continue with Google"
        >
          {googleLoading ? (
            <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Connecting to Google...</>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        <div className="auth-divider"><span>or sign in with email</span></div>

        {/* Email/Password Form */}
        <form className="auth-form" onSubmit={handleCredentials} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="you@school.edu"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                style={{ paddingLeft: 40 }}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
              <input
                id="login-password"
                type={showPwd ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                style={{ paddingLeft: 40, paddingRight: 42 }}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                id="toggle-password-btn"
                aria-label={showPwd ? 'Hide password' : 'Show password'}
                onClick={() => setShowPwd(v => !v)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            id="btn-login"
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading || googleLoading}
          >
            {loading ? (
              <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing in...</>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link href="/register" id="link-register">Create one free</Link>
        </div>
      </div>
    </main>
  );
}
