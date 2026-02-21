'use client'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/app/context/ThemeContext'

export default function ProgressEmptyState() {
  const { theme } = useTheme()

  return (
    <div className="text-center py-8">
      <div className="skeu-inset inline-flex p-4 rounded-2xl mb-4">
        <BookOpen size={48} style={{ color: 'var(--text-muted)' }} />
      </div>
      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>No progress data available</p>
      <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Your completed modules will appear here after you mark them in your subjects.
      </p>
      <Link
        href="/dashboard"
        className="mt-4 inline-block skeu-btn-primary px-4 py-2 rounded-lg text-sm font-medium"
      >
        Go to Dashboard
      </Link>
    </div>
  )
}