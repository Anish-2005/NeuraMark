'use client'
import Link from 'next/link'
import { useAuth } from './context/AuthContext'
import { useTheme } from './context/ThemeContext'
import { Moon, Sun, BookOpen, ArrowRight, Zap, Users, BarChart2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function Home() {
  const { user } = useAuth()
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--surface-base)' }}
    >
      {/* Subtle ambient light spots */}
      {/* Subtle ambient spots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(22,163,74,0.04) 0%, transparent 70%)'
          }}
        />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(94,234,212,0.04) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(13,148,136,0.03) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Theme Toggle */}
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center p-8 max-w-4xl relative z-10"
      >
        {/* Logo with embossed container */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex items-center justify-center mb-10"
        >
          <div className="relative group">
            {/* Embossed logo container */}
            <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] p-3 rounded-2xl shadow-sm group-hover:shadow-md transition-all duration-300">
              <Image
                src="/emblem.png"
                alt="NeuraMark Logo"
                width={90}
                height={90}
                className="relative rounded-xl shrink-0 transform group-hover:scale-[1.03] transition duration-300"
                priority
              />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-6xl md:text-8xl font-black mb-6 tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Neura<span style={{ color: 'var(--accent-primary)' }}>Mark</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
        >
          <Link
            href={user ? '/dashboard' : '/login'}
            className="skeu-btn-primary text-lg px-8 py-4 rounded-xl flex items-center justify-center gap-2"
          >
            {user ? (
              <>
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                Get Started
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Link>
          <Link
            href="/about"
            className="skeu-btn-secondary text-lg px-8 py-4 rounded-xl flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            Learn More
          </Link>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {[
            { icon: <Zap className="w-3.5 h-3.5" />, label: 'Real-time Tracking', color: 'var(--accent-success)' },
            { icon: <BarChart2 className="w-3.5 h-3.5" />, label: 'AI-Powered', color: 'var(--accent-primary)' },
            { icon: <Users className="w-3.5 h-3.5" />, label: 'Collaborative', color: 'var(--accent-secondary)' },
          ].map((item, i) => (
            <div key={i} className="skeu-stat-pill">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: item.color }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </main>
  )
}