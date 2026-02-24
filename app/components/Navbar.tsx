'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogoIcon } from './Logo';
import { User, Menu, X, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface NavbarProps {
    user: {
        displayName?: string;
        email?: string;
        photoURL?: string;
    } | null;
    logout: () => void;
    toggleTheme: (e?: React.MouseEvent) => void;
    isDark: boolean;
    page?: string;
    isAdmin?: boolean;
}

export default function Navbar({ user, logout, toggleTheme, isDark, page = "Dashboard", isAdmin }: NavbarProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Chat', href: '/chat' }
    ];

    const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

    return (
        <>
            <nav className="skeu-navbar sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                    <div className="flex justify-between items-center h-16">
                        {/* Left Section */}
                        <div className="flex items-center space-x-4 min-w-0">
                            <Link href="/dashboard" className="btn-press">
                                <LogoIcon size={32} />
                            </Link>
                            <h1 className="text-lg font-bold truncate max-w-[140px] sm:max-w-xs"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                {page}
                            </h1>
                            {isAdmin && (
                                <span className="skeu-badge ml-2 text-[10px]">
                                    ADMIN
                                </span>
                            )}
                        </div>

                        {/* Desktop Controls */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative text-sm py-2 px-4 rounded-lg font-medium transition-all duration-200 ${isActive(item.href)
                                        ? 'nav-link-active'
                                        : 'hover:bg-[var(--surface-inset)]'
                                        }`}
                                    style={{
                                        color: isActive(item.href) ? 'var(--accent-primary)' : 'var(--text-secondary)'
                                    }}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            <div className="w-px h-6 mx-2" style={{ background: 'var(--border-default)' }} />

                            <div className="flex items-center space-x-3">
                                {user?.photoURL ? (
                                    <div className="skeu-inset p-0.5 rounded-full">
                                        <Image
                                            src={user.photoURL}
                                            alt={user.displayName || 'User'}
                                            width={30}
                                            height={30}
                                            className="rounded-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="skeu-inset h-8 w-8 rounded-full flex items-center justify-center">
                                        <User size={14} style={{ color: 'var(--text-secondary)' }} />
                                    </div>
                                )}

                                <span className="hidden sm:inline-block text-sm font-medium truncate max-w-[200px]"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    {user?.displayName || user?.email}
                                </span>

                                <button
                                    onClick={logout}
                                    className="skeu-btn-danger text-sm py-2 px-4 rounded-lg btn-press"
                                >
                                    Logout
                                </button>

                                <button
                                    onClick={toggleTheme}
                                    className="skeu-btn-icon rounded-lg btn-press"
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
                        </div>

                        {/* Hamburger for Mobile */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="skeu-btn-icon rounded-lg btn-press"
                                aria-label="Open Menu"
                            >
                                <Menu className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 skeu-modal-backdrop md:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 left-0 h-full w-72 z-50 skeu-sidebar p-5 flex flex-col md:hidden"
                            style={{ background: 'var(--surface-raised)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                                    Menu
                                </h2>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="skeu-btn-icon rounded-lg btn-press"
                                    aria-label="Close Menu"
                                >
                                    <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                                </button>
                            </div>

                            <nav className="space-y-1 flex-1">
                                {navItems.map((item, i) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + i * 0.05 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`block text-sm font-medium py-3 px-4 rounded-xl transition-all duration-200 ${isActive(item.href)
                                                ? 'font-semibold'
                                                : ''
                                                }`}
                                            style={{
                                                color: isActive(item.href) ? 'var(--accent-primary)' : 'var(--text-primary)',
                                                background: isActive(item.href) ? 'var(--surface-inset)' : 'transparent'
                                            }}
                                        >
                                            {item.name}
                                            {isActive(item.href) && (
                                                <span className="inline-block ml-2 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-primary)' }} />
                                            )}
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            <div className="space-y-3 mt-auto">
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                >
                                    <button
                                        onClick={() => {
                                            logout();
                                            setSidebarOpen(false);
                                        }}
                                        className="skeu-btn-danger w-full text-sm py-3 px-4 rounded-xl btn-press"
                                    >
                                        Logout
                                    </button>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <button
                                        onClick={toggleTheme}
                                        className="skeu-btn-secondary w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm btn-press"
                                    >
                                        {isDark ? (
                                            <>
                                                <Sun className="w-4 h-4" style={{ color: 'var(--accent-warning)' }} />
                                                <span>Light Mode</span>
                                            </>
                                        ) : (
                                            <>
                                                <Moon className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                                                <span>Dark Mode</span>
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
