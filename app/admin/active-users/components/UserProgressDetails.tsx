import React from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';

interface SubjectModule {
  name: string;
}
interface SubjectInfo {
  name: string;
  code: string;
  branch: string;
  year: number;
  semester: number;
  modules: SubjectModule[];
}
interface SubjectProgress {
  [key: string]: boolean | any;
}
interface ProgressResult {
  percentage: number;
  completedCount: number;
  totalModules: number;
}
interface UserProgressDetailsProps {
  progress: any;
  syllabusData: { [key: string]: SubjectInfo };
  calculateProgress: (subjectProgress: SubjectProgress, subjectId: string) => ProgressResult;
  formatDate: (date: Date | null) => string;
}

export default function UserProgressDetails({ progress, syllabusData, calculateProgress, formatDate }: UserProgressDetailsProps) {
  if (!progress) return <div className="text-sm italic" style={{ color: 'var(--text-muted)' }}>No progress data available</div>;
  return (
    <div className="skeu-card-static rounded-xl border border-skeu p-6">
      <h4 className="font-semibold flex items-center mb-4" style={{ color: 'var(--text-primary)' }}>
        <BookOpen className="w-5 h-5 mr-2" style={{ color: 'var(--accent-primary)' }} />
        Learning Progress
      </h4>
      <div className="space-y-6">
        {Object.entries(progress).map(([key, value]) => {
          if (key === 'updatedAt') return null;
          const subjectId = key.replace('subject_', '');
          const subjectInfo: SubjectInfo = syllabusData[subjectId];
          if (!subjectInfo) return null;
          const subjectProgress: SubjectProgress = value as SubjectProgress;
          const progressResult: ProgressResult = calculateProgress(subjectProgress, subjectId);
          return (
            <div key={key} className="skeu-inset rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h5 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{subjectInfo.name}</h5>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {subjectInfo.code} • {subjectInfo.branch} • Year {subjectInfo.year} • Sem {subjectInfo.semester}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold"
                    style={{ color: progressResult.percentage === 100 ? 'var(--accent-success)' : 'var(--accent-primary)' }}
                  >
                    {progressResult.percentage}%
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {progressResult.completedCount} of {progressResult.totalModules} modules
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="skeu-inset w-full rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${progressResult.percentage}%`,
                      background: progressResult.percentage === 100
                        ? 'var(--accent-success)'
                        : 'var(--accent-primary)'
                    }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {subjectInfo.modules?.map((module: SubjectModule, index: number) => {
                  const isCompleted: boolean = subjectProgress[`module_${index}`] === true;
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg transition-colors ${isCompleted
                          ? 'skeu-card-static'
                          : 'skeu-inset'
                        }`}
                      style={isCompleted ? { borderLeft: '3px solid var(--accent-success)' } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium"
                          style={{ color: isCompleted ? 'var(--accent-success)' : 'var(--text-primary)' }}
                        >
                          Module {index + 1}: {module.name}
                        </span>
                        {isCompleted && (
                          <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--accent-success)' }} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {progress.updatedAt && (
        <div className="text-xs mt-4 pt-4" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border-primary)' }}>
          Last updated: {formatDate(progress.updatedAt.toDate())}
        </div>
      )}
    </div>
  );
}
