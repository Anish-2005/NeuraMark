import React from 'react';
import { XCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => (
  error ? (
    <div className="skeu-inset p-4 rounded-xl" style={{ borderLeft: '3px solid var(--accent-danger)' }}>
      <div className="flex items-center space-x-2">
        <XCircle className="h-5 w-5" style={{ color: 'var(--accent-danger)' }} />
        <p className="font-medium" style={{ color: 'var(--accent-danger)' }}>{error}</p>
      </div>
    </div>
  ) : null
);

export default ErrorDisplay;
