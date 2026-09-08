'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { BookOpen, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password) { setError('All fields are required.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setSuccess(true);
      // Auto-sign in after registration
      await signIn('credentials', { email, password, redirect: false });
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl: '/' });
  }

  const passwordStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ['transparent', '#EF4444', '#F59E0B', '#10B981'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];

  return (
    <main className="auth-page" role="main">
      <div className="auth-bg-decoration" aria-hidden="true">
        <div className="auth-bg-circle" />
        <div className="auth-bg-circle" />
      </div>

      <div className="auth-card" style={{ maxWidth: 460 }}>
        <div className="auth-logo">
          <div className="auth-logo-icon" aria-hidden="true">
            <BookOpen size={28} color="white" strokeWidth={2} />
          </div>
          <div className="auth-logo-text">Teacher&apos;<span>sDesk</span></div>
          <div className="auth-tagline">Create your free teacher account</div>
        </div>

        <h1 className="auth-title">Get started</h1>
        <p className="auth-subtitle">Set up your account and start managing your classroom</p>

        {error && (
          <div className="auth-error" role="alert" style={{ marginBottom: 'var(--space-4)' }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: 'var(--color-success-bg)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '0.875rem', color: 'var(--color-success)', display: 'flex', gap: 8, alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <CheckCircle size={15} /> Account created! Signing you in...
          </div>
        )}

        {/* Google Sign Up */}
        <button
          id="btn-google-signup"
          type="button"
          className="btn btn-google"
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          aria-label="Sign up with Google"
        >
          {googleLoading ? (
            <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Connecting...</>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </>
          )}
        </button>

        <div className="auth-divider"><span>or create account with email</span></div>

        <form className="auth-form" onSubmit={handleRegister} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
              <input id="reg-name" name="name" type="text" className="form-input" placeholder="Your full name" value={form.name} onChange={handleChange} style={{ paddingLeft: 40 }} autoComplete="name" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
              <input id="reg-email" name="email" type="email" className="form-input" placeholder="you@school.edu" value={form.email} onChange={handleChange} style={{ paddingLeft: 40 }} autoComplete="email" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
              <input
                id="reg-password"
                name="password"
                type={showPwd ? 'text' : 'password'}
                className="form-input"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={handleChange}
                style={{ paddingLeft: 40, paddingRight: 42 }}
                autoComplete="new-password"
                required
              />
              <button type="button" id="toggle-reg-pwd" aria-label="Toggle password visibility" onClick={() => setShowPwd(v => !v)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.password.length > 0 && (
              <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i <= passwordStrength ? strengthColors[passwordStrength] : 'var(--color-border)', transition: 'background 0.3s' }} />
                ))}
                <span style={{ fontSize: '0.75rem', color: strengthColors[passwordStrength], fontWeight: 600, minWidth: 40 }}>
                  {strengthLabels[passwordStrength]}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
              <input id="reg-confirm" name="confirmPassword" type={showPwd ? 'text' : 'password'} className="form-input" placeholder="Repeat your password" value={form.confirmPassword} onChange={handleChange} style={{ paddingLeft: 40 }} autoComplete="new-password" required />
            </div>
          </div>

          <button id="btn-register" type="submit" className="btn btn-primary btn-full" disabled={loading || googleLoading}>
            {loading ? (
              <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Creating Account...</>
            ) : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link href="/login" id="link-login">Sign in here</Link>
        </div>
      </div>
    </main>
  );
}
