import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, XCircle } from 'lucide-react';

interface FilePreviewProps {
  uploadedFile: File | null;
  resetUpload: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ uploadedFile, resetUpload }) => (
  <AnimatePresence>
    {uploadedFile && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="skeu-card-static flex items-center justify-between p-4 rounded-xl border border-skeu"
      >
        <div className="flex items-center space-x-3">
          <div className="skeu-inset p-2 rounded-lg">
            <FileText className="h-6 w-6" style={{ color: 'var(--accent-danger)' }} />
          </div>
          <div>
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{uploadedFile.name}</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <button
          onClick={resetUpload}
          className="skeu-btn-icon rounded-lg p-2"
          style={{ color: 'var(--text-muted)' }}
        >
          <XCircle className="h-5 w-5" />
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);

export default FilePreview;
