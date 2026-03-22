import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Password strength helper
const getStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
};

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', 'bg-danger', 'bg-accent3', 'bg-accent2', 'bg-accent2'];

export default function SignUpPage() {
  const navigate = useNavigate();
  const { register, googleSignIn } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const googleBtnRef = useRef(null);

  const strength = getStrength(form.password);

  // Initialize Google Identity Services
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') return;

    const initGoogle = () => {
      if (!window.google) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
        auto_select: false,
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'filled_black',
        size: 'large',
        width: googleBtnRef.current?.offsetWidth || 400,
        text: 'signup_with',
        shape: 'rectangular',
      });
    };

    if (window.google) {
      initGoogle();
    } else {
      const script = document.querySelector('script[src*="accounts.google.com/gsi"]');
      if (script) script.addEventListener('load', initGoogle);
    }
  }, []);

  const handleGoogleCallback = async (response) => {
    setGoogleLoading(true);
    setApiError('');
    try {
      await googleSignIn(response.credential);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Google sign-up failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!EMAIL_RE.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (!form.confirm) e.confirm = 'Please confirm your password.';
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const showGoogle = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE';

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-bg py-10">
      {/* Ambient blobs */}
      <div className="absolute top-[-120px] right-[-120px] w-[500px] h-[500px] rounded-full bg-purple opacity-10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-accent opacity-10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center group">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/20 border border-accent/30 mb-4 transition-colors group-hover:bg-accent/25">
            <span className="text-2xl">🧠</span>
          </div>
          <h1 className="text-2xl font-semibold text-txt tracking-tight">
            MindSet<span className="text-accent">Tracker</span>
          </h1>
          </Link>
          <p className="text-txt2 text-sm mt-1">Create your free account</p>
        </div>

        {/* Card */}
        <div className="bg-bg2 border border-white/[0.07] rounded-card p-8 shadow-2xl">
          {/* API Error */}
          {apiError && (
            <div className="flex items-start gap-3 bg-danger/10 border border-danger/25 rounded-lg px-4 py-3 mb-5">
              <span className="text-danger mt-[1px] text-sm">⚠</span>
              <p className="text-danger text-sm">{apiError}</p>
            </div>
          )}

          {/* Google Sign Up */}
          {showGoogle ? (
            <>
              <div ref={googleBtnRef} className="w-full mb-4" />
              {googleLoading && (
                <p className="text-txt3 text-xs text-center mb-4">Creating your account…</p>
              )}
            </>
          ) : (
            <button
              type="button"
              disabled
              className="w-full flex items-center justify-center gap-3 bg-bg3 border border-white/[0.1] rounded-sm py-2.5 mb-4 text-sm text-txt2 cursor-not-allowed opacity-60"
              title="Add VITE_GOOGLE_CLIENT_ID to your .env to enable"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
              <span className="text-[10px] text-txt3 ml-auto">(setup required)</span>
            </button>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-txt3 text-xs">or create with email</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-[11px] font-medium text-txt2 uppercase tracking-[0.5px] mb-2">
                Full Name
              </label>
              <input
                id="name" name="name" type="text" autoComplete="name"
                value={form.name} onChange={handleChange} placeholder="Your full name"
                className={`w-full bg-bg3 border rounded-sm px-3 py-2.5 text-sm text-txt placeholder-txt3 font-sans outline-none transition-all duration-150
                  focus:border-accent focus:ring-1 focus:ring-accent/30
                  ${errors.name ? 'border-danger' : 'border-white/[0.13]'}`}
              />
              {errors.name && <p className="text-danger text-xs mt-1.5">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-[11px] font-medium text-txt2 uppercase tracking-[0.5px] mb-2">
                Email Address
              </label>
              <input
                id="email" name="email" type="email" autoComplete="email"
                value={form.email} onChange={handleChange} placeholder="you@example.com"
                className={`w-full bg-bg3 border rounded-sm px-3 py-2.5 text-sm text-txt placeholder-txt3 font-sans outline-none transition-all duration-150
                  focus:border-accent focus:ring-1 focus:ring-accent/30
                  ${errors.email ? 'border-danger' : 'border-white/[0.13]'}`}
              />
              {errors.email && <p className="text-danger text-xs mt-1.5">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-2">
              <label htmlFor="password" className="block text-[11px] font-medium text-txt2 uppercase tracking-[0.5px] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password" name="password" type={showPass ? 'text' : 'password'}
                  autoComplete="new-password" value={form.password}
                  onChange={handleChange} placeholder="Min. 8 characters"
                  className={`w-full bg-bg3 border rounded-sm px-3 py-2.5 pr-10 text-sm text-txt placeholder-txt3 font-sans outline-none transition-all duration-150
                    focus:border-accent focus:ring-1 focus:ring-accent/30
                    ${errors.password ? 'border-danger' : 'border-white/[0.13]'}`}
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-txt3 hover:text-txt2 transition-colors text-sm"
                  tabIndex={-1}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="text-danger text-xs mt-1.5">{errors.password}</p>}
            </div>

            {/* Password strength bar */}
            {form.password && (
              <div className="mb-4">
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300
                      ${i <= strength ? STRENGTH_COLORS[strength] : 'bg-bg4'}`} />
                  ))}
                </div>
                <p className={`text-[11px] ${strength <= 1 ? 'text-danger' : strength === 2 ? 'text-accent3' : 'text-accent2'}`}>
                  {STRENGTH_LABELS[strength]}
                </p>
              </div>
            )}

            {/* Confirm Password */}
            <div className="mb-5">
              <label htmlFor="confirm" className="block text-[11px] font-medium text-txt2 uppercase tracking-[0.5px] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm" name="confirm" type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password" value={form.confirm}
                  onChange={handleChange} placeholder="Re-enter password"
                  className={`w-full bg-bg3 border rounded-sm px-3 py-2.5 pr-10 text-sm text-txt placeholder-txt3 font-sans outline-none transition-all duration-150
                    focus:border-accent focus:ring-1 focus:ring-accent/30
                    ${errors.confirm ? 'border-danger' : form.confirm && form.confirm === form.password ? 'border-accent2' : 'border-white/[0.13]'}`}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-txt3 hover:text-txt2 transition-colors text-sm"
                  tabIndex={-1}>
                  {showConfirm ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.confirm && <p className="text-danger text-xs mt-1.5">{errors.confirm}</p>}
              {!errors.confirm && form.confirm && form.confirm === form.password && (
                <p className="text-accent2 text-xs mt-1.5">✓ Passwords match</p>
              )}
            </div>

            {/* Terms note */}
            <p className="text-txt3 text-[11px] mb-4">
              By creating an account, you agree to our{' '}
              <Link to="/terms" target="_blank" className="text-txt2 underline hover:text-accent transition-colors">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" target="_blank" className="text-txt2 underline hover:text-accent transition-colors">Privacy Policy</Link>.
              Free accounts include Habit Tracker. Premium unlocks the full suite later.
            </p>

            {/* Submit */}
            <button
              id="signup-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
                text-white font-medium text-sm rounded-sm py-2.5 transition-all duration-150"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account…
                </>
              ) : 'Create Account'}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-txt3 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:text-accent/80 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-txt3 mt-6">
          © {new Date().getFullYear()} MindSetTracker · All rights reserved
        </p>
      </div>
    </div>
  );
}
