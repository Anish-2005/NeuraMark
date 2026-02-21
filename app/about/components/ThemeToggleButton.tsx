"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Sun } from "lucide-react"

type ThemeToggleButtonProps = {
  isDark: boolean;
  toggleTheme: () => void;
};

export default function ThemeToggleButton({ isDark, toggleTheme }: ThemeToggleButtonProps) {
  return (
    <button
      onClick={toggleTheme}
      className="skeu-btn-icon fixed top-4 right-4 z-50 rounded-full"
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
            style={{ color: 'var(--accent-warning)' }}
          >
            <Sun className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ color: 'var(--accent-primary)' }}
          >
            <Moon className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}
