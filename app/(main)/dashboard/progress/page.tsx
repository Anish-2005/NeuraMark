'use client'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import { useAuth } from '@/app/context/AuthContext'
import { useTheme } from '@/app/context/ThemeContext'
import { useEffect, useState, useCallback } from 'react'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Filter } from 'lucide-react'
import ProgressHeader from './components/ProgressHeader'
import ProgressSidebar from './components/ProgressSidebar'
import ProgressSubject from './components/ProgressSubject'
import ProgressSkeleton from './components/ProgressSkeleton'
import ProgressEmptyState from './components/ProgressEmptyState'

interface Module {
  name: string
  topics: string[] | string
}

interface Subject {
  id?: string
  name: string
  code: string
  modules: Module[]
  semester?: number
  branch?: string
  year?: number
}

export default function MyProgressPage() {
  const { user, logout } = useAuth()
  const { theme } = useTheme()
  const [loading, setLoading] = useState<boolean>(true)
  const [userProgress, setUserProgress] = useState<Record<string, any> | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [syllabusData, setSyllabusData] = useState<Record<string, Subject>>({})
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([])
  const [selectedSemester, setSelectedSemester] = useState<string>('all')
  const [userPreferences, setUserPreferences] = useState<Record<string, any> | null>(null)
  const router = useRouter()

  // Skeuomorphic theme styles
  const isDark = theme === 'dark'
  const bgColor = ''
  const cardBg = 'skeu-card-static'
  const textColor = 'text-skeu-primary'
  const secondaryText = 'text-skeu-secondary'
  const borderColor = 'border-skeu'

  const fetchUserData = useCallback(async () => {
    setLoading(true)
    if (!user) {
      setLoading(false)
      return
    }
    try {
      // Fetch user preferences
      const preferencesDoc = await getDoc(doc(db, 'userPreferences', user.uid))
      if (preferencesDoc.exists()) {
        const prefs = preferencesDoc.data()
        setUserPreferences(prefs)
        setSelectedSemester(prefs.defaultSemester || 'all')
      } else {
        // Create default preferences
        const defaultPrefs = { defaultSemester: 'all' }
        await setDoc(doc(db, 'userPreferences', user.uid), defaultPrefs)
        setUserPreferences(defaultPrefs)
        setSelectedSemester('all')
      }

      // Fetch user progress
      const progressDoc = await getDoc(doc(db, 'userProgress', user.uid))
      if (progressDoc.exists()) {
        setUserProgress(progressDoc.data())
      } else {
        setUserProgress(null)
      }

      // Fetch syllabus data for all subjects in progress
      if (progressDoc.exists()) {
        const progressData = progressDoc.data()
        const subjectIds = Object.keys(progressData)
          .filter(key => key.startsWith('subject_'))
          .map(key => key.replace('subject_', ''))

        const syllabusMap: Record<string, Subject> = {}
        for (const subjectId of subjectIds) {
          const subjectDoc = await getDoc(doc(db, 'syllabus', subjectId))
          if (subjectDoc.exists()) {
            syllabusMap[subjectId] = subjectDoc.data() as Subject
          }
        }
        setSyllabusData(syllabusMap)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user, fetchUserData])

  const toggleSubjectExpand = (subjectId: string) => {
    setExpandedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    )
  }

  const handleSemesterChange = async (semester: string) => {
    setSelectedSemester(semester)
    try {
      if (!user) return
      await updateDoc(doc(db, 'userPreferences', user.uid), {
        defaultSemester: semester
      })
    } catch (error) {
      console.error('Error saving semester preference:', error)
    }
  }

  const getAvailableSemesters = (): number[] => {
    const semesters = new Set<number>()
    Object.values(syllabusData).forEach((subject: Subject) => {
      if (subject && subject.semester != null) {
        semesters.add(Number(subject.semester))
      }
    })
    return Array.from(semesters).sort((a, b) => a - b)
  }
  const filterSubjectsBySemester = () => {
    if (!userProgress) return []

    return Object.entries(userProgress)
      .filter(([key]) => key.startsWith('subject_'))
      .filter(([key]) => {
        const subjectId = key.replace('subject_', '')
        const subjectInfo = syllabusData[subjectId]
        if (!subjectInfo) return false
        if (selectedSemester === 'all') return true
        return subjectInfo.semester === parseInt(selectedSemester)
      })
  }

  const calculateProgress = (subjectProgress: Record<string, any>, subjectId: string) => {
    const subjectInfo = syllabusData[subjectId]
    if (!subjectInfo || !subjectInfo.modules) return {
      percentage: 0,
      completedCount: 0,
      totalModules: 0,
      completedModules: []
    }

    const totalModules = subjectInfo.modules.length
    if (totalModules === 0) return {
      percentage: 0,
      completedCount: 0,
      totalModules: 0,
      completedModules: []
    }

    let completedCount = 0
    const completedModules = []

    for (let i = 0; i < totalModules; i++) {
      if (subjectProgress[`module_${i}`] === true) {
        completedCount++
        completedModules.push(i)
      }
    }

    return {
      percentage: Math.round((completedCount / totalModules) * 100),
      completedCount,
      totalModules,
      completedModules
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen transition-colors duration-200 pb-8" style={{ background: 'var(--surface-base)' }}>
        <ProgressHeader
          user={user}
          loading={loading}
          onRefresh={fetchUserData}
          onMenuOpen={() => setSidebarOpen(true)}
        />

        <ProgressSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={user}
          loading={loading}
          onRefresh={fetchUserData}
          logout={logout}
        />

        <main className={`max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 ${textColor} py-6`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`${cardBg} p-6 sm:p-8 rounded-2xl ${borderColor} border`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="skeu-inset p-3 rounded-2xl">
                  <svg className="w-8 h-8" style={{ color: 'var(--accent-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className={`text-2xl sm:text-3xl font-bold ${textColor} mb-1`}>
                    Your Learning Progress
                  </h2>
                  <div className={`flex items-center space-x-2 ${secondaryText} text-sm font-medium`}>
                    <span className="skeu-badge text-xs">
                      {user?.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <ProgressSkeleton />
            ) : !userProgress ? (
              <ProgressEmptyState />
            ) : (
              <>
                {/* Semester Filter */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Filter className={`w-5 h-5 ${secondaryText}`} />
                      <span className={`text-sm font-medium ${textColor}`}>Filter by Semester:</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleSemesterChange('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 active:scale-95 ${selectedSemester === 'all'
                            ? 'skeu-btn-primary'
                            : 'skeu-btn-secondary'
                          }`}
                      >
                        All Semesters
                      </button>
                      {getAvailableSemesters().map(semester => (
                        <button
                          key={semester}
                          onClick={() => handleSemesterChange(semester.toString())}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 active:scale-95 ${selectedSemester === semester.toString()
                              ? 'skeu-btn-primary'
                              : 'skeu-btn-secondary'
                            }`}
                        >
                          Semester {semester}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {filterSubjectsBySemester().length === 0 ? (
                    <div className={`text-center py-16`}>
                      <div className="inline-block">
                        <div className="skeu-inset p-6 rounded-2xl">
                          <Filter className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Subjects Found</h3>
                          <p style={{ color: 'var(--text-secondary)' }}>No subjects found for the selected semester.</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    filterSubjectsBySemester().map(([key, value]) => {
                      const subjectId = key.replace('subject_', '')
                      const subjectInfo = syllabusData[subjectId]
                      if (!subjectInfo) return null

                      const progress = calculateProgress(value, subjectId)
                      const isExpanded = expandedSubjects.includes(subjectId)

                      // Ensure branch and year are present (fallback to empty string/0 if missing)
                      const subjectWithRequiredFields = {
                        ...subjectInfo,
                        branch: subjectInfo.branch ?? '',
                        year: subjectInfo.year ?? 0,
                        semester: subjectInfo.semester ?? 0,
                      }

                      return (
                        <ProgressSubject
                          key={key}
                          subject={subjectWithRequiredFields}
                          progress={progress}
                          isExpanded={isExpanded}
                          onToggle={() => toggleSubjectExpand(subjectId)}
                          modules={subjectInfo.modules || []}
                        />
                      )
                    })
                  )}
                </div>
              </>
            )}
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  )
}