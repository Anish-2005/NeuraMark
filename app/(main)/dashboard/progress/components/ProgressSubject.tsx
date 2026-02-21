'use client'
import { ChevronDown, ChevronUp } from 'lucide-react'
import ProgressModule from './ProgressModule'
import { useTheme } from '@/app/context/ThemeContext'

type ProgressSubjectProps = {
  subject: {
    name: string
    code: string
    branch: string
    year: number
    semester: number
  }
  progress: {
    percentage: number
    completedCount: number
    totalModules: number
    completedModules: number[]
  }
  isExpanded: boolean
  onToggle: () => void
  modules: any[]
}

export default function ProgressSubject({
  subject,
  progress,
  isExpanded,
  onToggle,
  modules
}: ProgressSubjectProps) {
  const { theme, isDark } = useTheme()

  return (
    <div className="skeu-card-static rounded-xl border border-skeu overflow-hidden transition-all duration-300">
      <div
        className="p-5 cursor-pointer transition-all hover:opacity-80"
        onClick={onToggle}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {subject.name}
              <span className="text-sm ml-2" style={{ color: 'var(--text-secondary)' }}>
                ({subject.code})
              </span>
            </h3>
            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {subject.branch} • Year {subject.year} • Semester {subject.semester}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium"
                style={{ color: progress.percentage === 100 ? 'var(--accent-success)' : 'var(--accent-primary)' }}
              >
                {progress.percentage}% Complete
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {progress.completedCount} of {progress.totalModules} modules
              </div>
            </div>
            <button className="skeu-btn-icon p-2 rounded-lg"
              style={{ color: 'var(--accent-primary)' }}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 pt-0 animate-fadeIn" style={{ borderTop: '1px solid var(--border-primary)' }}>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {progress.completedCount} completed of {progress.totalModules} modules
              </span>
              <span className="text-sm font-medium"
                style={{ color: progress.percentage === 100 ? 'var(--accent-success)' : 'var(--accent-primary)' }}
              >
                {progress.percentage}%
              </span>
            </div>
            <div className="skeu-inset w-full rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{
                  width: `${progress.percentage}%`,
                  background: progress.percentage === 100
                    ? 'linear-gradient(to right, var(--accent-success), #10b981)'
                    : 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))'
                }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            {modules.map((module, index) => (
              <ProgressModule
                key={index}
                module={module}
                index={index}
                isCompleted={progress.completedModules.includes(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}