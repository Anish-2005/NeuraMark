'use client'
import Link from 'next/link'
import { useAuth } from './context/AuthContext'
import { useTheme } from './context/ThemeContext'
import { Moon, Sun, BookOpen, ArrowRight, Sparkles, Zap, Users, BarChart2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function Home() {
  const { user } = useAuth()
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: isDark
        ? 'radial-gradient(ellipse at 30% 20%, #2a2a4a 0%, #1e1e2e 50%, #151520 100%)'
        : 'radial-gradient(ellipse at 30% 20%, #f0e9e2 0%, #e8e0d8 50%, #ddd5cc 100%)'
      }}
    >
      {/* Subtle ambient light spots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full animate-blob"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(123,140,240,0.12) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(91,106,191,0.1) 0%, transparent 70%)'
          }}
        />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full animate-blob animation-delay-2000"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(224,122,158,0.1) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(181,84,122,0.08) 0%, transparent 70%)'
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
            {/* Glow ring */}
            <div className="absolute -inset-3 rounded-3xl animate-pulse-glow"
              style={{
                background: isDark
                  ? 'radial-gradient(circle, rgba(123,140,240,0.15) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(91,106,191,0.12) 0%, transparent 70%)'
              }}
            />
            {/* Embossed logo container */}
            <div className="skeu-card-static p-3 rounded-3xl group-hover:shadow-[var(--shadow-elevated)] transition-all duration-500">
              <Image
                src="/emblem.png"
                alt="NeuraMark Logo"
                width={90}
                height={90}
                className="relative rounded-2xl shrink-0 transform group-hover:scale-105 transition duration-300"
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
          className="text-6xl md:text-8xl font-black mb-6 skeu-text-embossed"
        >
          <span className="bg-clip-text text-transparent animate-gradient"
            style={{
              backgroundImage: isDark
                ? 'linear-gradient(135deg, #7b8cf0, #e07a9e, #6ec485, #7b8cf0)'
                : 'linear-gradient(135deg, #5b6abf, #b5547a, #5a9e6f, #5b6abf)',
              backgroundSize: '300% auto'
            }}
          >
            NeuraMark
          </span>
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
          className="flex flex-col sm:flex-row gap-6 justify-center mb-14"
        >
          <Link
            href={user ? '/dashboard' : '/login'}
            className="skeu-btn-primary text-lg px-10 py-5 rounded-2xl flex items-center justify-center gap-2"
            style={{
              background: isDark
                ? 'linear-gradient(180deg, #7b8cf0 0%, #6a79d4 100%)'
                : 'linear-gradient(180deg, #5b6abf 0%, #4a57a0 100%)'
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              {user ? (
                <>
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Get Started
                </>
              )}
            </span>
          </Link>
          <Link
            href="/about"
            className="skeu-btn-secondary text-lg px-8 py-4 rounded-2xl flex items-center justify-center gap-2"
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