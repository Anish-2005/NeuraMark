import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface Subject {
  name: string;
  code: string;
  modules?: string[];
}

interface ProcessingResultProps {
  result: {
    branch: string;
    year: string;
    semester: string;
    subjects?: Subject[];
  } | null;
}

const ProcessingResult: React.FC<ProcessingResultProps> = ({ result }) => (
  result ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="skeu-card-static p-6 rounded-xl border border-skeu"
      style={{ borderLeft: '3px solid var(--accent-success)' }}
    >
      <div className="flex items-center space-x-2 mb-4">
        <CheckCircle className="h-6 w-6" style={{ color: 'var(--accent-success)' }} />
        <h3 className="text-lg font-semibold" style={{ color: 'var(--accent-success)' }}>
          Syllabus Successfully Processed!
        </h3>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Branch</p>
            <p style={{ color: 'var(--text-primary)' }}>{result.branch}</p>
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Year</p>
            <p style={{ color: 'var(--text-primary)' }}>{result.year}</p>
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Semester</p>
            <p style={{ color: 'var(--text-primary)' }}>{result.semester}</p>
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Subjects Found</p>
            <p style={{ color: 'var(--text-primary)' }}>{result.subjects?.length || 0}</p>
          </div>
        </div>
        {result.subjects && result.subjects.length > 0 && (
          <div>
            <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Extracted Subjects:</h4>
            <div className="space-y-2">
              {result.subjects.map((subject, index) => (
                <div key={index} className="skeu-inset p-3 rounded-lg">
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{subject.name}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Code: {subject.code}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Modules: {subject.modules?.length || 0}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  ) : null
);

export default ProcessingResult;
