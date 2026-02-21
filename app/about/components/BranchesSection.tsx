import { CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

type BranchesSectionProps = {
  branches: string[];
  isDark: boolean;
  cardBg?: string;
  borderColor?: string;
  textPrimary?: string;
};

export default function BranchesSection({ branches, isDark }: BranchesSectionProps) {
  return (
    <section className="skeu-card-static max-w-5xl mx-auto px-8 sm:px-12 mb-24 rounded-2xl py-10">
      <h2 className="text-3xl font-bold text-center mb-10 skeu-text-embossed"
        style={{ color: 'var(--text-primary)' }}
      >
        Supported Engineering Branches
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {branches.map((branch, idx) => (
          <motion.div
            key={idx}
            className="skeu-inset flex items-center space-x-3 cursor-default px-4 py-3 rounded-xl"
            whileHover={{ scale: 1.02 }}
          >
            <CheckCircle
              className="w-5 h-5 shrink-0"
              style={{ color: 'var(--accent-success)' }}
              strokeWidth={2.5}
            />
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {branch}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
