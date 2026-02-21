import React from 'react';
import { Upload } from 'lucide-react';
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';

interface UploadAreaProps {
  getRootProps: () => DropzoneRootProps;
  getInputProps: () => DropzoneInputProps;
  isDragActive: boolean;
}

const UploadArea: React.FC<UploadAreaProps> = ({ getRootProps, getInputProps, isDragActive }) => (
  <div
    {...getRootProps()}
    className={`skeu-inset rounded-xl p-8 text-center cursor-pointer transition-all duration-200 border-2 border-dashed ${isDragActive
        ? 'border-[var(--accent-primary)] opacity-90'
        : 'border-[var(--border-secondary)] hover:border-[var(--accent-primary)]'
      }`}
  >
    <input {...getInputProps()} />
    <Upload className="mx-auto h-12 w-12 mb-4" style={{ color: 'var(--text-muted)' }} />
    <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
      {isDragActive ? 'Drop the PDF here' : 'Drag & drop a PDF file here'}
    </p>
    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>or click to select a file</p>
  </div>
);

export default UploadArea;
