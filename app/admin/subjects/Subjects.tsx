'use client'
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { useTheme } from '@/app/context/ThemeContext';
import { User, RefreshCw, Menu, Moon, Sun, Trash2, Edit, ArrowLeft, X, BookOpen, GraduationCap, Layers } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
export default function AdminSubjects() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
    const { theme, toggleTheme, isDark } = useTheme();
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Skeuomorphic theme styles
    const cardBg = 'skeu-card-static';
    const textColor = 'text-skeu-primary';
    const secondaryText = 'text-skeu-secondary';
    const borderColor = 'border-skeu';

    useEffect(() => {
        if (user && user.email === "anishseth0510@gmail.com") {
            setIsAdmin(true);
            fetchAllSubjects();
        }
    }, [user]);

    const fetchAllSubjects = async () => {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, 'syllabus'));
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAllSubjects(data);
        } catch (error) {
            console.error('Error fetching all subjects:', error);
        } finally {
            setLoading(false);
        }
    };

    interface Subject {
        id: string;
        name?: string;
        code?: string;
        branch?: string;
        year?: number;
        semester?: number;
        modules?: any[];
        [key: string]: any;
    }

    const deleteSubject = async (subjectId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this subject? This action cannot be undone.");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, 'syllabus', subjectId));
            setAllSubjects((prev: Subject[]) => prev.filter((sub) => sub.id !== subjectId));
            alert('Subject deleted successfully');
        } catch (error) {
            console.error('Error deleting subject:', error);
            alert('Failed to delete subject');
        }
    };

    const handleViewSubject = (subject: Subject) => {
        // Store the subject in session storage to be retrieved on the dashboard
        sessionStorage.setItem('subjectToView', JSON.stringify(subject));
        router.push(`/dashboard?subject=${subject.id}`);
    };

    if (!isAdmin) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--surface-base)' }}>
                    <div className={`${cardBg} p-8 rounded-xl text-center max-w-md ${borderColor} border`}>
                        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Access Denied</h2>
                        <p className={secondaryText}>You don&apos;t have permission to access this page.</p>
                        <Link href="/dashboard" className="mt-4 inline-block skeu-btn-primary px-4 py-2 rounded-lg text-sm font-medium">
                            Go back to Dashboard
                        </Link>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    function logout() {
        // Remove user session and redirect to login
        if (typeof window !== "undefined") {
            sessionStorage.clear();
            localStorage.clear();
        }
        router.push("/login");
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen transition-colors duration-200" style={{ background: 'var(--surface-base)' }}>
                {/* Navigation */}
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
                                    Subjects
                                </h1>
                                <span className="skeu-badge hidden sm:inline-block text-[10px]">
                                    ADMIN
                                </span>
                            </div>

                            {/* Desktop Controls */}
                            <div className="hidden md:flex items-center space-x-3">
                                <button
                                    onClick={fetchAllSubjects}
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
                                    <div className="skeu-inset h-8 w-8 rounded-full flex items-center justify-center">
                                        <User size={16} style={{ color: 'var(--text-secondary)' }} />
                                    </div>
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
                                    onClick={() => setSidebarOpen(true)}
                                    aria-label="Open Menu"
                                    className="skeu-btn-icon rounded-lg"
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
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="skeu-sidebar fixed inset-0 z-50 w-64 max-w-full p-4 flex flex-col gap-4 shadow-lg"
                        >
                            {/* Top Section */}
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
                                        Subjects
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

                            {/* Navigation Links */}
                            <div className="flex flex-col space-y-2">
                                <Link
                                    href="/dashboard"
                                    onClick={() => setSidebarOpen(false)}
                                    className="skeu-btn-secondary px-3 py-2 rounded-lg text-base font-medium"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    Dashboard
                                </Link>

                                <Link
                                    href="/chat"
                                    onClick={() => setSidebarOpen(false)}
                                    className="skeu-btn-secondary px-3 py-2 rounded-lg text-base font-medium"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    Chat
                                </Link>
                            </div>

                            {/* Refresh Button */}
                            <button
                                onClick={() => {
                                    fetchAllSubjects();
                                    setSidebarOpen(false);
                                }}
                                className="skeu-btn-primary w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2"
                                disabled={loading}
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                <span>Refresh Progress</span>
                            </button>

                            {/* User Info */}
                            <div className="flex items-center space-x-2 mt-auto">
                                {user?.photoURL ? (
                                    <div className="skeu-inset p-0.5 rounded-full">
                                        <Image
                                            src={user.photoURL}
                                            alt={user.displayName || 'User'}
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
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


                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" style={{ color: 'var(--text-primary)' }}>
                    <div className={`${cardBg} p-6 sm:p-8 rounded-2xl ${borderColor} border`}>
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="skeu-inset p-3 rounded-xl">
                                    <BookOpen className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
                                </div>
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold skeu-text-embossed"
                                        style={{ color: 'var(--text-primary)' }}
                                    >
                                        All Subjects
                                    </h2>
                                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        {allSubjects.length} {allSubjects.length === 1 ? 'Subject' : 'Subjects'} in Database
                                    </p>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col justify-center items-center h-64 space-y-4">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent"
                                    style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }}
                                ></div>
                                <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--text-secondary)' }}>Loading subjects...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-xl">
                                <table className="min-w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                                    <thead>
                                        <tr className="skeu-inset">
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4" />
                                                    Subject
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                                                Code
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="w-4 h-4" />
                                                    Branch
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                                                Year
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                                                Semester
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                                                <div className="flex items-center gap-2">
                                                    <Layers className="w-4 h-4" />
                                                    Modules
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allSubjects.map((subject) => (
                                            <tr key={subject.id} className="transition-all hover:opacity-80" style={{ borderBottom: '1px solid var(--border-primary)' }}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                                        {subject.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                        {subject.code}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                        {subject.branch}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                        Year {subject.year}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                        Sem {subject.semester}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                        {subject.modules?.length || 0}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleViewSubject(subject)}
                                                            className="skeu-btn-primary px-4 py-2 rounded-lg text-sm font-medium"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => deleteSubject(subject.id)}
                                                            className="skeu-btn-icon rounded-lg p-2"
                                                            style={{ color: 'var(--accent-danger)' }}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {!loading && allSubjects.length === 0 && (
                            <div className="text-center py-16">
                                <div className="inline-block">
                                    <div className="skeu-inset p-6 rounded-2xl">
                                        <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                                        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Subjects Found</h3>
                                        <p style={{ color: 'var(--text-secondary)' }}>No subjects are currently available in the database.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}