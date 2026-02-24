import { LogoIcon } from '@/app/components/Logo'

type HeroSectionProps = {
  isDark: boolean;
  textPrimary?: string;
  textSecondary?: string;
};

export default function HeroSection({ isDark }: HeroSectionProps) {
  return (
    <section className="text-center mb-20 max-w-3xl mx-auto px-4">
      <div className="flex justify-center mb-8">
        <div className="skeu-card-static p-3 rounded-2xl">
          <LogoIcon size={90} />
        </div>
      </div>
      <h1
        className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-5 skeu-text-embossed"
        style={{ lineHeight: 1.1, color: 'var(--text-primary)' }}
      >
        About NeuraMark
      </h1>
      <p
        className="text-lg sm:text-xl max-w-xl mx-auto leading-relaxed"
        style={{ letterSpacing: '0.015em', color: 'var(--text-secondary)' }}
      >
        Your intelligent B.Tech syllabus tracker designed to help students systematically cover their entire curriculum with ease and insight.
      </p>
    </section>
  )
}
