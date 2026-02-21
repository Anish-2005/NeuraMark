'use client'
import { useTheme } from '@/app/context/ThemeContext'

export default function ProgressSkeleton() {
  const { theme } = useTheme()

  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="skeu-card-static rounded-xl p-4 border border-skeu animate-pulse">
          <div className="flex justify-between">
            <div className="space-y-2 w-2/3">
              <div className="h-4 rounded w-3/4" style={{ background: 'var(--border-secondary)' }}></div>
              <div className="h-3 rounded w-1/2" style={{ background: 'var(--border-secondary)' }}></div>
            </div>
            <div className="space-y-2 w-1/4">
              <div className="h-4 rounded w-full" style={{ background: 'var(--border-secondary)' }}></div>
              <div className="h-3 rounded w-3/4" style={{ background: 'var(--border-secondary)' }}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}