import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingStatusProps {
  isProcessing: boolean;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ isProcessing }) => (
  isProcessing ? (
    <div className="skeu-inset flex items-center justify-center space-x-3 p-4 rounded-xl">
      <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--accent-primary)' }} />
      <p className="font-medium" style={{ color: 'var(--accent-primary)' }}>
        Processing PDF with AI... This may take a few moments.
      </p>
    </div>
  ) : null
);

export default ProcessingStatus;
