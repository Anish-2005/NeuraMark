'use client';
import Link from 'next/link';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { Moon, Sun, ArrowRight, Zap, Target, BookOpen, Layers, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoIcon } from './components/Logo';

export default function Home() {
  const { user } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  // Premium Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.4 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }
    })
  };

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'var(--surface-base)' }}>
      {/* Abstract Animated Glow Backdrops */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full blur-[120px]"
          style={{ background: isDark ? 'rgba(62, 207, 114, 0.08)' : 'rgba(22, 163, 74, 0.05)' }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full blur-[100px]"
          style={{ background: isDark ? 'rgba(13, 148, 136, 0.06)' : 'rgba(13, 148, 136, 0.04)' }}
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Header / Nav */}
      <header className="w-full flex justify-between items-center py-6 px-5 sm:px-8 md:px-16 z-50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-3"
        >
          <LogoIcon size={36} />
          <span className="text-xl font-bold tracking-tight text-skeu-primary hidden sm:block">
            Neura<span style={{ color: 'var(--accent-primary)' }}>Mark</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4"
        >
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
        </motion.div>
      </header>

      {/* Main Hero Content */}
      <div className="flex-grow flex flex-col items-center justify-center mt-4 md:-mt-10 z-10 px-4 sm:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-5xl mx-auto"
        >
          {/* Pill Badge */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <div className="relative px-4 py-1.5 rounded-full border border-[var(--accent-primary)] text-[var(--accent-primary)] text-sm font-semibold tracking-wide flex items-center gap-2 overflow-hidden">
              {/* Opacity Layer hack for CSS variable backgrounds */}
              <div className="absolute inset-0 bg-[var(--accent-primary)] opacity-10 pointer-events-none"></div>

              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-success)]"></span>
              </span>
              <span className="relative">Next-Gen Academic Analytics OS</span>
            </div>
          </motion.div>

          {/* Core Title */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-bold mb-6 tracking-tighter leading-[1.1] md:leading-[1.05]"
            style={{ color: 'var(--text-primary)' }}
          >
            Master Your Syllabus.<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent-success)] block mt-2 md:mt-0 xl:inline">
              Predict The Future.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl md:text-2xl mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Gain unparalleled visibility into your B.Tech journey. Track progress across <strong className="text-skeu-primary font-bold">CSE, ECE, AIML, DS</strong> and more with beautifully engineered interfaces and AI-driven insights.
          </motion.p>

          {/* Call To Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center mb-16 md:mb-24 items-center w-full max-w-md mx-auto sm:max-w-none"
          >
            <Link
              href={user ? '/dashboard' : '/login'}
              className="group relative flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-4 text-base md:text-lg font-semibold text-white transition-all duration-300 bg-[var(--accent-primary)] rounded-full hover:bg-[var(--accent-primary-hover)] hover:shadow-lg hover:shadow-[var(--accent-primary)]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)] scale-100 hover:scale-105 active:scale-95"
            >
              <span>{user ? 'Enter Dashboard' : 'Start Your Journey'}</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              {/* Premium Inner Glow */}
              <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none mix-blend-overlay"></div>
            </Link>

            <Link
              href="/about"
              className="group flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-4 text-base md:text-lg font-semibold transition-all duration-300 bg-transparent border-2 rounded-full text-skeu-primary border-skeu hover:bg-skeu-inset focus:outline-none scale-100 hover:scale-105 active:scale-95"
            >
              <BookOpen className="w-5 h-5 text-skeu-muted group-hover:text-[var(--accent-primary)] transition-colors" />
              <span>Explore Features</span>
            </Link>
          </motion.div>

        </motion.div>
      </div>

      {/* Features Dock Grid */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-20">
        <motion.div
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: <Target className="w-6 h-6" />, title: 'Precision Tracking', desc: 'Log exact chapters, modules, and credit weights dynamically.', color: 'var(--accent-primary)' },
            { icon: <Zap className="w-6 h-6" />, title: 'Live Insights', desc: 'Real-time progression algorithms predict what you should study next.', color: 'var(--accent-warning)' },
            { icon: <Layers className="w-6 h-6" />, title: 'Multi-Branch Support', desc: 'Automatically tailored schemas for CSE, ECE, AIML, and Core branches.', color: 'var(--accent-secondary)' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={featureVariants}
              className="p-8 rounded-3xl bg-skeu-raised border border-skeu shadow-sm hover:shadow-xl hover:border-[var(--accent-primary)] transition-all duration-300 group cursor-default relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full hover:h-1 transition-all duration-300 h-0" style={{ background: feature.color }}></div>
              <div className="w-12 h-12 rounded-2xl bg-opacity-10 mb-6 flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-skeu-primary tracking-tight">{feature.title}</h3>
              <p className="text-skeu-secondary leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
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
            © {new Date().getFullYear()} NeuraMark. Crafted for true scholars.
          </p>
          <div className="flex justify-center md:justify-end gap-6 md:gap-4 text-sm font-semibold text-skeu-muted">
            <Link href="/privacy" className="hover:text-skeu-primary cursor-pointer transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-skeu-primary cursor-pointer transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}