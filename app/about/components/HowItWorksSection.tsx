import { Users, FileText, BarChart2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface HowItWorksSectionProps {
  isDark: boolean;
  cardBg?: string;
  borderColor?: string;
  textPrimary?: string;
  textSecondary?: string;
}

export default function HowItWorksSection({
  isDark,
}: HowItWorksSectionProps) {
  const steps = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Select Your Branch',
      description: 'Choose your engineering branch and academic year to see your customized syllabus.',
      color: 'var(--accent-primary)',
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Track Subjects',
      description: 'View all subjects for your semester and track your progress module by module.',
      color: 'var(--accent-secondary)',
    },
    {
      icon: <BarChart2 className="w-8 h-8" />,
      title: 'Monitor Progress',
      description: 'Visualize your completion rates and identify areas that need more focus.',
      color: 'var(--accent-success)',
    }
  ]

  return (
    <section className="skeu-card-static max-w-6xl mx-auto px-8 py-12 mb-24 rounded-2xl">
      <h2 className="text-3xl font-bold text-center mb-12 skeu-text-embossed"
        style={{ color: 'var(--text-primary)' }}
      >
        How NeuraMark Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {steps.map(({ icon, title, description, color }, i) => (
          <motion.div
            key={i}
            className="text-center cursor-default p-6"
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {/* Step number badge */}
            <div className="flex justify-center mb-4">
              <div className="skeu-inset w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ color: 'var(--text-muted)' }}
              >
                {i + 1}
              </div>
            </div>
            {/* Icon */}
            <div
              className="skeu-card-static w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6"
              style={{ color }}
            >
              {icon}
            </div>
            <h3 className="text-xl font-semibold mb-3 skeu-text-embossed"
              style={{ color: 'var(--text-primary)' }}
            >
              {title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
