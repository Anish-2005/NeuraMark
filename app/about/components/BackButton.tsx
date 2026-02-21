import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BackButton({ isDark }: { isDark: boolean }) {
  return (
    <motion.div
      className="fixed top-5 left-5 z-50"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Link
        href="/"
        aria-label="Go back to home"
        className="skeu-btn-icon p-3 rounded-full flex items-center justify-center"
      >
        <ArrowLeft
          className="w-5 h-5"
          style={{ color: 'var(--accent-primary)' }}
          strokeWidth={2.5}
        />
      </Link>
    </motion.div>
  )
}
