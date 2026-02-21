import { motion } from 'framer-motion'

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

type FeaturesSectionProps = {
  features?: Feature[];
  isDark: boolean;
  cardBg?: string;
  borderColor?: string;
  textPrimary?: string;
  textSecondary?: string;
};

export default function FeaturesSection({
  features = [],
  isDark,
}: FeaturesSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      <h2 className="text-3xl font-bold text-center mb-12 skeu-text-embossed"
        style={{ color: 'var(--text-primary)' }}
      >
        Key Features
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map(({ icon, title, description }, i) => (
          <motion.div
            key={i}
            className="skeu-card p-7 rounded-xl cursor-default"
            whileHover={{ y: -4 }}
          >
            <div
              className="skeu-inset w-14 h-14 flex items-center justify-center rounded-xl mb-5"
              style={{ color: 'var(--accent-primary)' }}
            >
              {icon}
            </div>
            <h3 className="text-lg font-semibold mb-3 skeu-text-embossed"
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
