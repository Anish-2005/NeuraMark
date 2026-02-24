// app/(auth)/login/page.js
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Link from 'next/link';
import { Moon, Sun, User, Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import NameCollectionModal from '../../components/NameCollectionModal';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme, isDark } = useTheme();
  const { login, googleSignIn, needsProfile, user, userProfile } = useAuth();

  useEffect(() => {
    // If user is logged in and has a profile (doesn't need profile), redirect to dashboard
    if (user && !needsProfile && userProfile) {
      router.push('/dashboard');
    }
    // If user is logged in but needs profile, show name modal
    else if (user && needsProfile) {
      setShowNameModal(true);
    }
  }, [user, needsProfile, userProfile, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await googleSignIn();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleNameComplete = () => {
    setShowNameModal(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at 40% 30%, #121f17 0%, #0a0f0c 60%, #060a08 100%)'
          : 'radial-gradient(ellipse at 40% 30%, #f8faf8 0%, #f0f5f1 60%, #e4ece6 100%)'
      }}
    >
      {/* Ambient light spots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full animate-blob"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(45,106,79,0.06) 0%, transparent 70%)'
          }}
        />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full animate-blob animation-delay-2000"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(110,231,183,0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(64,145,108,0.06) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="skeu-btn-icon fixed top-6 right-6 z-50"
        aria-label="Toggle Theme"
      >
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

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="skeu-card-static max-w-md w-full mx-4 space-y-7 p-10 rounded-3xl relative z-10"
      >
        <div className="text-center">
          <h2 className="text-3xl font-black skeu-text-embossed mb-2 flex items-center justify-center gap-3"
            style={{ color: 'var(--text-primary)' }}
          >
            <div className="skeu-inset p-2 rounded-xl">
              <User className="w-7 h-7" style={{ color: 'var(--accent-primary)' }} />
            </div>
            Welcome Back!
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Sign in to continue your learning journey
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="skeu-inset px-4 py-3 rounded-xl text-sm flex items-center gap-2"
            style={{ color: 'var(--accent-danger)', borderColor: 'var(--accent-danger)' }}
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="skeu-btn-secondary w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-semibold disabled:opacity-50"
        >
          <FcGoogle className="w-6 h-6" />
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full" style={{ height: '2px', background: `linear-gradient(90deg, transparent, var(--border-dark), transparent)` }} />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 font-medium"
              style={{
                background: 'var(--surface-raised)',
                color: 'var(--text-muted)'
              }}
            >
              Or continue with email
            </span>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold skeu-text-embossed"
                style={{ color: 'var(--text-primary)' }}
              >
                <User className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="skeu-input w-full rounded-xl"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold skeu-text-embossed"
                style={{ color: 'var(--text-primary)' }}
              >
                <Lock className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="skeu-input w-full rounded-xl"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="skeu-btn-primary w-full py-4 px-6 rounded-2xl text-sm font-bold disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="text-center space-y-3 pt-2">
          <Link href="/signup"
            className="block text-sm font-semibold transition-colors duration-200"
            style={{ color: 'var(--accent-primary)' }}
          >
            Don&apos;t have an account? Sign Up →
          </Link>
          <Link href="/forgot-password"
            className="flex items-center justify-center gap-2 text-sm font-semibold transition-colors duration-200"
            style={{ color: 'var(--accent-secondary)' }}
          >
            <Lock className="w-4 h-4" />
            Forgot password?
          </Link>
        </div>
      </motion.div>

      {/* Name Collection Modal */}
      {showNameModal && (
        <NameCollectionModal
          onComplete={handleNameComplete}
          onClose={() => setShowNameModal(false)}
        />
      )}
    </div>
  );
}
