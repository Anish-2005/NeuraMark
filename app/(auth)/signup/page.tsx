// app/(auth)/signup/page.js
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Link from 'next/link';
import { Moon, Sun, UserPlus, Lock, AlertCircle, Mail, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import NameCollectionModal from '../../components/NameCollectionModal';
import { LogoIcon } from '../../components/Logo';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const router = useRouter();
  const { theme, toggleTheme, isDark } = useTheme();
  const { signup, googleSignIn, needsProfile, user, userProfile } = useAuth();

  const checkUserExists = async (email: string) => {
    const usersRef = doc(db, 'users', email);
    const userDoc = await getDoc(usersRef);
    return userDoc.exists();
  };

  useEffect(() => {
    if (user && !needsProfile && userProfile) {
      router.push('/dashboard');
    } else if (user && needsProfile) {
      setShowNameModal(true);
    }
  }, [user, needsProfile, userProfile, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setShakeKey(prev => prev + 1);
      return;
    }
    try {
      setError('');
      setLoading(true);
      const userExists = await checkUserExists(email);
      if (userExists) {
        setLoading(false);
        setError('An account with this email already exists. Please sign in instead.');
        setShakeKey(prev => prev + 1);
        return;
      }
      await signup(email, password);
    } catch (err: any) {
      setError(err.message);
      setShakeKey(prev => prev + 1);
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
      setShakeKey(prev => prev + 1);
      setLoading(false);
    }
  };

  const handleNameComplete = () => {
    setShowNameModal(false);
    router.push('/dashboard');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--surface-base)' }}
    >
      {/* Ambient light spots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full animate-blob"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(62,207,114,0.04) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(22,163,74,0.03) 0%, transparent 70%)'
          }}
        />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full animate-blob animation-delay-2000"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(80,208,184,0.03) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(13,148,136,0.02) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="skeu-btn-icon fixed top-6 right-6 z-50 btn-press"
        aria-label="Toggle Theme"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.3 }} style={{ color: 'var(--accent-warning)' }}>
              <Sun className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.3 }} style={{ color: 'var(--accent-primary)' }}>
              <Moon className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Signup Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="skeu-card-static max-w-md w-full mx-4 space-y-7 p-10 rounded-2xl relative z-10"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h2 className="text-3xl font-black mb-2 flex items-center justify-center gap-3"
            style={{ color: 'var(--text-primary)' }}
          >
            <LogoIcon size={40} />
            Join NeuraMark!
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Start your learning journey today</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key={shakeKey}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="skeu-inset px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-shake"
              style={{ color: 'var(--accent-danger)' }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google Sign-In */}
        <motion.div variants={itemVariants}>
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="skeu-btn-secondary w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-semibold btn-press disabled:opacity-50"
          >
            <FcGoogle className="w-6 h-6" />
            <span>Continue with Google</span>
          </button>
        </motion.div>

        {/* Divider */}
        <motion.div variants={itemVariants} className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full" style={{ height: '1px', background: `linear-gradient(90deg, transparent, var(--border-default), transparent)` }} />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 font-medium" style={{ background: 'var(--surface-raised)', color: 'var(--text-muted)' }}>
              Or sign up with email
            </span>
          </div>
        </motion.div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                <Mail className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                Email address
              </label>
              <input id="email" name="email" type="email" required className="skeu-input w-full rounded-xl" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                <Lock className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                Password
              </label>
              <input id="password" name="password" type="password" required minLength={6} className="skeu-input w-full rounded-xl" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                <Shield className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                Confirm Password
              </label>
              <input id="confirmPassword" name="confirmPassword" type="password" required minLength={6} className="skeu-input w-full rounded-xl" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={loading}
              className={`skeu-btn-primary w-full py-4 px-6 rounded-2xl text-sm font-bold btn-press ${loading ? 'btn-loading' : ''}`}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </motion.div>
        </form>

        <motion.div variants={itemVariants} className="text-center pt-2">
          <Link href="/login" className="block text-sm font-semibold link-hover" style={{ color: 'var(--accent-primary)' }}>
            Already have an account? Sign In →
          </Link>
        </motion.div>
      </motion.div>

      {showNameModal && (
        <NameCollectionModal
          onComplete={handleNameComplete}
          onClose={() => {
            setShowNameModal(false);
            router.push('/dashboard');
          }}
        />
      )}
    </div>
  );
}