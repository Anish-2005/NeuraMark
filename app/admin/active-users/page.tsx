// app/admin/active-users/page.js
'use client'
import React from 'react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useTheme } from '@/app/context/ThemeContext';
import { db } from '@/app/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import AdminNavbar from './components/AdminNavbar';
import AdminSidebar from './components/AdminSidebar';
import AdminStatsCards from './components/AdminStatsCards';
import UserSearchBar from './components/UserSearchBar';
import UserMobileCard from './components/UserMobileCard';
import UserTable from './components/UserTable';
import UserProgressDetails from './components/UserProgressDetails';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { LogoIcon } from '@/app/components/Logo';

export default function UserDataPage() {
    const { user: currentUser } = useAuth();
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    interface UserData {
        id: string;
        name: string;
        email: string;
        photoURL: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }

    const [users, setUsers] = useState<UserData[]>([]);
    const [userProgress, setUserProgress] = useState<{ [userId: string]: UserProgressData }>({});
    const [syllabusData, setSyllabusData] = useState<{ [key: string]: SubjectInfo }>({});
    const { theme, toggleTheme, isDark } = useTheme();
    const [isAdmin, setIsAdmin] = useState(false);
    const [expandedUser, setExpandedUser] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Skeuomorphic theme styles
    const bgColor = '';
    const cardBg = 'skeu-card-static';
    const textColor = 'text-skeu-primary';
    const secondaryText = 'text-skeu-secondary';
    const borderColor = 'border-skeu';
    const inputBg = 'skeu-input';

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch users
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const usersData: UserData[] = [];

            usersSnapshot.forEach((doc) => {
                const userData = doc.data();
                usersData.push({
                    id: doc.id,
                    name: userData.name || 'Not provided',
                    email: userData.email || 'No email',
                    photoURL: userData.photoURL || null,
                    createdAt: userData.createdAt?.toDate() || null,
                    updatedAt: userData.updatedAt?.toDate() || null
                });
            }); // <-- fixed missing parenthesis

            // Sort by creation date (newest first)
            const sortedUsers = usersData.sort(
                (a, b) =>
                ((b.createdAt ? b.createdAt.getTime() : 0) -
                    (a.createdAt ? a.createdAt.getTime() : 0))
            );
            setUsers(sortedUsers);

            // Fetch syllabus data
            const syllabusSnapshot = await getDocs(collection(db, 'syllabus'));
            const syllabusMap: { [key: string]: any } = {};
            syllabusSnapshot.forEach((doc) => {
                syllabusMap[doc.id] = doc.data();
            });
            setSyllabusData(syllabusMap);

            // Fetch progress for each user
            const progressData: { [key: string]: any } = {};
            for (const user of sortedUsers) {
                const progressDoc = await getDoc(doc(db, 'userProgress', user.id));
                if (progressDoc.exists()) {
                    progressData[user.id] = progressDoc.data();
                }
            }
            setUserProgress(progressData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (currentUser && currentUser.email === "anishseth0510@gmail.com") {
            setIsAdmin(true);
            fetchAllData();
        }
    }, [currentUser, fetchAllData]);

    interface FormatDate {
        (date: Date | null): string;
    }

    const formatDate: FormatDate = (date) => {
        if (!date) return 'Unknown';
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    interface ToggleUserExpand {
        (userId: string): void;
    }

    const toggleUserExpand: ToggleUserExpand = (userId) => {
        setExpandedUser(expandedUser === userId ? null : userId);
    };

    interface SubjectModule {
        name: string;
        // Add other properties if needed
    }

    interface SubjectInfo {
        name: string;
        code: string;
        branch: string;
        year: number;
        semester: number;
        modules: SubjectModule[];
        // Add other properties if needed
    }

    interface SubjectProgress {
        [key: string]: boolean | any;
        // e.g., module_0: true, module_1: false, etc.
    }

    interface ProgressResult {
        percentage: number;
        completedCount: number;
        totalModules: number;
    }

    const calculateProgress = (
        subjectProgress: SubjectProgress,
        subjectId: string
    ): ProgressResult => {
        const subjectInfo: SubjectInfo = syllabusData[subjectId];
        if (!subjectInfo || !subjectInfo.modules) return { percentage: 0, completedCount: 0, totalModules: 0 };

        const totalModules: number = subjectInfo.modules.length;
        if (totalModules === 0) return { percentage: 0, completedCount: 0, totalModules: 0 };

        let completedCount = 0;

        for (let i = 0; i < totalModules; i++) {
            if (subjectProgress[`module_${i}`] === true) {
                completedCount++;
            }
        }

        return {
            percentage: Math.round((completedCount / totalModules) * 100),
            completedCount,
            totalModules
        };
    };

    interface RenderProgressDataProps {
        userId: string;
    }

    interface UserProgressData {
        [key: string]: SubjectProgress | any;
        updatedAt?: { toDate: () => Date };
    }

    const renderProgressData = (userId: string): React.ReactElement => {
        const progress: UserProgressData = userProgress[userId];
        return (
            <UserProgressDetails
                progress={progress}
                syllabusData={syllabusData}
                calculateProgress={calculateProgress}
                formatDate={formatDate}
            />
        );
    };

    const filteredUsers = users.filter(user => {
        const searchLower = searchQuery.toLowerCase();
        return (
            user.name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.id.toLowerCase().includes(searchLower)
        );
    });

    if (!isAdmin) {
        return (
            <ProtectedRoute>
                <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
                    <div className={`${cardBg} p-8 rounded-lg shadow-lg text-center max-w-md ${borderColor} border`}>
                        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Access Denied</h2>
                        <p className={secondaryText}>You don't have permission to access this page.</p>
                        <Link href="/dashboard" className="mt-4 inline-block skeu-btn-primary px-4 py-2 rounded-lg text-sm font-medium">
                            Go back to Dashboard
                        </Link>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen transition-colors duration-200 pb-8" style={{ background: 'var(--surface-base)' }}>
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
                                <LogoIcon size={32} />
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
                                <button
                                    onClick={fetchAllData}
                                    className="skeu-btn-primary text-sm py-2 px-4 rounded-lg font-medium flex items-center"
                                    disabled={loading}
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                    <span>Refresh</span>
                                </button>
                            </div>

                            {/* Hamburger for Mobile */}
                            <div className="md:hidden">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="skeu-btn-icon rounded-lg"
                                    aria-label="Open Menu"
                                >
                                    <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
                <AdminSidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                    pathname={pathname}
                    user={user}
                    logout={logout}
                    loading={loading}
                    fetchAllData={fetchAllData}
                    secondaryText={secondaryText}
                />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AdminStatsCards
                        usersCount={users.length}
                        activeLearners={Object.keys(userProgress).filter(id => userProgress[id] && Object.keys(userProgress[id]).length > 0).length}
                        subjectsCount={Object.keys(syllabusData).length}
                        newThisWeek={users.filter(user => {
                            const weekAgo = new Date();
                            weekAgo.setDate(weekAgo.getDate() - 7);
                            return user.createdAt && user.createdAt > weekAgo;
                        }).length}
                    />
                    <div className="skeu-card-static rounded-xl border border-skeu">
                        <div className="p-6" style={{ borderBottom: '1px solid var(--border-primary)' }}>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h2 className="text-xl font-bold skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>
                                        User Management
                                    </h2>
                                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                                        Monitor user activity and learning progress
                                    </p>
                                </div>
                                <UserSearchBar
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    fetchAllData={fetchAllData}
                                    loading={loading}
                                />
                            </div>
                        </div>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mb-4" style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }}></div>
                                <p style={{ color: 'var(--text-secondary)' }}>Loading user data...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                {/* Mobile Cards */}
                                <div className="sm:hidden space-y-4 p-6">
                                    {filteredUsers.map((user) => (
                                        <UserMobileCard
                                            key={user.id}
                                            user={user}
                                            expandedUser={expandedUser}
                                            toggleUserExpand={toggleUserExpand}
                                            formatDate={formatDate}
                                            renderProgressData={renderProgressData}
                                        />
                                    ))}
                                </div>
                                {/* Desktop Table */}
                                <div className="hidden sm:block">
                                    <UserTable
                                        filteredUsers={filteredUsers}
                                        expandedUser={expandedUser}
                                        toggleUserExpand={toggleUserExpand}
                                        formatDate={formatDate}
                                        userProgress={userProgress}
                                        renderProgressData={renderProgressData}
                                    />
                                </div>
                            </div>
                        )}
                        {!loading && filteredUsers.length === 0 && (
                            <div className="text-center py-16">
                                <div className="skeu-inset mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-12 h-12" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" /></svg>
                                </div>
                                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                                    {searchQuery ? 'No matching users found' : 'No users registered yet'}
                                </h3>
                                <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                                    {searchQuery
                                        ? 'Try adjusting your search terms or clear the search to see all users.'
                                        : 'Users will appear here once they register and start using the platform.'
                                    }
                                </p>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="skeu-btn-primary inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
};