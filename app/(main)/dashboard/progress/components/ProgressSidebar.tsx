'use client'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { RefreshCw, X, User, Moon, Sun } from 'lucide-react'
import UserAvatar from './UserAvatar'
import { useTheme } from '@/app/context/ThemeContext'

interface ProgressSidebarProps {
  isOpen: boolean
  onClose: () => void
  user: any | null
  loading: boolean
  onRefresh: () => void
  logout: () => void
}

export default function ProgressSidebar({ isOpen, onClose, user, loading, onRefresh, logout }: ProgressSidebarProps) {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="skeu-sidebar fixed inset-0 z-50 w-64 max-w-full p-4 flex flex-col gap-4 shadow-lg"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="skeu-inset p-1 rounded-lg">
                <Image
                  src="/emblem.png"
                  alt="NeuraMark Logo"
                  width={24}
                  height={24}
                  className="rounded shrink-0"
                />
              </div>
              <h2 className="font-bold text-lg skeu-text-embossed"
                style={{ color: 'var(--text-primary)' }}
              >
                My Progress
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close Menu"
              className="skeu-btn-icon rounded-lg"
            >
              <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-2">
            <Link
              href="/dashboard"
              onClick={onClose}
              className="skeu-btn-secondary px-3 py-2 rounded-lg text-base font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Dashboard
            </Link>

            <Link
              href="/chat"
              onClick={onClose}
              className="skeu-btn-secondary px-3 py-2 rounded-lg text-base font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Chat
            </Link>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => {
              onRefresh()
              onClose()
            }}
            className="skeu-btn-primary w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Progress</span>
          </button>

          {/* User Info */}
          <div className="flex items-center space-x-2 mt-auto">
            <div className="skeu-inset p-0.5 rounded-full">
              <UserAvatar user={user} size="md" />
            </div>
            <span className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
              {user?.displayName || user?.email}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              logout()
              onClose()
            }}
            className="skeu-btn-danger w-full py-2 rounded-lg text-sm font-medium"
          >
            Logout
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="skeu-btn-secondary w-full p-2 rounded-lg flex justify-center items-center"
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
                  className="flex items-center space-x-2"
                  style={{ color: 'var(--accent-warning)' }}
                >
                  <Sun className="w-5 h-5" />
                  <span>Light Mode</span>
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center space-x-2"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  <Moon className="w-5 h-5" />
                  <span>Dark Mode</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}