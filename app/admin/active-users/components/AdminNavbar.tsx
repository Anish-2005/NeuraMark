import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sun, Moon, Menu, ArrowLeft, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface AdminNavbarProps {
  user: any;
  isDark: boolean;
  toggleTheme: (e?: React.MouseEvent) => void;
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminNavbar({ user, isDark, toggleTheme, setSidebarOpen }: AdminNavbarProps) {
  return (
    <nav className="skeu-navbar sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="skeu-inset p-1 rounded-lg">
              <Image
                src="/emblem.png"
                alt="NeuraMark Logo"
                width={28}
                height={28}
                className="rounded shrink-0"
                priority
              />
            </div>
            <h1 className="text-lg font-bold skeu-text-embossed truncate max-w-[140px] sm:max-w-xs"
              style={{ color: 'var(--text-primary)' }}
            >
              Active Users
            </h1>
            <span className="skeu-badge hidden sm:inline-block text-[10px]">
              ADMIN
            </span>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-3">
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
                <div className="skeu-inset h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {(user?.displayName || user?.email)?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="hidden sm:inline-block text-sm font-medium truncate max-w-[200px]"
                style={{ color: 'var(--text-secondary)' }}
              >
                {user?.displayName || user?.email?.split("@")[0]}
              </span>
            </div>
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
              onClick={() => setSidebarOpen(true)}
              className="skeu-btn-icon rounded-lg"
              aria-label="Open Menu"
            >
              <Menu className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
