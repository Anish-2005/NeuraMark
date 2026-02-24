// app/dashboard/exams/page.js
'use client'
import { Suspense } from 'react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { useTheme } from '@/app/context/ThemeContext';
import { User, Menu, Moon, Sun, Plus, Trash2, Edit, Save, X, Calendar, Clock, BookOpen, GraduationCap, Download, ArrowLeft, RefreshCw, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

type Exam = {
    id: string;
    name: string;
    date: string;
    time?: string;
    subject?: string;
    semester?: number | string;
    location?: string;
    notes?: string;
    userId?: string;
    createdAt?: any;
    updatedAt?: any;
};

export default function ExamsPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const { theme, toggleTheme, isDark } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddExam, setShowAddExam] = useState(false);
    const [newExam, setNewExam] = useState({
        name: '',
        date: '',
        time: '',
        subject: '',
        semester: '',
        location: '',
        notes: ''
    });
    const [editingExamId, setEditingExamId] = useState<string | null>(null);
    const [filter, setFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'

    type EnrolledSubject = {
        id: string;
        name?: string;
        semester?: number | string;
        [key: string]: any;
    };
    const [enrolledSubjects, setEnrolledSubjects] = useState<EnrolledSubject[]>([]);
    const [selectedSemester, setSelectedSemester] = useState('all');
    const [expandedExamId, setExpandedExamId] = useState<string | null>(null);

    const fetchExams = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Fetch exams
            const q = query(collection(db, 'userExams'), where('userId', '==', user.uid));
            const querySnapshot = await getDocs(q);
            const examsData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name ?? '',
                    date: data.date ?? '',
                    time: data.time ?? '',
                    subject: data.subject ?? '',
                    semester: data.semester ?? '',
                    location: data.location ?? '',
                    notes: data.notes ?? '',
                    userId: data.userId ?? '',
                    createdAt: data.createdAt ?? null,
                    updatedAt: data.updatedAt ?? null,
                };
            });
            setExams(examsData);

            // Fetch enrolled subjects to get semesters
            const progressQuery = query(collection(db, 'userProgress'), where('userId', '==', user.uid));
            const progressSnapshot = await getDocs(progressQuery);
            const subjectIds = progressSnapshot.docs.map(doc => {
                const data = doc.data();
                return data.subjectId;
            }).filter(Boolean);

            if (subjectIds.length > 0) {
                const syllabusQuery = query(collection(db, 'syllabus'));
                const syllabusSnapshot = await getDocs(syllabusQuery);
                const subjects = syllabusSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as EnrolledSubject))
                    .filter(subject => subjectIds.includes(subject.id));
                setEnrolledSubjects(subjects);
            }

            // Fetch user's saved semester preference
            const userPrefsRef = doc(db, 'userPreferences', user.uid);
            const userPrefsDoc = await getDoc(userPrefsRef);
            if (userPrefsDoc.exists() && userPrefsDoc.data().defaultSemesterExams) {
                setSelectedSemester(userPrefsDoc.data().defaultSemesterExams);
            }
        } catch (error) {
            console.error('Error fetching exams:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, [user]);

    const getAvailableSemesters = () => {
        const examSemesters = exams.map(exam => exam.semester).filter(Boolean);
        const subjectSemesters = enrolledSubjects.map(subject => subject.semester).filter(Boolean);
        const semesters = new Set([...examSemesters, ...subjectSemesters]);
        return Array.from(semesters).sort();
    };

    const handleSemesterChange = async (semester: string) => {
        setSelectedSemester(semester);
        if (!user) return;
        try {
            await setDoc(doc(db, 'userPreferences', user.uid), {
                defaultSemesterExams: semester
            }, { merge: true });
        } catch (error) {
            console.error('Error saving semester preference:', error);
        }
    };

    const filteredExams = exams.filter(exam => {
        const now = new Date();
        const examDate = new Date(`${exam.date}T${exam.time || '00:00'}`);

        let timeMatch = true;
        if (filter === 'upcoming') timeMatch = examDate >= now;
        else if (filter === 'past') timeMatch = examDate < now;

        let semesterMatch = true;
        if (selectedSemester !== 'all') {
            semesterMatch = String(exam.semester) === String(selectedSemester);
        }

        return timeMatch && semesterMatch;
    }).sort((a, b) => {
        const now = new Date();
        const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
        const dateB = new Date(`${b.date}T${b.time || '00:00'}`);

        if (filter === 'upcoming') {
            return dateA.getTime() - dateB.getTime();
        } else if (filter === 'past') {
            return dateB.getTime() - dateA.getTime();
        } else {
            const isAPast = dateA < now;
            const isBPast = dateB < now;
            if (isAPast && !isBPast) return 1;
            if (!isAPast && isBPast) return -1;
            if (!isAPast && !isBPast) return dateA.getTime() - dateB.getTime();
            return dateB.getTime() - dateA.getTime();
        }
    });

    const handleAddExam = async () => {
        if (!newExam.name || !newExam.date || !newExam.semester) {
            alert('Exam name, date, and semester are required');
            return;
        }

        try {
            if (!user) return;
            const examData = {
                ...newExam,
                userId: user.uid,
                semester: parseInt(newExam.semester),
                updatedAt: serverTimestamp()
            };

            if (editingExamId) {
                await updateDoc(doc(db, 'userExams', editingExamId), examData);
                setExams(exams.map(exam =>
                    exam.id === editingExamId ? { ...exam, ...examData } : exam
                ));
            } else {
                const docRef = await addDoc(collection(db, 'userExams'), {
                    ...examData,
                    createdAt: serverTimestamp()
                });
                setExams([...exams, { id: docRef.id, ...examData }]);
            }

            setShowAddExam(false);
            setNewExam({
                name: '',
                date: '',
                time: '',
                subject: '',
                semester: '',
                location: '',
                notes: ''
            });
            setEditingExamId(null);
        } catch (error) {
            console.error('Error saving exam:', error);
            alert('Failed to save exam. Please try again.');
        }
    };

    const handleDeleteExam = async (examId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this exam?");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, 'userExams', examId));
            setExams(exams.filter(exam => exam.id !== examId));
        } catch (error) {
            console.error('Error deleting exam:', error);
            alert('Failed to delete exam.');
        }
    };

    const handleEditExam = (exam: Exam) => {
        setEditingExamId(exam.id);
        setNewExam({
            name: exam.name,
            date: exam.date,
            time: exam.time || '',
            subject: exam.subject || '',
            semester: exam.semester ? exam.semester.toString() : '',
            location: exam.location || '',
            notes: exam.notes || ''
        });
        setShowAddExam(true);
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (timeString: string) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const getDaysRemaining = (dateString: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const examDate = new Date(dateString);
        examDate.setHours(0, 0, 0, 0);
        const diffTime = examDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays > 1) return `${diffDays} days remaining`;
        if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
        return '';
    };

    const exportToPDF = () => {
        const content = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>My Exam Schedule</title>
                <style>
                    body { font-family: sans-serif; margin: 40px; color: #333; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #6366f1; padding-bottom: 20px; }
                    .header h1 { color: #6366f1; margin: 0; }
                    .exam-card { border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 20px; page-break-inside: avoid; }
                    .exam-title { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
                    .exam-subject { color: #6366f1; font-size: 14px; margin-bottom: 15px; }
                    .exam-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                    .detail-item { background: #f9fafb; padding: 10px; border-radius: 8px; }
                    .detail-label { font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>My Exam Schedule</h1>
                    <p>Generated on ${new Date().toLocaleDateString()}</p>
                    <p><strong>${user?.displayName || user?.email}</strong></p>
                </div>
                ${filteredExams.map(exam => `
                    <div class="exam-card">
                        <div class="exam-title">${exam.name}</div>
                        ${exam.subject ? `<div class="exam-subject">Subject: ${exam.subject}</div>` : ''}
                        <div class="exam-details">
                            <div class="detail-item"><div class="detail-label">Date</div><div>${formatDate(exam.date)}</div></div>
                            ${exam.time ? `<div class="detail-item"><div class="detail-label">Time</div><div>${formatTime(exam.time)}</div></div>` : ''}
                            ${exam.location ? `<div class="detail-item"><div class="detail-label">Location</div><div>${exam.location}</div></div>` : ''}
                            ${exam.semester ? `<div class="detail-item"><div class="detail-label">Semester</div><div>Semester ${exam.semester}</div></div>` : ''}
                        </div>
                    </div>
                `).join('')}
            </body>
            </html>
        `;

        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `exam-schedule-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <ProtectedRoute>
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--surface-base)' }}>
                    <div className="animate-spin rounded-full h-12 w-12 border-4" style={{ borderColor: 'var(--surface-inset)', borderTopColor: 'var(--accent-primary)' }}></div>
                </div>
            }>
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
                                        <h1 className="text-lg sm:text-2xl font-bold skeu-text-embossed tracking-tight truncate max-w-[140px] sm:max-w-xs" style={{ color: 'var(--text-primary)' }}>My Exams</h1>
                                        <p className="text-xs hidden sm:block" style={{ color: 'var(--text-secondary)' }}>Schedule & Tracker</p>
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center space-x-3">
                                    <button onClick={fetchExams} className="skeu-btn-primary flex items-center px-4 py-2 rounded-lg text-sm font-medium" disabled={loading}>
                                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                        <span>Refresh</span>
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
                                            <h2 className="font-bold text-lg skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>Exams</h2>
                                        </div>
                                        <button onClick={() => setSidebarOpen(false)} aria-label="Close Menu" className="skeu-btn-icon rounded-lg"><X className="w-5 h-5" /></button>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Link href="/dashboard" onClick={() => setSidebarOpen(false)} className={`skeu-btn-secondary px-3 py-2 rounded-lg text-sm font-medium ${pathname === '/dashboard' ? 'opacity-100' : 'opacity-70'}`}>Dashboard</Link>
                                        <Link href="/chat" onClick={() => setSidebarOpen(false)} className={`skeu-btn-secondary px-3 py-2 rounded-lg text-sm font-medium ${pathname === '/chat' ? 'opacity-100' : 'opacity-70'}`}>Chat</Link>
                                    </div>
                                    <button onClick={() => { fetchExams(); setSidebarOpen(false); }} className="skeu-btn-primary w-full py-2 rounded-lg text-sm flex items-center justify-center space-x-2" disabled={loading}>
                                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /><span>Refresh Exams</span>
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
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="skeu-inset p-3 rounded-2xl">
                                        <Calendar className="w-8 h-8" style={{ color: 'var(--accent-primary)' }} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-bold skeu-text-embossed mb-1" style={{ color: 'var(--text-primary)' }}>Exam Schedule</h2>
                                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Track and manage your upcoming tests</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={exportToPDF} disabled={filteredExams.length === 0} className="skeu-btn-secondary flex items-center px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                                        <Download className="w-4 h-4 mr-2" />Export PDF
                                    </button>
                                    <button onClick={() => setShowAddExam(true)} className="skeu-btn-primary flex items-center px-4 py-2 rounded-lg text-sm font-medium">
                                        <Plus className="w-4 h-4 mr-2" />Add Exam
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                                <div className="lg:col-span-1 space-y-6">
                                    <div className="skeu-inset p-4 rounded-xl">
                                        <label className="text-sm font-bold block mb-2 px-1" style={{ color: 'var(--text-secondary)' }}>Status Filter</label>
                                        <div className="space-y-2">
                                            {['upcoming', 'past', 'all'].map((f) => (
                                                <button key={f} onClick={() => setFilter(f)} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'skeu-btn-primary' : 'skeu-btn-secondary'}`}>
                                                    {f.charAt(0).toUpperCase() + f.slice(1)} Exams
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {getAvailableSemesters().length > 0 && (
                                        <div className="skeu-inset p-4 rounded-xl">
                                            <label className="text-sm font-bold block mb-2 px-1" style={{ color: 'var(--text-secondary)' }}>Semester</label>
                                            <div className="flex flex-wrap gap-2">
                                                <button onClick={() => handleSemesterChange('all')} className={`flex-1 min-w-[80px] px-3 py-2 rounded-lg text-xs font-medium transition-all ${selectedSemester === 'all' ? 'skeu-btn-primary' : 'skeu-btn-secondary'}`}>All</button>
                                                {getAvailableSemesters().map(sem => (
                                                    <button key={sem} onClick={() => handleSemesterChange(String(sem))} className={`flex-1 min-w-[80px] px-3 py-2 rounded-lg text-xs font-medium transition-all ${String(selectedSemester) === String(sem) ? 'skeu-btn-primary' : 'skeu-btn-secondary'}`}>Sem {sem}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="lg:col-span-3 space-y-4">
                                    {loading ? (
                                        <div className="flex flex-col justify-center items-center h-64 space-y-4">
                                            <div className="animate-spin rounded-full h-12 w-12 border-4" style={{ borderColor: 'var(--surface-inset)', borderTopColor: 'var(--accent-primary)' }}></div>
                                            <p className="text-sm animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading exam schedule...</p>
                                        </div>
                                    ) : filteredExams.length === 0 ? (
                                        <div className="skeu-inset rounded-2xl p-12 text-center">
                                            <div className="skeu-card-static w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <BookOpen className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
                                            </div>
                                            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Exams Found</h3>
                                            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters or add a new exam to your schedule.</p>
                                            <button onClick={() => setShowAddExam(true)} className="skeu-btn-primary px-6 py-2 rounded-lg font-medium">Add First Exam</button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {filteredExams.map((exam) => {
                                                const examDateObj = new Date(`${exam.date}T${exam.time || '00:00'}`);
                                                const isPast = examDateObj < new Date();
                                                const isExpanded = expandedExamId === exam.id;
                                                const daysRemaining = getDaysRemaining(exam.date);

                                                return (
                                                    <motion.div key={exam.id} layout className={`skeu-card-static group overflow-hidden ${isPast ? 'opacity-70 grayscale-[0.3]' : ''}`}>
                                                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer" onClick={() => setExpandedExamId(isExpanded ? null : exam.id)}>
                                                            <div className="flex items-center gap-4">
                                                                <div className={`skeu-inset p-3 rounded-xl ${isPast ? '' : 'text-accent-primary'}`} style={{ color: isPast ? 'var(--text-muted)' : 'var(--accent-primary)' }}>
                                                                    <GraduationCap className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{exam.name}</h3>
                                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                                                        <span className="flex items-center text-xs" style={{ color: 'var(--text-secondary)' }}><Calendar className="w-3.5 h-3.5 mr-1" />{formatDate(exam.date)}</span>
                                                                        {exam.time && <span className="flex items-center text-xs" style={{ color: 'var(--text-secondary)' }}><Clock className="w-3.5 h-3.5 mr-1" />{formatTime(exam.time)}</span>}
                                                                        {exam.semester && <span className="skeu-badge text-[10px] py-0 px-2" style={{ background: 'var(--surface-inset)', color: 'var(--text-primary)' }}>Sem {exam.semester}</span>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center justify-between sm:justify-end gap-3 px-1 sm:px-0">
                                                                <span className={`text-xs font-bold px-3 py-1 rounded-full skeu-inset`} style={{ color: isPast ? 'var(--text-muted)' : daysRemaining.includes('Today') ? 'var(--accent-danger)' : 'var(--accent-success)' }}>{daysRemaining}</span>
                                                                <div className="flex items-center gap-1">
                                                                    <button onClick={(e) => { e.stopPropagation(); handleEditExam(exam); }} className="skeu-btn-icon h-9 w-9 rounded-lg" aria-label="Edit"><Edit className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} /></button>
                                                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteExam(exam.id); }} className="skeu-btn-icon h-9 w-9 rounded-lg" aria-label="Delete"><Trash2 className="w-4 h-4" style={{ color: 'var(--accent-danger)' }} /></button>
                                                                    <div className={`skeu-btn-icon h-9 w-9 rounded-lg flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}><ChevronDown className="w-4 h-4" /></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <AnimatePresence>
                                                            {isExpanded && (
                                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t mx-4 pt-4 pb-6" style={{ borderColor: 'var(--border-skeu)' }}>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                                                                        <div className="space-y-4">
                                                                            {exam.subject && (
                                                                                <div className="skeu-inset p-3 rounded-lg">
                                                                                    <span className="text-[10px] uppercase font-bold block mb-1" style={{ color: 'var(--text-muted)' }}>Subject</span>
                                                                                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{exam.subject}</p>
                                                                                </div>
                                                                            )}
                                                                            {exam.location && (
                                                                                <div className="skeu-inset p-3 rounded-lg">
                                                                                    <span className="text-[10px] uppercase font-bold block mb-1" style={{ color: 'var(--text-muted)' }}>Location</span>
                                                                                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{exam.location}</p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="skeu-inset p-3 rounded-lg flex flex-col h-full">
                                                                            <span className="text-[10px] uppercase font-bold block mb-1" style={{ color: 'var(--text-muted)' }}>Notes</span>
                                                                            <p className="text-sm leading-relaxed whitespace-pre-wrap flex-grow" style={{ color: 'var(--text-primary)' }}>{exam.notes || 'No extra notes provided.'}</p>
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Add/Edit Modal */}
                    <AnimatePresence>
                        {showAddExam && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddExam(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="skeu-card-static w-full max-w-lg relative z-10 overflow-hidden rounded-2xl shadow-2xl">
                                    <div className="p-6 border-b" style={{ borderColor: 'var(--border-skeu)' }}>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="skeu-inset p-2 rounded-xl"><Plus className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} /></div>
                                                <h2 className="text-xl font-bold skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>{editingExamId ? 'Edit Exam' : 'New Exam'}</h2>
                                            </div>
                                            <button onClick={() => setShowAddExam(false)} className="skeu-btn-icon h-10 w-10 rounded-full"><X className="w-5 h-5" /></button>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <label className="text-xs font-bold block mb-1.5 px-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Exam Title *</label>
                                                <div className="skeu-inset p-1 rounded-xl">
                                                    <input type="text" value={newExam.name} onChange={(e) => setNewExam({ ...newExam, name: e.target.value })} className="w-full bg-transparent border-none focus:ring-0 p-2 text-sm" placeholder="e.g. Data Structures Midterm" style={{ color: 'var(--text-primary)' }} />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold block mb-1.5 px-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Date *</label>
                                                    <div className="skeu-inset p-1 rounded-xl">
                                                        <input type="date" value={newExam.date} onChange={(e) => setNewExam({ ...newExam, date: e.target.value })} className="w-full bg-transparent border-none focus:ring-0 p-2 text-sm" style={{ color: 'var(--text-primary)', colorScheme: isDark ? 'dark' : 'light' }} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold block mb-1.5 px-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Time</label>
                                                    <div className="skeu-inset p-1 rounded-xl">
                                                        <input type="time" value={newExam.time} onChange={(e) => setNewExam({ ...newExam, time: e.target.value })} className="w-full bg-transparent border-none focus:ring-0 p-2 text-sm" style={{ color: 'var(--text-primary)', colorScheme: isDark ? 'dark' : 'light' }} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold block mb-1.5 px-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Subject</label>
                                                <div className="skeu-inset p-1 rounded-xl">
                                                    <input type="text" value={newExam.subject} onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })} className="w-full bg-transparent border-none focus:ring-0 p-2 text-sm" placeholder="e.g. Computer Science" style={{ color: 'var(--text-primary)' }} />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold block mb-1.5 px-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Semester *</label>
                                                    <div className="skeu-inset p-1 rounded-xl">
                                                        <select value={newExam.semester} onChange={(e) => setNewExam({ ...newExam, semester: e.target.value })} className="w-full bg-transparent border-none focus:ring-0 p-2 text-sm appearance-none cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                                                            <option value="" style={{ background: 'var(--surface-raised)' }}>Choose...</option>
                                                            {Array.from({ length: 8 }, (_, i) => i + 1).map(sem => (
                                                                <option key={sem} value={sem} style={{ background: 'var(--surface-raised)' }}>Semester {sem}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold block mb-1.5 px-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Location</label>
                                                    <div className="skeu-inset p-1 rounded-xl">
                                                        <input type="text" value={newExam.location} onChange={(e) => setNewExam({ ...newExam, location: e.target.value })} className="w-full bg-transparent border-none focus:ring-0 p-2 text-sm" placeholder="e.g. Hall A, 3rd Floor" style={{ color: 'var(--text-primary)' }} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold block mb-1.5 px-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Notes</label>
                                                <div className="skeu-inset p-1 rounded-xl">
                                                    <textarea value={newExam.notes} onChange={(e) => setNewExam({ ...newExam, notes: e.target.value })} rows={3} className="w-full bg-transparent border-none focus:ring-0 p-2 text-sm" placeholder="Bring ID card and calculator..." style={{ color: 'var(--text-primary)' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 border-t flex flex-col sm:flex-row gap-3" style={{ borderColor: 'var(--border-skeu)' }}>
                                        <button onClick={() => setShowAddExam(false)} className="skeu-btn-secondary flex-1 py-3 px-4 rounded-xl font-bold">Cancel</button>
                                        <button onClick={handleAddExam} disabled={!newExam.name || !newExam.date || !newExam.semester} className="skeu-btn-primary flex-1 py-3 px-4 rounded-xl font-bold disabled:opacity-50">Save Exam</button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </Suspense>
        </ProtectedRoute>
    );
}