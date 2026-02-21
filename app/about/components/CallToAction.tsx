import Link from 'next/link'
import { motion } from 'framer-motion'

interface CallToActionProps {
  isDark: boolean;
  textPrimary?: string;
}

export default function CallToAction({ isDark }: CallToActionProps) {
  return (
    <section className="text-center max-w-xl mx-auto mb-16 px-4">
      <h2 className="text-3xl font-bold mb-8 skeu-text-embossed"
        style={{ color: 'var(--text-primary)' }}
      >
        Ready to organize your studies?
      </h2>
      <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="inline-block">
        <Link
          href="/dashboard"
          className="skeu-btn-primary inline-block px-10 py-4 rounded-xl text-lg"
        >
          Get Started with NeuraMark
        </Link>
      </motion.div>
    </section>
  )
}
