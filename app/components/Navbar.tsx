'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Menu, X, Moon, Sun, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
    user: {
        displayName?: string;
        email?: string;
        photoURL?: string;
    } | null;
    logout: () => void;
    toggleTheme: () => void;
    isDark: boolean;
    page?: string;
    isAdmin?: boolean;
}

export default function Navbar({ user, logout, toggleTheme, isDark, page = "Dashboard", isAdmin }: NavbarProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Chat', href: '/chat' }
    ];

    return (
        <>
            <nav className="skeu-navbar sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                    <div className="flex justify-between items-center h-16">
                        {/* Left Section */}
                        <div className="flex items-center space-x-4 min-w-0">
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
                                {page}
                            </h1>
                            {isAdmin && (
                                <span className="skeu-badge ml-2 text-[10px]">
                                    ADMIN
                                </span>
                            )}
                        </div>

                        {/* Desktop Controls */}
                        <div className="hidden md:flex items-center space-x-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="skeu-btn-secondary text-sm py-2 px-4 rounded-lg font-medium"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    {item.name}
                                </Link>
                            ))}

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
                                className="skeu-btn-danger text-sm py-2 px-4 rounded-lg"
                            >
                                Logout
                            </button>

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
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed top-0 left-0 h-full w-72 z-50 skeu-sidebar p-5 flex flex-col md:hidden"
                            style={{ background: 'var(--surface-raised)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-lg font-bold skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>
                                    Menu
                                </h2>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="skeu-btn-icon rounded-lg"
                                    aria-label="Close Menu"
                                >
                                    <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                                </button>
                            </div>

                            <nav className="space-y-2 flex-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className="block skeu-btn-secondary text-sm font-medium py-3 px-4 rounded-xl"
                                        style={{ color: 'var(--text-primary)' }}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>

                            <div className="space-y-3 mt-auto">
                                <button
                                    onClick={() => {
                                        logout();
                                        setSidebarOpen(false);
                                    }}
                                    className="skeu-btn-danger w-full text-sm py-3 px-4 rounded-xl"
                                >
                                    Logout
                                </button>
                                <button
                                    onClick={toggleTheme}
                                    className="skeu-btn-secondary w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm"
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
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
