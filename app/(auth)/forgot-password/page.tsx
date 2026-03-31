'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowLeft, Lock, Mail, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useTheme } from '@/app/context/ThemeContext';
import { getAuthErrorMessage, normalizeEmail, validateEmail } from '@/app/lib/auth-utils';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const canSubmit = Boolean(email.trim()) && !loading;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedEmail = normalizeEmail(email);
    const emailError = validateEmail(normalizedEmail);
    if (emailError) {
      setError(emailError);
      setSuccess('');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await resetPassword(normalizedEmail);
      setSuccess('Password reset link sent. Please check your inbox.');
    } catch (err) {
      setSuccess('');
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--surface-base)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full animate-blob"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(45, 212, 191,0.04) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(13, 148, 136,0.03) 0%, transparent 70%)',
          }}
        />
      </div>

      <button onClick={toggleTheme} className="skeu-btn-icon fixed top-6 right-6 z-50 btn-press" aria-label="Toggle Theme">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ color: 'var(--accent-warning)' }}
            >
              <Sun className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ color: 'var(--accent-primary)' }}
            >
              <Moon className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="skeu-card-static max-w-md w-full mx-4 p-10 rounded-2xl relative z-10 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-11 h-11 rounded-xl mx-auto flex items-center justify-center skeu-inset">
            <Lock className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
            Reset Password
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Enter your account email and we&apos;ll send a reset link.
          </p>
        </div>

        {error && (
          <div className="skeu-inset px-4 py-3 rounded-xl text-sm flex items-center gap-2" style={{ color: 'var(--accent-danger)' }} role="alert" aria-live="polite">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="skeu-inset px-4 py-3 rounded-xl text-sm" style={{ color: 'var(--accent-primary)' }} role="status" aria-live="polite">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              <Mail className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="skeu-input w-full rounded-xl"
              placeholder="you@example.com"
            />
          </div>

          <button type="submit" disabled={!canSubmit} className={`skeu-btn-primary w-full py-3 rounded-xl ${loading ? 'btn-loading' : ''}`}>
            {loading ? 'Sending link...' : 'Send reset link'}
          </button>
        </form>

        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold link-hover" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
      </motion.div>
    </div>
  );
}
