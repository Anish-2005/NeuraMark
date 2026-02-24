'use client'
import Link from 'next/link'
import Image from 'next/image'
import { LogoIcon } from '@/app/components/Logo'
import { RefreshCw, Menu, Moon, Sun, ArrowLeft } from 'lucide-react'
import { useTheme } from '@/app/context/ThemeContext'
import { AnimatePresence, motion } from 'framer-motion'
import UserAvatar from './UserAvatar'

interface ProgressHeaderProps {
  user: any | null
  loading: boolean
  onRefresh: () => void
  onMenuOpen: () => void
}

export default function ProgressHeader({ user, loading, onRefresh, onMenuOpen }: ProgressHeaderProps) {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <nav className="skeu-navbar sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4 min-w-0">
            <Link
              href="/dashboard"
              className="skeu-btn-icon rounded-lg"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
            </Link>
            <LogoIcon size={32} />
            <h1 className="text-lg font-bold skeu-text-embossed truncate max-w-[140px] sm:max-w-xs"
              style={{ color: 'var(--text-primary)' }}
            >
              My Progress
            </h1>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={onRefresh}
              className="skeu-btn-primary text-sm py-2 px-4 rounded-lg font-medium flex items-center"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>

            {user?.photoURL ? (
              <div className="skeu-inset p-0.5 rounded-full">
                <Image
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              </div>
            ) : (
              <UserAvatar user={user} size="sm" />
            )}

            <span className="hidden sm:inline-block text-sm font-medium truncate max-w-[200px]"
              style={{ color: 'var(--text-secondary)' }}
            >
              {user?.displayName || user?.email}
            </span>

            <button
              onClick={toggleTheme}
              className="skeu-btn-icon rounded-lg"
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
          </div>

          {/* Hamburger for Mobile */}
          <div className="md:hidden">
            <button
              onClick={onMenuOpen}
              className="skeu-btn-icon rounded-lg"
              aria-label="Open Menu"
            >
              <Menu className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}