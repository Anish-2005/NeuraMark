'use client';

import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, ArrowLeft, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoIcon } from '../components/Logo';

export default function TermsOfService() {
    const { toggleTheme, isDark } = useTheme();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <main className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'var(--surface-base)' }}>
            {/* Abstract Animated Glow Backdrops */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 fixed">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="absolute -bottom-[20%] left-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px]"
                    style={{ background: isDark ? 'rgba(80, 208, 184, 0.05)' : 'rgba(13, 148, 136, 0.03)' }}
                />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
            </div>

            {/* Header */}
            <header className="w-full flex justify-between items-center py-6 px-5 sm:px-8 md:px-16 z-50 sticky top-0 bg-skeu-base/80 backdrop-blur-xl border-b border-skeu">
                <Link href="/" className="flex items-center gap-3 group">
                    <ArrowLeft className="w-5 h-5 text-skeu-muted group-hover:text-[var(--accent-primary)] transition-colors" />
                    <span className="text-sm font-semibold tracking-wide text-skeu-secondary group-hover:text-skeu-primary transition-colors">Back to Home</span>
                </Link>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full border border-skeu bg-skeu-raised text-skeu-secondary hover:text-skeu-primary transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--surface-base)]"
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
            </header>

            {/* Document Content */}
            <div className="flex-grow z-10 w-full max-w-4xl mx-auto px-6 py-16 md:py-24">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-skeu-raised border border-skeu shadow-sm rounded-3xl p-8 md:p-14 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]"></div>

                    <motion.div variants={itemVariants} className="w-14 h-14 rounded-2xl bg-[var(--accent-secondary)] bg-opacity-10 mb-8 flex items-center justify-center text-[var(--accent-secondary)]">
                        <Scale className="w-7 h-7" />
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold tracking-tight text-skeu-primary mb-6">
                        Terms of Service
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-sm text-skeu-muted font-medium mb-12 uppercase tracking-widest">
                        Last Updated: February 2026
                    </motion.p>

                    <motion.div variants={itemVariants} className="space-y-10 text-skeu-secondary leading-relaxed font-medium">
                        <section>
                            <h2 className="text-2xl font-bold text-skeu-primary mb-4 tracking-tight">1. Agreement to Terms</h2>
                            <p>By accessing or using NeuraMark, you agree to be bound by these Terms of Service. If you do not agree, please do not use the application. We may change these Terms periodically, and continued use implies acceptance.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-skeu-primary mb-4 tracking-tight">2. Use License</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong className="text-skeu-primary">Restrictions:</strong> You may not modify, copy, or reverse-engineer the NeuraMark software, proprietary AI prediction models, or design systems.</li>
                                <li><strong className="text-skeu-primary">Academic Integrity:</strong> The platform is for analytical and tracking purposes. It does not replace official university grading systems or examination portals.</li>
                                <li><strong className="text-skeu-primary">Account Access:</strong> You must keep your credentials secure. NeuraMark is not responsible for data modifications made by unauthorized access occurring via user negligence.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-skeu-primary mb-4 tracking-tight">3. User Content</h2>
                            <p>You retain all intellectual property rights for documents and materials (e.g., test scripts, PDF reports) you upload to NeuraMark. By uploading, you grant us a secure, encrypted license to analyze these documents to provide progression predictions and automated scoring.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-skeu-primary mb-4 tracking-tight">4. Limitations</h2>
                            <p>In no event shall NeuraMark or its suppliers be liable for any damages (including, without limitation, damages for loss of academic progress data or lost university grades) arising out of the use or inability to use the materials on the platform.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-skeu-primary mb-4 tracking-tight">5. AI Predictions & Accuracy</h2>
                            <p>The academic predictions provided by our algorithms are estimates designed for guidance. They are not guaranteed outcomes. Final grades depend entirely on university examinations.</p>
                        </section>
                    </motion.div>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="w-full border-t border-skeu bg-skeu-raised/50 backdrop-blur-md z-20 mt-auto">
                <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4 md:mb-0 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                        <LogoIcon size={24} />
                        <span className="font-bold text-sm tracking-tight text-skeu-secondary">NeuraMark Systems</span>
                    </div>
                    <p className="text-sm text-skeu-muted font-medium mb-4 md:mb-0">
                        © {new Date().getFullYear()} NeuraMark. All rights reserved.
                    </p>
                </div>
            </footer>
        </main>
    );
}
