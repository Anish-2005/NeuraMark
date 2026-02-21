import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCw, X, Sun, Moon, User } from 'lucide-react';

interface MobileSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isDark: boolean;
  user: any;
  loading: boolean;
  fetchAllData: () => void;
  logout: () => void;
  toggleTheme: () => void;
  pathname: string;
  secondaryText: string;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  isDark,
  user,
  loading,
  fetchAllData,
  logout,
  toggleTheme,
  pathname,
  secondaryText,
}) => (
  <AnimatePresence>
    {sidebarOpen && (
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed inset-0 z-50 w-64 max-w-full p-5 flex flex-col gap-4 skeu-sidebar"
      >
        {/* Top Section */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="skeu-inset p-1 rounded-lg">
              <Image src="/emblem.png" alt="NeuraMark Logo" width={28} height={28} className="rounded-sm shrink-0" />
            </div>
            <h2 className="font-bold text-lg skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>
              Analytics
            </h2>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close Menu"
            className="skeu-btn-icon rounded-lg"
          >
            <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        <hr className="skeu-divider" />

        {/* Navigation Links */}
        <div className="flex flex-col space-y-2">
          <Link
            href="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="block skeu-btn-secondary text-sm font-medium py-3 px-4 rounded-xl"
            style={{ color: pathname === '/dashboard' ? 'var(--accent-primary)' : 'var(--text-primary)' }}
          >
            Dashboard
          </Link>
          <Link
            href="/chat"
            onClick={() => setSidebarOpen(false)}
            className="block skeu-btn-secondary text-sm font-medium py-3 px-4 rounded-xl"
            style={{ color: pathname === '/chat' ? 'var(--accent-primary)' : 'var(--text-primary)' }}
          >
            Chat
          </Link>
        </div>

        {/* Refresh Button */}
        <button
          onClick={() => {
            fetchAllData();
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-sm ${loading ? 'skeu-btn-secondary opacity-60' : 'skeu-btn-primary'
            }`}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Progress</span>
        </button>

        {/* User Info */}
        <div className="flex items-center space-x-3 mt-auto">
          {user?.photoURL ? (
            <div className="skeu-inset p-0.5 rounded-full">
              <Image src={user.photoURL} alt={user.displayName || 'User'} width={32} height={32} className="rounded-full" />
            </div>
          ) : (
            <div className="skeu-inset h-8 w-8 rounded-full flex items-center justify-center">
              <User size={16} style={{ color: 'var(--text-secondary)' }} />
            </div>
          )}
          <span className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
            {user?.displayName || user?.email}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            setSidebarOpen(false);
          }}
          className="skeu-btn-danger w-full py-3 text-sm rounded-xl"
        >
          Logout
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="skeu-btn-secondary w-full py-3 rounded-xl flex justify-center items-center"
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
                className="flex items-center space-x-2" style={{ color: 'var(--accent-warning)' }}
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
                className="flex items-center space-x-2" style={{ color: 'var(--accent-primary)' }}
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
);

export default MobileSidebar;
