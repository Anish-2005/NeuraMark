'use client'
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { useTheme } from '@/app/context/ThemeContext';
import { Sun, Moon, BookOpen, ChevronDown, ChevronUp, RefreshCw, User, BarChart2, Target, Award, TrendingUp, X, Menu, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/app/lib/firebase';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';


export default function KraKpiPage() {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userProgress, setUserProgress] = useState<DocumentData | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [syllabusData, setSyllabusData] = useState<{ [key: string]: SubjectInfo }>({});
    const router = useRouter();
    const pathname = usePathname();
    const { theme, toggleTheme, isDark } = useTheme();
    const [activeTab, setActiveTab] = useState('kpi');
    const [selectedSemester, setSelectedSemester] = useState<string | number>('all');


    // Skeuomorphic theme styles
    const cardBg = 'skeu-card-static';
    const textColor = 'text-skeu-primary';
    const secondaryText = 'text-skeu-secondary';
    const borderColor = 'border-skeu';

    const fetchUserData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Fetch user progress
            const progressDoc = await getDoc(doc(db, 'userProgress', user.uid));
            if (progressDoc.exists()) {
                setUserProgress(progressDoc.data());
            } else {
                setUserProgress(null);
            }

            // Fetch syllabus data for all subjects in progress
            if (progressDoc.exists()) {
                const progressData = progressDoc.data();
                const subjectIds = Object.keys(progressData)
                    .filter(key => key.startsWith('subject_'))
                    .map(key => key.replace('subject_', ''));

                const syllabusMap: { [key: string]: any } = {};
                for (const subjectId of subjectIds) {
                    const subjectDoc = await getDoc(doc(db, 'syllabus', subjectId));
                    if (subjectDoc.exists()) {
                        syllabusMap[subjectId] = subjectDoc.data();
                    }
                }
                setSyllabusData(syllabusMap);
            }

            // Fetch user's saved semester preference
            const userPrefsRef = doc(db, 'userPreferences', user.uid);
            const userPrefsDoc = await getDoc(userPrefsRef);
            if (userPrefsDoc.exists() && userPrefsDoc.data().defaultSemesterKPI) {
                setSelectedSemester(userPrefsDoc.data().defaultSemesterKPI);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user, fetchUserData]);

    interface SubjectInfo {
        name: string;
        code: string;
        year: number;
        semester: string | number;
        modules: any[];
        [key: string]: any;
    }

    interface SubjectProgress {
        [key: string]: boolean;
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

    const getAvailableSemesters = () => {
        const semesters = new Set(
            Object.values(syllabusData)
                .map(subject => subject.semester)
                .filter(Boolean)
        );
        return Array.from(semesters).sort();
    };

    const handleSemesterChange = async (semester: string | number): Promise<void> => {
        setSelectedSemester(semester);
        try {
            await setDoc(doc(db, 'userPreferences', user!.uid), {
                defaultSemesterKPI: semester
            }, { merge: true });
        } catch (error) {
            console.error('Error saving semester preference:', error);
        }
    };

    const getKpiData = () => {
        if (!userProgress) return [];

        return Object.entries(userProgress)
            .filter(([key]) => key.startsWith('subject_'))
            .map(([key, value]) => {
                const subjectId = key.replace('subject_', '');
                const subjectInfo = syllabusData[subjectId];
                if (!subjectInfo) return null;

                const progress = calculateProgress(value as SubjectProgress, subjectId);

                return {
                    subjectId,
                    name: subjectInfo.name,
                    code: subjectInfo.code,
                    progress: progress.percentage,
                    completed: progress.completedCount,
                    total: progress.totalModules,
                    year: subjectInfo.year,
                    semester: subjectInfo.semester
                };
            })
            .filter((item): item is NonNullable<typeof item> => {
                if (item === null) return false;
                if (selectedSemester === 'all') return true;
                return item.semester === selectedSemester;
            })
            .sort((a, b) => b.progress - a.progress);
    };

    const getKraData = () => {
        const kpiData = getKpiData();
        if (kpiData.length === 0) return [];

        // Group by year and semester
        const kraData: { [key: string]: { name: string; subjects: number; totalModules: number; completedModules: number; avgProgress: number } } = {};

        kpiData.forEach(item => {
            const key = `Year ${item.year} - Semester ${item.semester}`;
            if (!kraData[key]) {
                kraData[key] = {
                    name: key,
                    subjects: 0,
                    totalModules: 0,
                    completedModules: 0,
                    avgProgress: 0
                };
            }

            kraData[key].subjects += 1;
            kraData[key].totalModules += item.total;
            kraData[key].completedModules += item.completed;
        });

        // Calculate average progress for each KRA
        Object.keys(kraData).forEach(key => {
            kraData[key].avgProgress = Math.round(
                (kraData[key].completedModules / kraData[key].totalModules) * 100
            );
        });

        return Object.values(kraData);
    };

    const getYearlyProgressData = () => {
        const kpiData = getKpiData();
        if (kpiData.length === 0) return [];

        const yearlyData: { [key: string]: { name: string; subjects: number; totalModules: number; completedModules: number; progress: number } } = {};

        kpiData.forEach(item => {
            const yearKey = `Year ${item.year}`;
            if (!yearlyData[yearKey]) {
                yearlyData[yearKey] = {
                    name: yearKey,
                    subjects: 0,
                    totalModules: 0,
                    completedModules: 0,
                    progress: 0
                };
            }

            yearlyData[yearKey].subjects += 1;
            yearlyData[yearKey].totalModules += item.total;
            yearlyData[yearKey].completedModules += item.completed;
        });

        // Calculate progress for each year
        Object.keys(yearlyData).forEach(key => {
            yearlyData[key].progress = Math.round(
                (yearlyData[key].completedModules / yearlyData[key].totalModules) * 100
            );
        });

        return Object.values(yearlyData);
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
    }: {
        cx: number;
        cy: number;
        midAngle: number;
        innerRadius: number;
        outerRadius: number;
        percent: number;
        index: number;
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen transition-colors duration-200 pb-8" style={{ background: 'var(--surface-base)' }}>
                {/* Navigation */}
                <nav className="skeu-navbar sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16 md:h-20">
                            <div className="flex items-center space-x-3 min-w-0">
                                <Link href="/dashboard" className="skeu-btn-icon rounded-lg" aria-label="Back to Dashboard">
                                    <ArrowLeft className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
                                </Link>
                                <div className="skeu-inset p-1 rounded-lg">
                                    <Image src="/emblem.png" alt="NeuraMark Logo" width={32} height={32} className="rounded shrink-0" priority />
                                </div>
                                <div>
                                    <h1 className="text-lg sm:text-2xl font-bold skeu-text-embossed tracking-tight truncate max-w-[140px] sm:max-w-xs" style={{ color: 'var(--text-primary)' }}>Learning Analytics</h1>
                                    <p className="text-xs hidden sm:block" style={{ color: 'var(--text-secondary)' }}>KPI & KRA Dashboard</p>
                                </div>
                            </div>
                            <div className="hidden md:flex items-center space-x-3">
                                <button onClick={fetchUserData} className="skeu-btn-primary flex items-center px-4 py-2 rounded-lg text-sm font-medium" disabled={loading}>
                                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                    <span>Refresh Data</span>
                                </button>
                                <button onClick={toggleTheme} className="skeu-btn-icon rounded-xl" aria-label="Toggle Theme">
                                    <AnimatePresence mode="wait" initial={false}>
                                        {isDark ? (
                                            <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.3 }}>
                                                <Sun className="w-5 h-5" style={{ color: 'var(--accent-warning)' }} />
                                            </motion.div>
                                        ) : (
                                            <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.3 }}>
                                                <Moon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </button>
                                {user?.photoURL ? (
                                    <div className="skeu-inset p-0.5 rounded-full"><Image src={user.photoURL} alt={user.displayName || 'User'} width={28} height={28} className="rounded-full" /></div>
                                ) : (
                                    <div className="skeu-inset h-7 w-7 rounded-full flex items-center justify-center"><User size={16} style={{ color: 'var(--text-secondary)' }} /></div>
                                )}
                            </div>
                            <div className="md:hidden">
                                <button onClick={() => setSidebarOpen(true)} aria-label="Open Menu" className="skeu-btn-icon rounded-lg"><Menu className="w-5 h-5" /></button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Mobile Sidebar */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.3 }} className="skeu-sidebar fixed inset-y-0 left-0 z-50 w-64 p-4 flex flex-col gap-4">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="skeu-inset p-1 rounded-lg"><Image src="/emblem.png" alt="NeuraMark Logo" width={28} height={28} className="rounded" /></div>
                                        <h2 className="font-bold text-lg skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>Analytics</h2>
                                    </div>
                                    <button onClick={() => setSidebarOpen(false)} aria-label="Close Menu" className="skeu-btn-icon rounded-lg"><X className="w-5 h-5" /></button>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Link href="/dashboard" onClick={() => setSidebarOpen(false)} className={`skeu-btn-secondary px-3 py-2 rounded-lg text-sm font-medium ${pathname === '/dashboard' ? 'opacity-100' : 'opacity-70'}`}>Dashboard</Link>
                                    <Link href="/chat" onClick={() => setSidebarOpen(false)} className={`skeu-btn-secondary px-3 py-2 rounded-lg text-sm font-medium ${pathname === '/chat' ? 'opacity-100' : 'opacity-70'}`}>Chat</Link>
                                </div>
                                <button onClick={() => { fetchUserData(); setSidebarOpen(false); }} className="skeu-btn-primary w-full py-2 rounded-lg text-sm flex items-center justify-center space-x-2" disabled={loading}>
                                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /><span>Refresh Progress</span>
                                </button>
                                <div className="flex items-center space-x-2 mt-auto">
                                    {user?.photoURL ? (<div className="skeu-inset p-0.5 rounded-full"><Image src={user.photoURL} alt={user.displayName || 'User'} width={32} height={32} className="rounded-full" /></div>) : (<div className="skeu-inset h-8 w-8 rounded-full flex items-center justify-center"><User size={16} style={{ color: 'var(--text-secondary)' }} /></div>)}
                                    <span className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>{user?.displayName || user?.email}</span>
                                </div>
                                <button onClick={() => { logout(); setSidebarOpen(false); }} className="skeu-btn-danger w-full py-2 rounded-lg text-sm">Logout</button>
                                <button onClick={(e) => { toggleTheme(e); setSidebarOpen(false); }} className="skeu-btn-secondary p-2 w-full rounded-lg flex justify-center items-center" aria-label="Toggle Theme">
                                    {isDark ? <><Sun className="w-5 h-5 mr-2" style={{ color: 'var(--accent-warning)' }} /><span>Light Mode</span></> : <><Moon className="w-5 h-5 mr-2" style={{ color: 'var(--accent-primary)' }} /><span>Dark Mode</span></>}
                                </button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6">
                    <div className="skeu-card-static p-6 sm:p-8 rounded-2xl">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                            <div className="flex items-center gap-4">
                                <div className="skeu-inset p-3 rounded-2xl">
                                    <BarChart2 className="w-8 h-8" style={{ color: 'var(--accent-primary)' }} />
                                </div>
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold skeu-text-embossed mb-1" style={{ color: 'var(--text-primary)' }}>Key Performance Indicators</h2>
                                    <div className="flex items-center space-x-2">
                                        {user?.photoURL ? (
                                            <div className="skeu-inset p-0.5 rounded-full"><Image src={user.photoURL} alt={user.displayName || 'User'} width={28} height={28} className="rounded-full" /></div>
                                        ) : (
                                            <div className="skeu-inset h-7 w-7 rounded-full flex items-center justify-center"><User size={16} style={{ color: 'var(--text-secondary)' }} /></div>
                                        )}
                                        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{user?.email}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="skeu-tabs flex mt-4 sm:mt-0">
                                <button onClick={() => setActiveTab('kpi')} className={`skeu-tab flex items-center ${activeTab === 'kpi' ? 'active' : ''}`}><Target className="w-4 h-4 mr-2" />KPIs</button>
                                <button onClick={() => setActiveTab('kra')} className={`skeu-tab flex items-center ${activeTab === 'kra' ? 'active' : ''}`}><Award className="w-4 h-4 mr-2" />KRAs</button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col justify-center items-center h-64 space-y-4">
                                <div className="animate-spin rounded-full h-16 w-16 border-4" style={{ borderColor: 'var(--surface-inset)', borderTopColor: 'var(--accent-primary)' }}></div>
                                <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading analytics...</p>
                            </div>
                        ) : !userProgress ? (
                            <div className="text-center py-16">
                                <div className="inline-block skeu-inset p-6 rounded-2xl">
                                    <BarChart2 className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Analytics Data</h3>
                                    <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>Your learning analytics will appear here after you make progress in your subjects.</p>
                                    <Link href="/dashboard" className="skeu-btn-primary inline-flex items-center px-6 py-3 rounded-lg font-medium">Go to Dashboard</Link>
                                </div>
                            </div>
                        ) : activeTab === 'kpi' ? (
                            <div className="space-y-8">
                                {getAvailableSemesters().length > 0 && (
                                    <div className="skeu-inset p-4 rounded-xl">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Filter by Semester:</span>
                                            <button onClick={() => handleSemesterChange('all')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${selectedSemester === 'all' ? 'skeu-btn-primary' : 'skeu-btn-secondary'}`}>All Semesters</button>
                                            {getAvailableSemesters().map(semester => (
                                                <button key={semester} onClick={() => handleSemesterChange(semester)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${selectedSemester === semester ? 'skeu-btn-primary' : 'skeu-btn-secondary'}`}>Semester {semester}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="skeu-card-static p-6 rounded-xl">
                                    <h3 className="text-lg font-semibold skeu-text-embossed mb-4 flex items-center" style={{ color: 'var(--text-primary)' }}>
                                        <TrendingUp className="w-5 h-5 mr-2" style={{ color: 'var(--accent-primary)' }} />Overall Learning Progress
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="skeu-inset p-4 rounded-xl">
                                            <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Total Subjects</div>
                                            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{getKpiData().length}</div>
                                        </div>
                                        <div className="skeu-inset p-4 rounded-xl">
                                            <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Total Modules</div>
                                            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{getKpiData().reduce((sum, subject) => sum + subject.total, 0)}</div>
                                        </div>
                                        <div className="skeu-inset p-4 rounded-xl">
                                            <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Average Completion</div>
                                            <div className="text-2xl font-bold" style={{ color: 'var(--accent-success)' }}>{Math.round(getKpiData().reduce((sum, subject) => sum + subject.completed, 0) / getKpiData().reduce((sum, subject) => sum + subject.total, 0) * 100) || 0}%</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="skeu-card-static p-6 rounded-xl">
                                    <h3 className="text-lg font-semibold skeu-text-embossed mb-4" style={{ color: 'var(--text-primary)' }}>Subject-wise Performance</h3>
                                    <div className="skeu-inset p-4 rounded-xl h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={getKpiData()} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
                                                <XAxis dataKey="code" angle={-45} textAnchor="end" height={70} tick={{ fill: 'var(--text-secondary)' }} />
                                                <YAxis tick={{ fill: 'var(--text-secondary)' }} label={{ value: 'Completion %', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)' }} />
                                                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-dark)', color: 'var(--text-primary)', borderRadius: '12px' }} formatter={(value) => [`${value}%`, 'Completion']} labelFormatter={(label) => `Subject: ${label}`} />
                                                <Bar dataKey="progress" name="Completion %" fill="var(--accent-primary)" radius={[4, 4, 0, 0]}>
                                                    {getKpiData().map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.progress === 100 ? '#10B981' : COLORS[index % COLORS.length]} />))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="skeu-card-static p-6 rounded-xl">
                                    <h3 className="text-lg font-semibold skeu-text-embossed mb-4" style={{ color: 'var(--text-primary)' }}>Subject Progress Details</h3>
                                    <div className="overflow-x-auto skeu-inset rounded-xl">
                                        <table className="min-w-full">
                                            <thead>
                                                <tr style={{ borderBottom: '1px solid var(--border-dark)' }}>
                                                    {['Subject', 'Year/Semester', 'Progress', 'Modules Completed', 'Status'].map(h => (
                                                        <th key={h} scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getKpiData().map((subject) => (
                                                    <tr key={subject.subjectId} style={{ borderBottom: '1px solid var(--border-dark)' }}>
                                                        <td className="px-6 py-4" style={{ color: 'var(--text-primary)' }}>
                                                            <div className="font-medium max-w-[300px] break-words">{subject.name}</div>
                                                            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{subject.code}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>Year {subject.year}, Sem {subject.semester}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="w-32 mr-2"><div className="skeu-inset w-full rounded-full h-2.5"><div className="h-2.5 rounded-full transition-all" style={{ width: `${subject.progress}%`, background: subject.progress === 100 ? 'var(--accent-success)' : 'var(--accent-primary)' }}></div></div></div>
                                                                <span className="text-sm font-medium" style={{ color: subject.progress === 100 ? 'var(--accent-success)' : 'var(--accent-primary)' }}>{subject.progress}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>{subject.completed} / {subject.total}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="skeu-badge text-xs" style={{ background: subject.progress === 100 ? 'var(--accent-success)' : subject.progress >= 70 ? 'var(--accent-primary)' : subject.progress >= 40 ? 'var(--accent-warning)' : 'var(--accent-danger)', color: '#fff' }}>
                                                                {subject.progress === 100 ? 'Completed' : subject.progress >= 70 ? 'Good Progress' : subject.progress >= 40 ? 'In Progress' : 'Needs Attention'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="skeu-card-static p-6 rounded-xl">
                                    <h3 className="text-lg font-semibold skeu-text-embossed mb-4" style={{ color: 'var(--text-primary)' }}>Key Result Areas (By Semester)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="skeu-inset p-5 rounded-xl">
                                            <h4 className="text-md font-medium mb-3 skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>Semester-wise Progress Distribution</h4>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie data={getKraData()} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={80} fill="#8884d8" dataKey="avgProgress">
                                                            {getKraData().map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                                        </Pie>
                                                        <Tooltip contentStyle={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-dark)', color: 'var(--text-primary)', borderRadius: '12px' }} formatter={(value: number) => [`${value}%`, 'Average Completion']} labelFormatter={(label) => `Semester: ${label}`} />
                                                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                        <div className="skeu-inset p-5 rounded-xl">
                                            <h4 className="text-md font-medium mb-3 skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>Yearly Progress Trend</h4>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={getYearlyProgressData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
                                                        <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)' }} />
                                                        <YAxis tick={{ fill: 'var(--text-secondary)' }} label={{ value: 'Completion %', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)' }} />
                                                        <Tooltip contentStyle={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-dark)', color: 'var(--text-primary)', borderRadius: '12px' }} formatter={(value: number) => [`${value}%`, 'Average Completion']} labelFormatter={(label) => `Year: ${label}`} />
                                                        <Bar dataKey="progress" name="Completion %" fill="var(--accent-primary)" radius={[4, 4, 0, 0]}>
                                                            {getYearlyProgressData().map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="skeu-card-static p-6 rounded-xl">
                                    <h3 className="text-lg font-semibold skeu-text-embossed mb-4" style={{ color: 'var(--text-primary)' }}>Semester-wise Key Results</h3>
                                    <div className="overflow-x-auto skeu-inset rounded-xl">
                                        <table className="min-w-full">
                                            <thead>
                                                <tr style={{ borderBottom: '1px solid var(--border-dark)' }}>
                                                    {['Semester', 'Subjects', 'Modules Completed', 'Average Progress', 'Status'].map(h => (
                                                        <th key={h} scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getKraData().map((kra) => (
                                                    <tr key={kra.name} style={{ borderBottom: '1px solid var(--border-dark)' }}>
                                                        <td className="px-6 py-4 whitespace-nowrap font-medium" style={{ color: 'var(--text-primary)' }}>{kra.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>{kra.subjects}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>{kra.completedModules} / {kra.totalModules}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="w-32 mr-2"><div className="skeu-inset w-full rounded-full h-2.5"><div className="h-2.5 rounded-full transition-all" style={{ width: `${kra.avgProgress}%`, background: kra.avgProgress === 100 ? 'var(--accent-success)' : 'var(--accent-primary)' }}></div></div></div>
                                                                <span className="text-sm font-medium" style={{ color: kra.avgProgress === 100 ? 'var(--accent-success)' : 'var(--accent-primary)' }}>{kra.avgProgress}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="skeu-badge text-xs" style={{ background: kra.avgProgress === 100 ? 'var(--accent-success)' : kra.avgProgress >= 70 ? 'var(--accent-primary)' : kra.avgProgress >= 40 ? 'var(--accent-warning)' : 'var(--accent-danger)', color: '#fff' }}>
                                                                {kra.avgProgress === 100 ? 'Completed' : kra.avgProgress >= 70 ? 'On Track' : kra.avgProgress >= 40 ? 'In Progress' : 'Needs Focus'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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