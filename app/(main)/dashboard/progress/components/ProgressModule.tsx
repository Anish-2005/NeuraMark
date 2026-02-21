'use client'
import { useTheme } from '@/app/context/ThemeContext'

interface ModuleProp {
  name: string
  topics: string[] | string
}

interface ProgressModuleProps {
  module: ModuleProp
  index: number
  isCompleted: boolean
}

export default function ProgressModule({ module, index, isCompleted }: ProgressModuleProps) {
  const { theme } = useTheme()

  return (
    <div
      className={`p-3 rounded-lg transition-colors ${isCompleted
          ? 'skeu-inset'
          : 'skeu-card-static border border-skeu'
        }`}
      style={isCompleted ? { borderLeft: '3px solid var(--accent-success)' } : {}}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Module {index + 1}: {module.name}
          </h4>
          {isCompleted && (
            <div className="text-xs mt-1" style={{ color: 'var(--accent-success)' }}>
              Status: Completed
            </div>
          )}
          {(Array.isArray(module.topics) ? module.topics.length > 0 : !!module.topics) && (
            <div className="mt-2">
              <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Topics:</div>
              <ul className="list-disc list-inside ml-4">
                {(Array.isArray(module.topics) ? module.topics : [module.topics]).map((topic, i) => (
                  <li key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}