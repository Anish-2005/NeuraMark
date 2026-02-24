'use client'
import Link from 'next/link'
import { useAuth } from './context/AuthContext'
import { useTheme } from './context/ThemeContext'
import { Moon, Sun, BookOpen, ArrowRight, Zap, Users, BarChart2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogoIcon } from './components/Logo'

export default function Home() {
  const { user } = useAuth()
  const { theme, toggleTheme, isDark } = useTheme()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--surface-base)' }}
    >
      {/* Subtle ambient spots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(62,207,114,0.05) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(22,163,74,0.04) 0%, transparent 70%)'
          }}
        />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(80,208,184,0.03) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(13,148,136,0.03) 0%, transparent 70%)'
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
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center p-8 max-w-4xl relative z-10"
      >
        {/* Logo with hover lift */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center mb-10"
        >
          <div className="relative group">
            <div className="p-2 rounded-2xl shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
              <LogoIcon
                size={90}
                className="transform group-hover:scale-[1.03] transition duration-300"
              />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl font-black mb-6 tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Neura<span style={{ color: 'var(--accent-primary)' }}>Mark</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Track your academic progress from 1st to final year across a wide range of courses — from B.Tech branches like{' '}
          <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>
            CSE, ECE, AIML, DS
          </span>
          , and more.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
        >
          <Link
            href={user ? '/dashboard' : '/login'}
            className="group skeu-btn-primary text-lg px-8 py-4 rounded-xl flex items-center justify-center gap-2 btn-press"
          >
            {user ? (
              <>
                Go to Dashboard
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </>
            ) : (
              <>
                Get Started
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </Link>
          <Link
            href="/about"
            className="skeu-btn-secondary text-lg px-8 py-4 rounded-xl flex items-center justify-center gap-2 btn-press"
          >
            <BookOpen className="w-5 h-5" />
            Learn More
          </Link>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4"
        >
          {[
            { icon: <Zap className="w-3.5 h-3.5" />, label: 'Real-time Tracking', color: 'var(--accent-success)' },
            { icon: <BarChart2 className="w-3.5 h-3.5" />, label: 'AI-Powered', color: 'var(--accent-primary)' },
            { icon: <Users className="w-3.5 h-3.5" />, label: 'Collaborative', color: 'var(--accent-secondary)' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="skeu-stat-pill group cursor-default"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: item.color }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </main>
  )
}